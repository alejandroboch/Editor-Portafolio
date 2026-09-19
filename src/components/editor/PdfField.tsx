"use client";

import { useRef, useState } from "react";
import type { ProjectDoc } from "@/lib/types";

const MAX_PDF_BYTES = 120 * 1024 * 1024;

export function PdfField({
  docs,
  onChange,
  max = 3,
}: {
  docs: ProjectDoc[];
  onChange: (docs: ProjectDoc[]) => void;
  max?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError("");
    try {
      const next: ProjectDoc[] = [];
      for (const file of Array.from(files).slice(0, max)) {
        const isPdf =
          file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
        if (!isPdf) {
          setError("Solo se aceptan archivos PDF.");
          continue;
        }
        if (file.size > MAX_PDF_BYTES) {
          setError("Cada PDF debe pesar menos de 120 MB.");
          continue;
        }
        const body = new FormData();
        body.append("file", file);
        const res = await fetch("/api/docs", { method: "POST", body });
        const data = (await res.json()) as ProjectDoc & { error?: string };
        if (!res.ok || !data.src) {
          setError(data.error || "No se pudo subir el PDF.");
          continue;
        }
        next.push({ id: data.id, src: data.src, name: data.name });
      }
      if (next.length) onChange([...docs, ...next].slice(0, max));
    } catch {
      setError("No se pudo subir el PDF. Inténtalo de nuevo.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <label className="text-sm font-medium text-zinc-200">
          Trabajo escrito (PDF)
        </label>
        <p className="text-xs text-zinc-500">Opcional. Máx. {max} archivos, 120 MB c/u</p>
      </div>
      <ul className="space-y-2">
        {docs.map((doc) => (
          <li
            key={doc.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
          >
            <span className="truncate text-zinc-200">{doc.name}</span>
            <button
              type="button"
              className="shrink-0 text-xs text-zinc-400 hover:text-white"
              onClick={() => onChange(docs.filter((item) => item.id !== doc.id))}
            >
              Quitar
            </button>
          </li>
        ))}
      </ul>
      {docs.length < max ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-xl border border-dashed border-white/15 px-3 py-2 text-sm text-zinc-300"
        >
          {busy ? "Subiendo…" : "+ Subir PDF"}
        </button>
      ) : null}
      {error ? <p className="text-xs text-rose-300">{error}</p> : null}
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        multiple
        hidden
        onChange={(event) => void onFiles(event.target.files)}
      />
    </div>
  );
}
