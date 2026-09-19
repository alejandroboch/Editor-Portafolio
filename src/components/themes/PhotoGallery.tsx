"use client";

import { useEffect, useState, type CSSProperties } from "react";
import type { PhotoStyle, PortfolioImage } from "@/lib/types";
import { withAlpha } from "./media";

export type GalleryLayout =
  | "magazine"
  | "mosaic"
  | "overlap"
  | "bento"
  | "scatter"
  | "board";

function frameClass(style: PhotoStyle) {
  switch (style) {
    case "polaroid":
      return "bg-white p-1.5 pb-5 shadow-lg";
    case "device":
      return "rounded-[1.1rem] border-[5px] border-zinc-900 bg-zinc-950 p-0.5";
    case "glow":
      return "rounded-xl";
    case "editorial":
      return "overflow-hidden";
    default:
      return "overflow-hidden rounded-2xl bg-white p-1 shadow-sm";
  }
}

function magazineSpan(index: number, total: number) {
  if (total === 1) return "col-span-4 row-span-2 min-h-[240px]";
  if (total === 2) {
    return index === 0
      ? "col-span-2 row-span-2 min-h-[240px]"
      : "col-span-2 row-span-2 min-h-[240px]";
  }
  const map = [
    "col-span-2 row-span-2 min-h-[240px]",
    "col-span-1 row-span-1 min-h-[115px]",
    "col-span-1 row-span-2 min-h-[240px]",
    "col-span-1 row-span-1 min-h-[115px]",
    "col-span-2 row-span-1 min-h-[130px]",
    "col-span-1 row-span-1 min-h-[115px]",
    "col-span-1 row-span-1 min-h-[115px]",
    "col-span-2 row-span-1 min-h-[130px]",
  ];
  return map[index % map.length];
}

function mosaicSpan(index: number) {
  const map = [
    "col-span-2 row-span-2 min-h-[200px]",
    "col-span-1 min-h-[96px]",
    "col-span-1 min-h-[96px]",
    "col-span-1 min-h-[96px]",
    "col-span-2 min-h-[140px]",
    "col-span-1 min-h-[96px]",
  ];
  return map[index % map.length];
}

function bentoSpan(index: number) {
  if (index === 0) return "col-span-2 row-span-2 min-h-[220px]";
  return "col-span-1 min-h-[105px]";
}

function boardSpan(index: number) {
  const map = [
    "col-span-2 min-h-[160px]",
    "col-span-1 min-h-[160px]",
    "col-span-1 min-h-[160px]",
    "col-span-1 min-h-[140px]",
    "col-span-2 min-h-[140px]",
    "col-span-1 min-h-[140px]",
  ];
  return map[index % map.length];
}

function Lightbox({
  images,
  index,
  alt,
  onClose,
  onIndex,
}: {
  images: PortfolioImage[];
  index: number;
  alt: string;
  onClose: () => void;
  onIndex: (value: number) => void;
}) {
  const active = images[index];
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Foto ampliada"
    >
      <button
        type="button"
        className="absolute right-5 top-5 rounded-full bg-white/10 px-3 py-1 text-sm text-white"
        onClick={onClose}
      >
        Cerrar
      </button>
      {images.length > 1 ? (
        <>
          <button
            type="button"
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 text-white"
            onClick={(event) => {
              event.stopPropagation();
              onIndex((index - 1 + images.length) % images.length);
            }}
          >
            ‹
          </button>
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 text-white"
            onClick={(event) => {
              event.stopPropagation();
              onIndex((index + 1) % images.length);
            }}
          >
            ›
          </button>
        </>
      ) : null}
      <img
        src={active.src}
        alt={alt}
        className="max-h-[88vh] max-w-[92vw] rounded-lg object-contain"
        onClick={(event) => event.stopPropagation()}
      />
    </div>
  );
}

export function PhotoCollection({
  images,
  photoStyle,
  accent,
  className = "",
  alt = "Proyecto",
  layout = "magazine",
}: {
  images: PortfolioImage[];
  photoStyle: PhotoStyle;
  accent: string;
  className?: string;
  alt?: string;
  layout?: GalleryLayout;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const visible = images.slice(0, 10);

  useEffect(() => {
    if (openIndex === null) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenIndex(null);
      if (event.key === "ArrowRight") {
        setOpenIndex((current) =>
          current === null ? current : (current + 1) % visible.length,
        );
      }
      if (event.key === "ArrowLeft") {
        setOpenIndex((current) =>
          current === null
            ? current
            : (current - 1 + visible.length) % visible.length,
        );
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, visible.length]);

  if (!visible.length) return null;
  const frame = frameClass(photoStyle);

  function Thumb({
    image,
    index,
    extraClass = "",
    extraStyle,
  }: {
    image: PortfolioImage;
    index: number;
    extraClass?: string;
        extraStyle?: CSSProperties;
  }) {
    return (
      <button
        type="button"
        onClick={() => setOpenIndex(index)}
        className={`group relative overflow-hidden text-left ${frame} ${extraClass}`}
        style={{
          ...(photoStyle === "glow"
            ? { boxShadow: `0 0 22px ${withAlpha(accent, 0.35)}` }
            : {}),
          ...extraStyle,
        }}
      >
        <img src={image.src} alt={alt} className="h-full w-full object-cover" />
        <span className="pointer-events-none absolute inset-0 hidden items-end justify-center bg-black/30 pb-2 text-[10px] uppercase tracking-[0.18em] text-white group-hover:flex">
          Ampliar
        </span>
      </button>
    );
  }

  if (layout === "overlap" || layout === "scatter") {
    const rotations = [-8, 7, -4, 10, -11, 5, -6, 8];
    const positions = [
      "left-[4%] top-4 w-[42%] h-[70%]",
      "right-[6%] top-0 w-[38%] h-[58%]",
      "left-[28%] bottom-2 w-[34%] h-[52%]",
      "right-[18%] bottom-6 w-[30%] h-[48%]",
      "left-[8%] bottom-10 w-[24%] h-[40%]",
      "right-[2%] top-[28%] w-[26%] h-[42%]",
    ];
    return (
      <>
        <div className={`relative h-[320px] sm:h-[380px] ${className}`}>
          {visible.slice(0, 6).map((image, index) => (
            <Thumb
              key={image.id}
              image={image}
              index={index}
              extraClass={`absolute ${positions[index] || positions[0]}`}
              extraStyle={{
                transform: `rotate(${rotations[index % rotations.length]}deg)`,
                zIndex: index + 1,
              }}
            />
          ))}
        </div>
        {openIndex !== null ? (
          <Lightbox
            images={visible}
            index={openIndex}
            alt={alt}
            onClose={() => setOpenIndex(null)}
            onIndex={setOpenIndex}
          />
        ) : null}
      </>
    );
  }

  const spanFn =
    layout === "bento"
      ? bentoSpan
      : layout === "board"
        ? boardSpan
        : layout === "mosaic"
          ? mosaicSpan
          : (index: number) => magazineSpan(index, visible.length);

  return (
    <>
      <div
        className={`grid grid-cols-2 gap-2 sm:grid-cols-4 sm:auto-rows-[90px] ${className}`}
      >
        {visible.map((image, index) => (
          <Thumb
            key={image.id}
            image={image}
            index={index}
            extraClass={spanFn(index)}
          />
        ))}
      </div>
      {openIndex !== null ? (
        <Lightbox
          images={visible}
          index={openIndex}
          alt={alt}
          onClose={() => setOpenIndex(null)}
          onIndex={setOpenIndex}
        />
      ) : null}
    </>
  );
}

export function DevicePreview({
  src,
  alt,
  accent,
}: {
  src: string;
  alt: string;
  accent: string;
}) {
  return (
    <div
      className="relative mx-auto w-[min(100%,200px)] rounded-[2rem] border-[8px] border-[#16121f] bg-[#0b0812] p-1"
      style={{ boxShadow: `0 20px 40px ${withAlpha(accent, 0.28)}` }}
    >
      <div className="absolute left-1/2 top-2 z-10 h-3 w-14 -translate-x-1/2 rounded-full bg-black/90" />
      <img
        src={src}
        alt={alt}
        className="aspect-[9/16] w-full rounded-[1.4rem] object-cover"
      />
    </div>
  );
}
