import type { Portfolio, Project, ProjectStage } from "./types";

export function uid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function emptyStage(): ProjectStage {
  return { text: "", images: [] };
}

export function createProject(): Project {
  return {
    id: uid(),
    title: "",
    year: "",
    role: "",
    summary: "",
    docs: [],
    stages: {
      sketches: emptyStage(),
      process: emptyStage(),
      final: emptyStage(),
    },
  };
}

export function createPortfolio(): Portfolio {
  return {
    version: 1,
    slug: "",
    updatedAt: new Date().toISOString(),
    profile: {
      name: "",
      role: "Diseñadora digital",
      tagline: "Diseño experiencias visuales con intención.",
      bio: "",
      location: "",
      email: "",
      photo: "",
      socials: {
        instagram: "",
        behance: "",
        linkedin: "",
        tiktok: "",
        website: "",
      },
      stats: {
        years: "",
        projects: "",
        clients: "",
        awards: "",
      },
    },
    appearance: {
      themeId: "lilac-studio",
      photoStyle: "soft-card",
      accent: "#7C6BC4",
    },
    projects: [createProject()],
  };
}

export function moveItem<T extends { id: string }>(list: T[], fromId: string, toId: string) {
  const from = list.findIndex((item) => item.id === fromId);
  const to = list.findIndex((item) => item.id === toId);
  if (from < 0 || to < 0 || from === to) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function slugify(value: string) {
  const base = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 32);
  return base || "portafolio";
}

export function hasStageContent(stage: ProjectStage) {
  return Boolean(stage.text.trim() || stage.images.length);
}

export function projectHasContent(project: Project) {
  return Boolean(
    project.title.trim() ||
      project.summary.trim() ||
      (project.docs?.length ?? 0) > 0 ||
      hasStageContent(project.stages.sketches) ||
      hasStageContent(project.stages.process) ||
      hasStageContent(project.stages.final),
  );
}

export function prepareForPublish(portfolio: Portfolio): Portfolio {
  return {
    ...portfolio,
    updatedAt: new Date().toISOString(),
    projects: portfolio.projects.filter(projectHasContent).map((project) => ({
      ...project,
      stages: {
        sketches: hasStageContent(project.stages.sketches)
          ? project.stages.sketches
          : emptyStage(),
        process: hasStageContent(project.stages.process)
          ? project.stages.process
          : emptyStage(),
        final: hasStageContent(project.stages.final)
          ? project.stages.final
          : emptyStage(),
      },
    })),
  };
}

export const THEME_OPTIONS = [
  {
    id: "violet-night" as const,
    name: "Noche violeta",
    description: "Oscuro, neón y editorial. Ideal para perfiles con carácter.",
    swatch: "bg-[radial-gradient(circle_at_80%_0%,rgba(168,85,247,.7),#12081f_60%)]",
    photoStyle: "glow" as const,
  },
  {
    id: "lilac-studio" as const,
    name: "Estudio lila",
    description: "Claro, suave y profesional. Ideal para estudio y producto.",
    swatch: "bg-[radial-gradient(circle_at_90%_0%,#e9dff8,#f6f0fb_55%)]",
    photoStyle: "soft-card" as const,
  },
  {
    id: "coast-editorial" as const,
    name: "Costa editorial",
    description: "Revista de viaje en tonos teal. Collage, casos y fotografía.",
    swatch: "bg-[linear-gradient(135deg,#2f6f80,#1f5563)]",
    photoStyle: "editorial" as const,
  },
  {
    id: "polaroid-navy" as const,
    name: "Polaroid marino",
    description: "Blanco y azul marino, instantáneas y casos de contenido.",
    swatch: "bg-[linear-gradient(135deg,#f7fbfe,#1b3d57)]",
    photoStyle: "polaroid" as const,
  },
  {
    id: "solar-pop" as const,
    name: "Pop solar",
    description: "Coral, crema y formas juguetonas para marcas con energía.",
    swatch: "bg-[radial-gradient(circle_at_80%_20%,#ffb088,#ff6b3d_55%,#fff6ec)]",
    photoStyle: "soft-card" as const,
  },
  {
    id: "crimson-atelier" as const,
    name: "Atelier carmesí",
    description: "Granate oscuro, editorial y elegante para UX/UI.",
    swatch: "bg-[radial-gradient(circle_at_top,#6b1a28,#3d0b14_60%)]",
    photoStyle: "glow" as const,
  },
  {
    id: "teal-board" as const,
    name: "Tablero teal",
    description: "Láminas teal para ilustración y diseño gráfico.",
    swatch: "bg-[linear-gradient(135deg,#1f5d6b,#174956)]",
    photoStyle: "editorial" as const,
  },
  {
    id: "social-press" as const,
    name: "Prensa social",
    description: "Revista beige de social media: casos, feed y formato vertical.",
    swatch: "bg-[linear-gradient(135deg,#d7cdc3,#8a7d72)]",
    photoStyle: "editorial" as const,
  },
  {
    id: "burgundy-studio" as const,
    name: "Estudio borgoña",
    description: "Crema y vino. Editorial UX/UI con mosaico y grilla de trabajos.",
    swatch: "bg-[linear-gradient(135deg,#f3eadb,#5c1a16)]",
    photoStyle: "soft-card" as const,
  },
];

export const PHOTO_STYLE_OPTIONS = [
  {
    id: "glow" as const,
    name: "Neón",
    description: "Brillo violeta y recortes superpuestos",
  },
  {
    id: "soft-card" as const,
    name: "Estudio",
    description: "Tarjetas claras, sombra suave y bordes amplios",
  },
  {
    id: "device" as const,
    name: "Dispositivo",
    description: "Foto principal dentro de un teléfono",
  },
  {
    id: "polaroid" as const,
    name: "Polaroid",
    description: "Marcos claros tipo archivo personal",
  },
  {
    id: "editorial" as const,
    name: "Editorial",
    description: "Recortes asimétricos de revista",
  },
];

export const ACCENT_PRESETS: Record<Portfolio["appearance"]["themeId"], string[]> = {
  "violet-night": ["#B57CFF", "#A855F7", "#C084FC", "#8B5CF6", "#E879F9"],
  "lilac-studio": ["#7C6BC4", "#8B7CC8", "#6D5BA8", "#9A8AD4", "#5B4B96"],
  "coast-editorial": ["#2F6F80", "#1F5563", "#3D8A9A", "#245866", "#4FA3B2"],
  "polaroid-navy": ["#1B3D57", "#2C5A7A", "#12324D", "#3E6F8C", "#0E2436"],
  "solar-pop": ["#FF6B3D", "#FF8A4A", "#F25C2C", "#FFB088", "#E85A2A"],
  "crimson-atelier": ["#F3D6A5", "#C9A36A", "#8B1E2D", "#E8C48A", "#6B1A28"],
  "teal-board": ["#1F5D6B", "#2A7384", "#174956", "#4AA0B0", "#0F3A44"],
  "social-press": ["#8A7D72", "#5C534C", "#C4B8AE", "#3F3A36", "#A89888"],
  "burgundy-studio": ["#5C1A16", "#7A2420", "#3D100E", "#C4A484", "#8B2E28"],
};
