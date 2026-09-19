"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ACCENT_PRESETS,
  PHOTO_STYLE_OPTIONS,
  THEME_OPTIONS,
  createProject,
  prepareForPublish,
  slugify,
} from "@/lib/portfolio";
import { STAGE_META, type Portfolio } from "@/lib/types";
import {
  cachePublished,
  loadDraft,
  loadPublishMeta,
  saveDraft,
  savePublishMeta,
} from "@/lib/draft";
import { PortfolioView } from "@/components/themes/PortfolioView";
import { ImageField } from "./ImageField";

type Tab = "perfil" | "estilo" | "proyectos" | "publicar" | "preview";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm text-zinc-300">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-violet-400";

export function EditorApp() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [tab, setTab] = useState<Tab>("perfil");
  const [status, setStatus] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    const draft = loadDraft();
    setPortfolio(draft);
    const meta = loadPublishMeta();
    if (meta?.publicId) {
      setShareUrl(`${window.location.origin}/p/${meta.publicId}`);
    }
  }, []);

  useEffect(() => {
    if (!portfolio) return;
    const timer = window.setTimeout(() => saveDraft(portfolio), 400);
    return () => window.clearTimeout(timer);
  }, [portfolio]);

  const previewScale = useMemo(() => 0.42, []);

  if (!portfolio) {
    return <div className="p-10 text-zinc-400">Cargando editor…</div>;
  }

  function update(partial: Partial<Portfolio>) {
    setPortfolio((current) => (current ? { ...current, ...partial } : current));
  }

  async function publish() {
    if (!portfolio) return;
    setPublishing(true);
    setStatus("");
    try {
      const slug = `${slugify(portfolio.profile.name)}-${Date.now().toString(36).slice(-4)}`;
      const payload: Portfolio = prepareForPublish({ ...portfolio, slug });
      const bytes = new Blob([JSON.stringify(payload)]).size;
      if (bytes > 3_800_000) {
        throw new Error(
          "Las fotos pesan demasiado para publicar. Sube menos imágenes o recórtalas antes.",
        );
      }
      const res = await fetch("/api/portfolios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { publicId?: string; error?: string };
      if (!res.ok || !data.publicId) {
        throw new Error(data.error || "No se pudo publicar");
      }
      const url = `${window.location.origin}/p/${data.publicId}`;
      cachePublished(data.publicId, payload);
      savePublishMeta({
        slug,
        publicId: data.publicId,
        publishedAt: new Date().toISOString(),
      });
      update({ slug });
      setShareUrl(url);
      setStatus("Publicado. Copia el enlace y compártelo.");
      setTab("publicar");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Error al publicar");
    } finally {
      setPublishing(false);
    }
  }

  async function copyLink() {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setStatus("Enlace copiado.");
  }

  return (
    <div className="min-h-screen bg-[#0c0b12] text-white">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-[#0c0b12]/90 px-4 py-3 backdrop-blur md:px-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-violet-300">
            Atelier
          </p>
          <h1 className="text-lg font-medium">Editor de portafolio</h1>
        </div>
        <button
          type="button"
          onClick={() => void publish()}
          disabled={publishing}
          className="rounded-full bg-violet-500 px-4 py-2 text-sm font-medium disabled:opacity-60"
        >
          {publishing ? "Publicando…" : "Publicar"}
        </button>
      </header>

      <div className="grid xl:grid-cols-[minmax(340px,42%)_1fr]">
        <section className="border-b border-white/10 xl:min-h-[calc(100vh-64px)] xl:border-b-0 xl:border-r">
          <div className="flex gap-1 overflow-x-auto px-3 pt-3">
            {(
              [
                ["perfil", "Perfil"],
                ["estilo", "Estilo"],
                ["proyectos", "Proyectos"],
                ["publicar", "Publicar"],
                ["preview", "Vista"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`rounded-full px-3 py-1.5 text-sm ${
                  tab === id ? "bg-white text-black" : "text-zinc-400"
                } ${id === "preview" ? "xl:hidden" : ""}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="space-y-5 p-4 md:p-6">
            {tab === "perfil" ? (
              <>
                <ImageField
                  label="Foto de perfil"
                  images={
                    portfolio.profile.photo
                      ? [{ id: "avatar", src: portfolio.profile.photo }]
                      : []
                  }
                  onChange={(images) =>
                    update({
                      profile: {
                        ...portfolio.profile,
                        photo: images[0]?.src || "",
                      },
                    })
                  }
                  max={1}
                />
                <Field label="Nombre">
                  <input
                    className={inputClass}
                    value={portfolio.profile.name}
                    placeholder="María López"
                    onChange={(e) =>
                      update({
                        profile: { ...portfolio.profile, name: e.target.value },
                      })
                    }
                  />
                </Field>
                <Field label="Rol / titular">
                  <input
                    className={inputClass}
                    value={portfolio.profile.role}
                    placeholder="Diseñadora digital"
                    onChange={(e) =>
                      update({
                        profile: { ...portfolio.profile, role: e.target.value },
                      })
                    }
                  />
                </Field>
                <Field label="Frase corta">
                  <input
                    className={inputClass}
                    value={portfolio.profile.tagline}
                    onChange={(e) =>
                      update({
                        profile: {
                          ...portfolio.profile,
                          tagline: e.target.value,
                        },
                      })
                    }
                  />
                </Field>
                <Field label="Bio">
                  <textarea
                    className={`${inputClass} min-h-28`}
                    value={portfolio.profile.bio}
                    onChange={(e) =>
                      update({
                        profile: { ...portfolio.profile, bio: e.target.value },
                      })
                    }
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Ubicación">
                    <input
                      className={inputClass}
                      value={portfolio.profile.location}
                      onChange={(e) =>
                        update({
                          profile: {
                            ...portfolio.profile,
                            location: e.target.value,
                          },
                        })
                      }
                    />
                  </Field>
                  <Field label="Email">
                    <input
                      className={inputClass}
                      value={portfolio.profile.email}
                      onChange={(e) =>
                        update({
                          profile: {
                            ...portfolio.profile,
                            email: e.target.value,
                          },
                        })
                      }
                    />
                  </Field>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {(
                    [
                      ["instagram", "Instagram"],
                      ["behance", "Behance"],
                      ["linkedin", "LinkedIn"],
                      ["tiktok", "TikTok"],
                      ["website", "Web"],
                    ] as const
                  ).map(([key, label]) => (
                    <Field key={key} label={label}>
                      <input
                        className={inputClass}
                        value={portfolio.profile.socials[key]}
                        placeholder="https://"
                        onChange={(e) =>
                          update({
                            profile: {
                              ...portfolio.profile,
                              socials: {
                                ...portfolio.profile.socials,
                                [key]: e.target.value,
                              },
                            },
                          })
                        }
                      />
                    </Field>
                  ))}
                </div>
                <p className="text-xs text-zinc-500">
                  Estadísticas opcionales. Si las dejas vacías, no aparecen.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {(
                    [
                      ["years", "Años"],
                      ["projects", "Proyectos"],
                      ["clients", "Clientes"],
                      ["awards", "Premios"],
                    ] as const
                  ).map(([key, label]) => (
                    <Field key={key} label={label}>
                      <input
                        className={inputClass}
                        value={portfolio.profile.stats[key]}
                        placeholder="6+"
                        onChange={(e) =>
                          update({
                            profile: {
                              ...portfolio.profile,
                              stats: {
                                ...portfolio.profile.stats,
                                [key]: e.target.value,
                              },
                            },
                          })
                        }
                      />
                    </Field>
                  ))}
                </div>
              </>
            ) : null}

            {tab === "estilo" ? (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  {THEME_OPTIONS.map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() =>
                        update({
                          appearance: {
                            ...portfolio.appearance,
                            themeId: theme.id,
                            accent: ACCENT_PRESETS[theme.id][0],
                            photoStyle: theme.photoStyle,
                          },
                        })
                      }
                      className={`overflow-hidden rounded-2xl border text-left ${
                        portfolio.appearance.themeId === theme.id
                          ? "border-violet-400"
                          : "border-white/10"
                      }`}
                    >
                      <div className={`h-24 ${theme.swatch}`} />
                      <div className="p-4">
                        <p className="font-medium">{theme.name}</p>
                        <p className="mt-1 text-sm text-zinc-400">
                          {theme.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
                <div>
                  <p className="mb-2 text-sm text-zinc-300">Cómo se ven las fotos</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {PHOTO_STYLE_OPTIONS.map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() =>
                          update({
                            appearance: {
                              ...portfolio.appearance,
                              photoStyle: style.id,
                            },
                          })
                        }
                        className={`rounded-2xl border p-3 text-left ${
                          portfolio.appearance.photoStyle === style.id
                            ? "border-violet-400 bg-violet-500/10"
                            : "border-white/10"
                        }`}
                      >
                        <p className="text-sm font-medium">{style.name}</p>
                        <p className="mt-1 text-xs text-zinc-500">
                          {style.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-sm text-zinc-300">Color de acento</p>
                  <div className="flex flex-wrap gap-2">
                    {(
                      ACCENT_PRESETS[portfolio.appearance.themeId] ??
                      ACCENT_PRESETS["lilac-studio"]
                    ).map((color) => (
                      <button
                        key={color}
                        type="button"
                        aria-label={color}
                        onClick={() =>
                          update({
                            appearance: { ...portfolio.appearance, accent: color },
                          })
                        }
                        className="h-9 w-9 rounded-full border border-white/20"
                        style={{ background: color }}
                      />
                    ))}
                    <input
                      type="color"
                      value={portfolio.appearance.accent}
                      onChange={(e) =>
                        update({
                          appearance: {
                            ...portfolio.appearance,
                            accent: e.target.value,
                          },
                        })
                      }
                      className="h-9 w-12 cursor-pointer rounded border-0 bg-transparent"
                    />
                  </div>
                </div>
              </>
            ) : null}

            {tab === "proyectos" ? (
              <div className="space-y-8">
                {portfolio.projects.map((project, index) => (
                  <article
                    key={project.id}
                    className="rounded-2xl border border-white/10 p-4"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-sm text-zinc-400">
                        Proyecto {index + 1}
                      </p>
                      {portfolio.projects.length > 1 ? (
                        <button
                          type="button"
                          className="text-xs text-zinc-500"
                          onClick={() =>
                            update({
                              projects: portfolio.projects.filter(
                                (item) => item.id !== project.id,
                              ),
                            })
                          }
                        >
                          Quitar
                        </button>
                      ) : null}
                    </div>
                    <div className="grid gap-3">
                      <input
                        className={inputClass}
                        placeholder="Título"
                        value={project.title}
                        onChange={(e) =>
                          update({
                            projects: portfolio.projects.map((item) =>
                              item.id === project.id
                                ? { ...item, title: e.target.value }
                                : item,
                            ),
                          })
                        }
                      />
                      <div className="grid gap-3 sm:grid-cols-2">
                        <input
                          className={inputClass}
                          placeholder="Año"
                          value={project.year}
                          onChange={(e) =>
                            update({
                              projects: portfolio.projects.map((item) =>
                                item.id === project.id
                                  ? { ...item, year: e.target.value }
                                  : item,
                              ),
                            })
                          }
                        />
                        <input
                          className={inputClass}
                          placeholder="Tu rol"
                          value={project.role}
                          onChange={(e) =>
                            update({
                              projects: portfolio.projects.map((item) =>
                                item.id === project.id
                                  ? { ...item, role: e.target.value }
                                  : item,
                              ),
                            })
                          }
                        />
                      </div>
                      <textarea
                        className={`${inputClass} min-h-20`}
                        placeholder="Resumen del proyecto (opcional)"
                        value={project.summary}
                        onChange={(e) =>
                          update({
                            projects: portfolio.projects.map((item) =>
                              item.id === project.id
                                ? { ...item, summary: e.target.value }
                                : item,
                            ),
                          })
                        }
                      />
                    </div>
                    <div className="mt-5 space-y-6">
                      {STAGE_META.map((stage) => (
                        <div key={stage.key} className="space-y-3">
                          <div>
                            <p className="text-sm font-medium">{stage.label}</p>
                            <p className="text-xs text-zinc-500">{stage.hint}</p>
                          </div>
                          <textarea
                            className={`${inputClass} min-h-16`}
                            placeholder="Texto explicativo opcional"
                            value={project.stages[stage.key].text}
                            onChange={(e) =>
                              update({
                                projects: portfolio.projects.map((item) =>
                                  item.id === project.id
                                    ? {
                                        ...item,
                                        stages: {
                                          ...item.stages,
                                          [stage.key]: {
                                            ...item.stages[stage.key],
                                            text: e.target.value,
                                          },
                                        },
                                      }
                                    : item,
                                ),
                              })
                            }
                          />
                          <ImageField
                            label="Fotos"
                            multiple
                            max={6}
                            hint="Opcional. Puedes dejar esta etapa vacía"
                            images={project.stages[stage.key].images}
                            onChange={(images) =>
                              update({
                                projects: portfolio.projects.map((item) =>
                                  item.id === project.id
                                    ? {
                                        ...item,
                                        stages: {
                                          ...item.stages,
                                          [stage.key]: {
                                            ...item.stages[stage.key],
                                            images,
                                          },
                                        },
                                      }
                                    : item,
                                ),
                              })
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    update({ projects: [...portfolio.projects, createProject()] })
                  }
                  className="w-full rounded-xl border border-dashed border-white/15 py-3 text-sm text-zinc-300"
                >
                  + Agregar proyecto
                </button>
              </div>
            ) : null}

            {tab === "publicar" ? (
              <div className="space-y-4">
                <p className="text-sm leading-6 text-zinc-400">
                  Al publicar se genera un enlace de solo lectura. Quien lo reciba
                  verá el portafolio, no este editor. El borrador se guarda solo
                  en tu navegador.
                </p>
                {shareUrl ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                      Enlace público
                    </p>
                    <p className="mt-2 break-all text-sm text-violet-200">
                      {shareUrl}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => void copyLink()}
                        className="rounded-full bg-white px-4 py-2 text-sm text-black"
                      >
                        Copiar enlace
                      </button>
                      <a
                        href={shareUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-white/15 px-4 py-2 text-sm"
                      >
                        Abrir vista pública
                      </a>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500">
                    Todavía no hay un enlace. Pulsa Publicar cuando esté listo.
                  </p>
                )}
                {status ? <p className="text-sm text-violet-200">{status}</p> : null}
              </div>
            ) : null}

            {tab === "preview" ? (
              <div className="overflow-hidden rounded-2xl border border-white/10 xl:hidden">
                <PortfolioView portfolio={portfolio} />
              </div>
            ) : null}
          </div>
        </section>

        <section className="hidden bg-zinc-950 xl:block">
          <div className="sticky top-16 overflow-hidden p-6">
            <p className="mb-3 text-xs uppercase tracking-[0.28em] text-zinc-500">
              Vista previa
            </p>
            <div className="h-[calc(100vh-8rem)] overflow-auto rounded-2xl border border-white/10 bg-black">
              <div
                style={{
                  transform: `scale(${previewScale})`,
                  transformOrigin: "top left",
                  width: `${100 / previewScale}%`,
                }}
              >
                <PortfolioView portfolio={portfolio} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
