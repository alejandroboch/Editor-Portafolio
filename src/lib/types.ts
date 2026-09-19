export type ThemeId =
  | "violet-night"
  | "lilac-studio"
  | "coast-editorial"
  | "polaroid-navy"
  | "solar-pop"
  | "crimson-atelier"
  | "teal-board"
  | "social-press"
  | "burgundy-studio";

export type PhotoStyle =
  | "glow"
  | "soft-card"
  | "device"
  | "polaroid"
  | "editorial";

export type StageKey = "sketches" | "process" | "final";

export type PortfolioImage = {
  id: string;
  src: string;
  name?: string;
  stage?: StageKey;
};

export type ProjectStage = {
  text: string;
  images: PortfolioImage[];
};

export type ProjectDoc = {
  id: string;
  src: string;
  name: string;
};

export type Project = {
  id: string;
  title: string;
  year: string;
  role: string;
  summary: string;
  docs: ProjectDoc[];
  stages: Record<StageKey, ProjectStage>;
};

export type Profile = {
  name: string;
  role: string;
  tagline: string;
  bio: string;
  location: string;
  email: string;
  photo: string;
  socials: {
    instagram: string;
    behance: string;
    linkedin: string;
    tiktok: string;
    website: string;
  };
  stats: {
    years: string;
    projects: string;
    clients: string;
    awards: string;
  };
};

export type Appearance = {
  themeId: ThemeId;
  photoStyle: PhotoStyle;
  accent: string;
};

export type Portfolio = {
  version: 1;
  slug: string;
  updatedAt: string;
  profile: Profile;
  appearance: Appearance;
  projects: Project[];
};

export const STAGE_META: { key: StageKey; label: string; hint: string }[] = [
  {
    key: "sketches",
    label: "Bocetos",
    hint: "Ideas iniciales, thumbnails, wireframes",
  },
  {
    key: "process",
    label: "Proceso",
    hint: "Iteraciones, pruebas y desarrollo",
  },
  {
    key: "final",
    label: "Resultado final",
    hint: "Pieza terminada y entregable",
  },
];
