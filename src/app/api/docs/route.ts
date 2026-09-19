import { NextResponse } from "next/server";
import { MAX_PDF_BYTES, isSafeDocId, saveUploadedPdf } from "@/lib/docs";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Falta el PDF" }, { status: 400 });
    }
    const isPdf =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      return NextResponse.json({ error: "Solo se aceptan archivos PDF" }, { status: 400 });
    }
    if (file.size > MAX_PDF_BYTES) {
      return NextResponse.json(
        { error: "El PDF no puede superar 120 MB" },
        { status: 413 },
      );
    }
    const id = crypto.randomUUID();
    if (!isSafeDocId(id)) {
      return NextResponse.json({ error: "No se pudo guardar el archivo" }, { status: 500 });
    }
    const bytes = Buffer.from(await file.arrayBuffer());
    await saveUploadedPdf(id, bytes, file.name);
    return NextResponse.json({
      id,
      name: file.name,
      src: `/api/docs/${id}`,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo subir el PDF";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
