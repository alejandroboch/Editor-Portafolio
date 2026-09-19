import { promises as fs } from "fs";
import path from "path";
import type { Portfolio } from "./types";

const dataDir = path.join(process.cwd(), "data", "portfolios");
const tmpDir = path.join("/tmp", "atelier-portfolios");
const memory = new Map<string, Portfolio>();

async function writeJson(dir: string, id: string, portfolio: Portfolio) {
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(
    path.join(dir, `${id}.json`),
    JSON.stringify(portfolio),
    "utf8",
  );
}

async function readJson(dir: string, id: string): Promise<Portfolio | null> {
  try {
    const raw = await fs.readFile(path.join(dir, `${id}.json`), "utf8");
    return JSON.parse(raw) as Portfolio;
  } catch {
    return null;
  }
}

async function saveJsonBlob(portfolio: Portfolio) {
  const res = await fetch("https://jsonblob.com/api/jsonBlob", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(portfolio),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error("No se pudo publicar el portafolio");
  const location = res.headers.get("Location") || res.headers.get("location") || "";
  const id = location.split("/").filter(Boolean).pop();
  if (!id) throw new Error("No se recibió un enlace público");
  return id;
}

async function readJsonBlob(id: string): Promise<Portfolio | null> {
  const res = await fetch(`https://jsonblob.com/api/jsonBlob/${id}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) return null;
  return (await res.json()) as Portfolio;
}

export async function savePublished(portfolio: Portfolio) {
  const localId = portfolio.slug;
  memory.set(localId, portfolio);
  try {
    await writeJson(dataDir, localId, portfolio);
  } catch {
    try {
      await writeJson(tmpDir, localId, portfolio);
    } catch {
      /* ignore local write errors on serverless */
    }
  }

  try {
    const remoteId = await saveJsonBlob(portfolio);
    memory.set(remoteId, portfolio);
    try {
      await writeJson(dataDir, remoteId, portfolio);
    } catch {
      /* ignore */
    }
    return remoteId;
  } catch {
    return localId;
  }
}

export async function getPublished(id: string): Promise<Portfolio | null> {
  const cached = memory.get(id);
  if (cached) return cached;
  const local =
    (await readJson(dataDir, id)) || (await readJson(tmpDir, id));
  if (local) return local;
  const remote = await readJsonBlob(id);
  if (remote) memory.set(id, remote);
  return remote;
}
