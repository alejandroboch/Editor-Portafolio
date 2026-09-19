"use client";

import { useState } from "react";
import type { Project, ProjectDoc } from "@/lib/types";

export function ProjectDocs({
  project,
  className = "",
}: {
  project: Project;
  className?: string;
}) {
  const docs = project.docs ?? [];
  const [open, setOpen] = useState<ProjectDoc | null>(null);
  if (!docs.length) return null;

  return (
    <div className={`mt-4 space-y-2 ${className}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-70">
        Trabajo escrito
      </p>
      <ul className="space-y-2">
        {docs.map((doc) => (
          <li key={doc.id} className="flex flex-wrap items-center gap-2 text-sm">
            <span className="truncate">{doc.name}</span>
            <button
              type="button"
              className="underline underline-offset-2"
              onClick={() => setOpen(doc)}
            >
              Leer
            </button>
            <a href={doc.src} download={doc.name} className="underline underline-offset-2">
              Descargar
            </a>
          </li>
        ))}
      </ul>
      {open ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setOpen(null)}
        >
          <div
            className="flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-zinc-950"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 text-sm text-white">
              <p className="truncate">{open.name}</p>
              <div className="flex items-center gap-3">
                <a href={open.src} download={open.name} className="underline">
                  Descargar
                </a>
                <button type="button" onClick={() => setOpen(null)}>
                  Cerrar
                </button>
              </div>
            </div>
            <iframe title={open.name} src={open.src} className="h-full w-full bg-white" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
