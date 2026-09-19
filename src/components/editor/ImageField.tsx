"use client";

import { useRef, useState } from "react";
import { fileToCompressedDataUrl } from "@/lib/images";
import { uid } from "@/lib/portfolio";
import type { PortfolioImage } from "@/lib/types";

export function ImageField({
  label,
  hint,
  multiple = false,
  images,
  onChange,
  max = 8,
}: {
  label: string;
  hint?: string;
  multiple?: boolean;
  images: PortfolioImage[];
  onChange: (images: PortfolioImage[]) => void;
  max?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    try {
      const next: PortfolioImage[] = [];
      const list = Array.from(files).slice(0, max);
      for (const file of list) {
        const src = await fileToCompressedDataUrl(file);
        next.push({ id: uid(), src, name: file.name });
      }
      onChange(multiple ? [...images, ...next].slice(0, max) : next.slice(0, 1));
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <label className="text-sm font-medium text-zinc-200">{label}</label>
        {hint ? <p className="text-xs text-zinc-500">{hint}</p> : null}
      </div>
      <div className="flex flex-wrap gap-2">
        {images.map((image) => (
          <div key={image.id} className="relative h-20 w-20 overflow-hidden rounded-xl">
            <img src={image.src} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              className="absolute right-1 top-1 rounded-full bg-black/70 px-1.5 text-[10px] text-white"
              onClick={() => onChange(images.filter((item) => item.id !== image.id))}
            >
              ×
            </button>
          </div>
        ))}
        {images.length < max ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-20 w-20 items-center justify-center rounded-xl border border-dashed border-white/15 text-xs text-zinc-400"
          >
            {busy ? "..." : "+"}
          </button>
        ) : null}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        hidden
        onChange={(event) => void onFiles(event.target.files)}
      />
    </div>
  );
}
