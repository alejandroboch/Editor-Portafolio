import { createPortfolio } from "./portfolio";
import type { Portfolio } from "./types";

function mergeDraft(parsed: Partial<Portfolio>): Portfolio {
  const base = createPortfolio();
  return {
    ...base,
    ...parsed,
    version: 1,
    profile: {
      ...base.profile,
      ...parsed.profile,
      socials: { ...base.profile.socials, ...parsed.profile?.socials },
      stats: { ...base.profile.stats, ...parsed.profile?.stats },
    },
    appearance: { ...base.appearance, ...parsed.appearance },
    projects: parsed.projects?.length ? parsed.projects : base.projects,
  };
}

const DRAFT_KEY = "atelier.draft.v1";
const PUBLISH_META_KEY = "atelier.publish-meta.v1";

export type PublishMeta = {
  slug: string;
  publicId: string;
  publishedAt: string;
};

export function loadDraft(): Portfolio {
  if (typeof window === "undefined") return createPortfolio();
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return createPortfolio();
    const parsed = JSON.parse(raw) as Partial<Portfolio>;
    if (parsed?.version !== 1) return createPortfolio();
    return mergeDraft(parsed);
  } catch {
    return createPortfolio();
  }
}

export function saveDraft(portfolio: Portfolio) {
  localStorage.setItem(
    DRAFT_KEY,
    JSON.stringify({ ...portfolio, updatedAt: new Date().toISOString() }),
  );
}

export function loadPublishMeta(): PublishMeta | null {
  try {
    const raw = localStorage.getItem(PUBLISH_META_KEY);
    return raw ? (JSON.parse(raw) as PublishMeta) : null;
  } catch {
    return null;
  }
}

export function savePublishMeta(meta: PublishMeta) {
  localStorage.setItem(PUBLISH_META_KEY, JSON.stringify(meta));
}

export function cachePublished(publicId: string, portfolio: Portfolio) {
  localStorage.setItem(`atelier.published.${publicId}`, JSON.stringify(portfolio));
}

export function readPublishedCache(publicId: string): Portfolio | null {
  try {
    const raw = localStorage.getItem(`atelier.published.${publicId}`);
    return raw ? (JSON.parse(raw) as Portfolio) : null;
  } catch {
    return null;
  }
}
