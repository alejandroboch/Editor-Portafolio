import { NextResponse } from "next/server";
import { isSafeDocId, openUploadedPdf } from "@/lib/docs";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!isSafeDocId(id)) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }
  const file = await openUploadedPdf(id);
  if (!file) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }
  const filename = file.name.replace(/[^\w.\- áéíóúüñÁÉÍÓÚÜÑ]+/g, "_");
  return new NextResponse(file.stream, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(file.size),
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
