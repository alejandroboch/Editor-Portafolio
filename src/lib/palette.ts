import type { CSSProperties } from "react";
import type { ThemeId } from "./types";

export type ThemePalette = {
  accent: string;
  accent2: string;
  page: string;
  page2: string;
  paper: string;
  ink: string;
  muted: string;
  display: string;
  onAccent: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function normalizeHex(hex: string) {
  const clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    return `#${clean.split("").map((c) => c + c).join("")}`.toLowerCase();
  }
  if (clean.length >= 6) return `#${clean.slice(0, 6)}`.toLowerCase();
  return "#7c6bc4";
}

export function hexToRgb(hex: string) {
  const full = normalizeHex(hex).slice(1);
  const n = Number.parseInt(full, 16);
  return {
    r: (n >> 16) & 255,
    g: (n >> 8) & 255,
    b: n & 255,
  };
}

export function hexToHsl(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const r1 = r / 255;
  const g1 = g / 255;
  const b1 = b / 255;
  const max = Math.max(r1, g1, b1);
  const min = Math.min(r1, g1, b1);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r1) h = (g1 - b1) / d + (g1 < b1 ? 6 : 0);
    else if (max === g1) h = (b1 - r1) / d + 2;
    else h = (r1 - g1) / d + 4;
    h *= 60;
  }
  return { h, s: s * 100, l: l * 100 };
}

export function hslToHex(h: number, s: number, l: number) {
  const hue = ((h % 360) + 360) % 360;
  const sat = clamp(s, 0, 100) / 100;
  const lig = clamp(l, 0, 100) / 100;
  const a = sat * Math.min(lig, 1 - lig);
  const f = (n: number) => {
    const k = (n + hue / 30) % 12;
    const color = lig - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function withAlpha(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function relativeLuma(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function onColor(hex: string) {
  return relativeLuma(hex) > 0.55 ? "#1a1614" : "#f6f1ea";
}

function paperFamily(h: number, s: number, l: number): ThemePalette {
  const sat = clamp(s, 8, 55);
  const deep = hslToHex(h, clamp(sat + 8, 12, 62), clamp(Math.min(l, 28), 12, 28));
  const accent = hslToHex(h, clamp(s, 12, 70), clamp(l, 18, 52));
  return {
    accent,
    accent2: deep,
    page: hslToHex(h, sat * 0.35, 80),
    page2: hslToHex(h, sat * 0.42, 72),
    paper: hslToHex(h, sat * 0.22, 92),
    ink: hslToHex(h, clamp(sat * 0.55, 10, 40), 16),
    muted: hslToHex(h, sat * 0.4, 38),
    display: hslToHex(h, sat * 0.32, 48),
    onAccent: onColor(accent),
  };
}

function washFamily(h: number, s: number, l: number): ThemePalette {
  const sat = clamp(s, 18, 62);
  const accent = hslToHex(h, sat, clamp(l, 22, 48));
  return {
    accent,
    accent2: hslToHex(h, sat + 4, 22),
    page: hslToHex(h, sat, 34),
    page2: hslToHex(h, sat + 2, 26),
    paper: hslToHex(h, 12, 96),
    ink: hslToHex(h, 18, 96),
    muted: hslToHex(h, 14, 82),
    display: hslToHex(h, 10, 90),
    onAccent: onColor(accent),
  };
}

function neonFamily(h: number, s: number, l: number): ThemePalette {
  const sat = clamp(s, 35, 85);
  const accent = hslToHex(h, sat, clamp(l, 52, 72));
  return {
    accent,
    accent2: hslToHex(h, sat, 28),
    page: hslToHex(h, 42, 6),
    page2: hslToHex(h, 48, 11),
    paper: hslToHex(h, 36, 14),
    ink: hslToHex(h, 22, 92),
    muted: hslToHex(h, 16, 72),
    display: hslToHex(h, 30, 78),
    onAccent: onColor(accent),
  };
}

function wineFamily(h: number, s: number, l: number): ThemePalette {
  const sat = clamp(s, 22, 70);
  const accent = hslToHex(h, sat, clamp(l, 16, 38));
  return {
    accent,
    accent2: hslToHex(h, sat + 6, 14),
    page: hslToHex(h, 28, 12),
    page2: hslToHex(h, 32, 16),
    paper: hslToHex(h + 32, 28, 82),
    ink: hslToHex(h + 32, 32, 82),
    muted: hslToHex(h + 28, 24, 70),
    display: hslToHex(h + 30, 30, 78),
    onAccent: onColor(accent),
  };
}

export function buildPalette(accent: string, themeId: ThemeId): ThemePalette {
  const { h, s, l } = hexToHsl(accent);
  switch (themeId) {
    case "violet-night":
      return neonFamily(h, s, l);
    case "crimson-atelier":
      return wineFamily(h, s, l);
    case "coast-editorial":
      return washFamily(h, s, l);
    case "teal-board": {
      const wash = washFamily(h, s, l);
      return {
        ...paperFamily(h, Math.min(s, 30), l),
        accent: wash.accent,
        accent2: wash.accent2,
        page2: wash.page,
        display: wash.ink,
      };
    }
    default:
      return paperFamily(h, s, l);
  }
}

export function paletteSwatches(palette: ThemePalette) {
  return [palette.page, palette.page2, palette.paper, palette.accent, palette.accent2, palette.ink];
}

export function themeVars(accent: string, themeId: ThemeId): CSSProperties {
  const palette = buildPalette(accent, themeId);
  return {
    ["--accent" as string]: palette.accent,
    ["--accent-2" as string]: palette.accent2,
    ["--accent-soft" as string]: withAlpha(palette.accent, 0.16),
    ["--accent-glow" as string]: withAlpha(palette.accent, 0.38),
    ["--page" as string]: palette.page,
    ["--page-2" as string]: palette.page2,
    ["--paper" as string]: palette.paper,
    ["--ink" as string]: palette.ink,
    ["--muted" as string]: palette.muted,
    ["--display" as string]: palette.display,
    ["--on-accent" as string]: palette.onAccent,
    background: palette.page,
    color: palette.ink,
  };
}
