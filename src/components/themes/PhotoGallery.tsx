"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { STAGE_META, type PhotoStyle, type PortfolioImage, type StageKey } from "@/lib/types";
import { stageLabel, withAlpha } from "./media";

export type GalleryLayout = "magazine" | "mosaic" | "bento" | "board" | "fan";

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

function cellSpan(_layout: GalleryLayout, _index: number, _total: number) {
  return "aspect-[3/4] w-full";
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
  const label = stageLabel(active.stage);
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
      <div className="max-w-[92vw]" onClick={(event) => event.stopPropagation()}>
        {label ? (
          <p className="mb-2 text-center text-xs uppercase tracking-[0.22em] text-white/70">
            {label}
          </p>
        ) : null}
        <img
          src={active.src}
          alt={alt}
          className="max-h-[82vh] max-w-[92vw] rounded-lg object-contain"
        />
      </div>
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
  groupByStage = true,
}: {
  images: PortfolioImage[];
  photoStyle: PhotoStyle;
  accent: string;
  className?: string;
  alt?: string;
  layout?: GalleryLayout;
  groupByStage?: boolean;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const visible = images.slice(0, 12);
  const flat = useMemo(() => visible, [visible]);

  useEffect(() => {
    if (openIndex === null) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenIndex(null);
      if (event.key === "ArrowRight") {
        setOpenIndex((current) =>
          current === null ? current : (current + 1) % flat.length,
        );
      }
      if (event.key === "ArrowLeft") {
        setOpenIndex((current) =>
          current === null
            ? current
            : (current - 1 + flat.length) % flat.length,
        );
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, flat.length]);

  if (!flat.length) return null;
  const frame = frameClass(photoStyle);

  const groups = groupByStage
    ? [
        ...STAGE_META.map((stage) => ({
          key: stage.key as StageKey | "other",
          label: stage.label,
          items: flat
            .map((image, index) => ({ image, index }))
            .filter((item) => item.image.stage === stage.key),
        })).filter((group) => group.items.length),
        {
          key: "other" as const,
          label: "Galería",
          items: flat
            .map((image, index) => ({ image, index }))
            .filter((item) => !item.image.stage),
        },
      ].filter((group) => group.items.length)
    : [
        {
          key: "other" as const,
          label: "",
          items: flat.map((image, index) => ({ image, index })),
        },
      ];

  function Thumb({
    image,
    index,
    extraClass = "",
    extraStyle,
    showBadge = true,
  }: {
    image: PortfolioImage;
    index: number;
    extraClass?: string;
    extraStyle?: CSSProperties;
    showBadge?: boolean;
  }) {
    const label = stageLabel(image.stage);
    return (
      <button
        type="button"
        onClick={() => setOpenIndex(index)}
        className={`group relative flex aspect-[3/4] items-center justify-center overflow-hidden bg-black/10 text-left transition duration-500 hover:-translate-y-1 ${frame} ${extraClass}`}
        style={{
          ...(photoStyle === "glow"
            ? { boxShadow: `0 0 22px ${withAlpha(accent, 0.35)}` }
            : {}),
          ...extraStyle,
        }}
      >
        <img
          src={image.src}
          alt={alt}
          className="h-full w-full object-contain transition duration-700 group-hover:scale-[1.03]"
        />
        {showBadge && label ? (
          <span className="absolute left-1.5 top-1.5 rounded-full bg-black/65 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-white">
            {label}
          </span>
        ) : null}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 hidden bg-gradient-to-t from-black/55 to-transparent pb-2 pt-6 text-center text-[10px] uppercase tracking-[0.18em] text-white group-hover:block">
          Ampliar
        </span>
      </button>
    );
  }

  function Grid({
    items,
  }: {
    items: { image: PortfolioImage; index: number }[];
  }) {
    if (layout === "fan") {
      const rotations = [-4, 3, -2, 5, -5, 2];
      return (
        <div className="flex flex-wrap justify-center gap-3 py-2">
          {items.map(({ image, index }, order) => (
            <Thumb
              key={image.id}
              image={image}
              index={index}
              extraClass="aspect-[3/4] w-36 sm:w-40"
              extraStyle={{
                transform: `rotate(${rotations[order % rotations.length]}deg)`,
              }}
            />
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map(({ image, index }, order) => (
          <Thumb
            key={image.id}
            image={image}
            index={index}
            extraClass={cellSpan(layout, order, items.length)}
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className={`space-y-4 ${className}`}>
        {groups.map((group) => (
          <div key={String(group.key)}>
            {group.label ? (
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] opacity-70">
                {group.label}
              </p>
            ) : null}
            <Grid items={group.items} />
          </div>
        ))}
      </div>
      {openIndex !== null ? (
        <Lightbox
          images={flat}
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
        className="aspect-[9/16] w-full rounded-[1.4rem] bg-black object-contain"
      />
    </div>
  );
}
