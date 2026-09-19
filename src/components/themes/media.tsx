import type { CSSProperties, ReactNode } from "react";
import { STAGE_META, type Portfolio, type Project, type StageKey } from "@/lib/types";
import { hasStageContent } from "@/lib/portfolio";

export function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const n = Number.parseInt(full, 16);
  return {
    r: (n >> 16) & 255,
    g: (n >> 8) & 255,
    b: n & 255,
  };
}

export function withAlpha(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "PF";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
}

export function firstProjectImage(project: Project) {
  return (
    project.stages.final.images[0] ||
    project.stages.process.images[0] ||
    project.stages.sketches.images[0]
  );
}

export function projectImages(project: Project) {
  return STAGE_META.flatMap((stage) =>
    project.stages[stage.key].images.map((image) => ({
      ...image,
      stage: stage.key,
    })),
  );
}

export function stageLabel(key?: StageKey) {
  return STAGE_META.find((stage) => stage.key === key)?.label;
}

export function ProfilePhoto({
  src,
  alt,
  shape = "portrait",
  className = "",
}: {
  src: string;
  alt: string;
  shape?: "circle" | "portrait" | "soft";
  className?: string;
}) {
  const shapeClass =
    shape === "circle"
      ? "aspect-square rounded-full object-cover object-[center_18%]"
      : shape === "soft"
        ? "aspect-[4/5] rounded-[2rem] object-cover object-[center_18%]"
        : "aspect-[3/4] w-full object-cover object-[center_18%]";
  return <img src={src} alt={alt} className={`${shapeClass} ${className}`} />;
}

export function projectNotes(project: Project) {
  return STAGE_META.map((stage) => ({
    ...stage,
    text: project.stages[stage.key].text,
  })).filter((stage) => hasStageContent(project.stages[stage.key]) && stage.text.trim());
}

export function socialEntries(portfolio: Portfolio) {
  const { socials, email } = portfolio.profile;
  return [
    email ? { label: "Correo", href: `mailto:${email}` } : null,
    socials.instagram
      ? { label: "Instagram", href: socials.instagram }
      : null,
    socials.tiktok ? { label: "TikTok", href: socials.tiktok } : null,
    socials.behance ? { label: "Behance", href: socials.behance } : null,
    socials.linkedin ? { label: "LinkedIn", href: socials.linkedin } : null,
    socials.website ? { label: "Web", href: socials.website } : null,
  ].filter(Boolean) as { label: string; href: string }[];
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] opacity-70">
      {children}
    </p>
  );
}

export function themeVars(accent: string): CSSProperties {
  return {
    ["--accent" as string]: accent,
    ["--accent-soft" as string]: withAlpha(accent, 0.16),
    ["--accent-glow" as string]: withAlpha(accent, 0.38),
  };
}
