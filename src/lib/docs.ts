import { createReadStream, promises as fs } from "fs";
import path from "path";
import { Readable } from "stream";

export const MAX_PDF_BYTES = 120 * 1024 * 1024;

const dataDir = path.join(process.cwd(), "data", "docs");
const tmpDir = path.join("/tmp", "atelier-docs");

export function isSafeDocId(id: string) {
  return /^[a-z0-9-]{8,80}$/i.test(id);
}

async function writeDoc(dir: string, id: string, bytes: Buffer, name: string) {
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, `${id}.pdf`), bytes);
  await fs.writeFile(
    path.join(dir, `${id}.json`),
    JSON.stringify({ name }),
    "utf8",
  );
}

export async function saveUploadedPdf(id: string, bytes: Buffer, name: string) {
  try {
    await writeDoc(dataDir, id, bytes, name);
    return dataDir;
  } catch {
    await writeDoc(tmpDir, id, bytes, name);
    return tmpDir;
  }
}

async function readMeta(dir: string, id: string) {
  try {
    const raw = await fs.readFile(path.join(dir, `${id}.json`), "utf8");
    const parsed = JSON.parse(raw) as { name?: string };
    return parsed.name || `${id}.pdf`;
  } catch {
    return `${id}.pdf`;
  }
}

export async function openUploadedPdf(id: string) {
  for (const dir of [dataDir, tmpDir]) {
    const filePath = path.join(dir, `${id}.pdf`);
    try {
      const info = await fs.stat(filePath);
      if (!info.isFile()) continue;
      const name = await readMeta(dir, id);
      const stream = Readable.toWeb(createReadStream(filePath)) as ReadableStream<Uint8Array>;
      return { stream, size: info.size, name };
    } catch {
      /* try next dir */
    }
  }
  return null;
}
