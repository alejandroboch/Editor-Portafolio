import type { Portfolio } from "@/lib/types";
import { projectHasContent } from "@/lib/portfolio";
import { PhotoCollection, DevicePreview } from "./PhotoGallery";
import {
  SectionLabel,
  initialsOf,
  projectImages,
  projectNotes,
  socialEntries,
  themeVars,
  withAlpha,
} from "./media";

export function VioletNight({
  portfolio,
  shareUrl,
}: {
  portfolio: Portfolio;
  shareUrl?: string;
}) {
  const { profile, appearance, projects } = portfolio;
  const accent = appearance.accent;
  const visibleProjects = projects.filter(projectHasContent);
  const featured =
    visibleProjects[0]?.stages.final.images[0] ||
    visibleProjects[0]?.stages.process.images[0] ||
    visibleProjects[0]?.stages.sketches.images[0];
  const phoneSrc = featured?.src || profile.photo;
  const socials = socialEntries(portfolio);
  const displayName = profile.name || "Tu nombre";
  const mark = initialsOf(displayName);
  const handle = profile.location
    ? `@${profile.location.replace(/\s+/g, "").toLowerCase()}`
    : profile.role
      ? `@${profile.role.replace(/\s+/g, "").toLowerCase()}`
      : "@estudio";

  return (
    <div
      className="violet-night relative min-h-screen overflow-hidden text-violet-100"
      style={{
        ...themeVars(accent),
        background:
          "radial-gradient(900px 520px at 85% -5%, rgba(168,85,247,.38), transparent 52%), radial-gradient(700px 420px at -10% 18%, rgba(88,28,135,.55), transparent 48%), linear-gradient(180deg, #080414 0%, #140824 40%, #090510 100%)",
      }}
    >
      <div className="vn-grid pointer-events-none absolute inset-0 opacity-50" />
      <div
        className="vn-orb -right-10 top-40 h-56 w-56 opacity-70"
        style={{ background: withAlpha(accent, 0.22) }}
      />
      <span className="pointer-events-none absolute left-6 top-8 text-lg text-white/55">
        ( + )
      </span>
      <span
        className="pointer-events-none absolute bottom-28 left-8 hidden text-[11px] uppercase tracking-[0.55em] lg:block"
        style={{ writingMode: "vertical-rl", color: withAlpha(accent, 0.75) }}
      >
        galería
      </span>

      <header className="relative z-[1] mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-[11px] uppercase tracking-[0.28em] text-white/70">
        <p className="hidden text-right leading-4 sm:block">
          siguiente
          <br />
          <span className="text-white/40">nivel</span>
        </p>
        <nav className="mx-auto flex gap-5 sm:gap-8">
          <a href="#inicio">Inicio</a>
          <a href="#galeria">Galería</a>
          <a href="#sobre-mi">Sobre mí</a>
          <a href="#contacto">Contacto</a>
        </nav>
      </header>

      <section
        id="inicio"
        className="relative z-[1] mx-auto grid max-w-6xl items-end gap-4 px-6 pb-8 pt-2 lg:grid-cols-[.9fr_1.1fr]"
      >
        <div className="relative">
          <span
            className="pointer-events-none absolute -left-2 top-10 hidden text-xs uppercase tracking-[0.7em] lg:block"
            style={{
              writingMode: "vertical-rl",
              color: withAlpha(accent, 0.85),
              transform: "rotate(180deg)",
            }}
          >
            energía
          </span>
          {profile.photo ? (
            <div className="relative mx-auto max-w-[280px]">
              <div
                className="absolute inset-8 rounded-full blur-3xl"
                style={{ background: withAlpha(accent, 0.55) }}
              />
              <img
                src={profile.photo}
                alt={displayName}
                className="relative z-[1] w-full object-contain"
                style={{
                  filter: "grayscale(0.35) contrast(1.12) saturate(0.85)",
                  mixBlendMode: "screen",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, black 76%, transparent 100%)",
                  maskImage:
                    "linear-gradient(to bottom, black 76%, transparent 100%)",
                }}
              />
            </div>
          ) : (
            <div
              className="flex h-64 items-end justify-center rounded-[2rem] border border-white/10"
              style={{ background: withAlpha(accent, 0.12) }}
            >
              <p className="mb-10 text-white/40">Sube tu foto de perfil</p>
            </div>
          )}
        </div>

        <div className="relative pb-6">
          <p className="mb-4 text-right text-xs italic text-white/50">
            {profile.tagline || "¿Te gustaría ser parte de esto?"}
          </p>
          <span
            className="pointer-events-none absolute -right-2 top-8 hidden font-[family-name:var(--font-syne)] text-7xl leading-none text-white/90 lg:block"
            style={{ textShadow: `0 0 40px ${withAlpha(accent, 0.45)}` }}
          >
            {mark}
          </span>
          <div
            className="relative z-[1] max-w-md rounded-[2rem] border border-white/10 bg-black/45 p-7 backdrop-blur-xl"
            style={{
              boxShadow: `0 0 0 1px ${withAlpha(accent, 0.22)}, 0 30px 80px rgba(0,0,0,.4)`,
            }}
          >
            <h1 className="font-[family-name:var(--font-syne)] text-4xl leading-none sm:text-5xl">
              {displayName}
            </h1>
            <p className="mt-3 text-sm text-white/55">{handle}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#galeria"
                className="rounded-full px-5 py-2 text-sm text-white"
                style={{ background: accent }}
              >
                Ver proyectos
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-[1] mx-auto max-w-3xl px-6">
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-black/50 px-5 py-3 text-sm text-white/65 backdrop-blur-md">
          <span className="text-white/35">⌕</span>
          <span className="truncate">
            {shareUrl || "tu-enlace-publico.vercel.app/p/…"}
          </span>
        </div>
      </div>

      <section
        id="sobre-mi"
        className="relative z-[1] mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 lg:grid-cols-[220px_1fr]"
      >
        {phoneSrc ? (
          <DevicePreview src={phoneSrc} alt={displayName} accent={accent} />
        ) : (
          <div className="h-64 rounded-[2rem] border border-dashed border-white/15" />
        )}
        <div>
          <h2 className="font-[family-name:var(--font-syne)] text-5xl tracking-tight">
            Sobre mí
          </h2>
          <p className="mt-2 text-sm italic" style={{ color: accent }}>
            ¿Quién es {profile.name || "esta persona"}?
          </p>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/75">
            {profile.bio ||
              "Cuenta quién eres, cómo trabajas y qué tipo de proyectos te emocionan."}
          </p>
          {socials.length ? (
            <div id="contacto" className="mt-8 flex flex-wrap gap-3">
              {socials.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/15 px-5 py-2 text-sm text-white/90"
                  style={{ background: withAlpha(accent, 0.22) }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section id="galeria" className="relative z-[1] mx-auto max-w-6xl px-6 pb-12">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div className="flex items-center gap-4">
            <span
              className="grid h-12 w-12 place-items-center rounded-2xl text-2xl"
              style={{ color: accent, background: withAlpha(accent, 0.12) }}
            >
              ✳
            </span>
            <h2 className="font-[family-name:var(--font-syne)] text-5xl tracking-tight sm:text-6xl">
              Proyectos
            </h2>
          </div>
          <p className="max-w-xs text-right text-sm text-white/55">
            Pulsa una foto para verla en grande.
          </p>
        </div>

        <div className="space-y-12">
          {visibleProjects.length === 0 ? (
            <p className="rounded-[2rem] border border-white/10 p-10 text-white/50">
              Aún no hay proyectos publicados. Agrega bocetos, proceso o
              resultado cuando los tengas.
            </p>
          ) : (
            visibleProjects.map((project, index) => {
              const notes = projectNotes(project);
              return (
              <article
                key={project.id}
                className="grid items-center gap-6 rounded-[2rem] border border-white/10 bg-black/30 p-5 lg:grid-cols-12"
              >
                <div className={`lg:col-span-4 ${index % 2 ? "lg:order-2" : ""}`}>
                  <SectionLabel>{project.year || "Proyecto"}</SectionLabel>
                  <h3 className="mt-2 font-[family-name:var(--font-syne)] text-3xl">
                    {project.title || "Sin título"}
                  </h3>
                  {project.role ? (
                    <p className="mt-1 text-sm" style={{ color: accent }}>
                      {project.role}
                    </p>
                  ) : null}
                  {project.summary ? (
                    <p className="mt-4 text-sm leading-7 text-white/70">
                      {project.summary}
                    </p>
                  ) : null}
                  {notes.length ? (
                    <div className="mt-4 space-y-2 text-sm leading-6 text-white/65">
                      {notes.map((note) => (
                        <p key={note.key}>
                          <span className="uppercase tracking-[0.16em] text-white/40">
                            {note.label}.{" "}
                          </span>
                          {note.text}
                        </p>
                      ))}
                    </div>
                  ) : null}
                </div>
                <div className={`lg:col-span-8 ${index % 2 ? "lg:order-1" : ""}`}>
                  <PhotoCollection
                    images={projectImages(project)}
                    photoStyle={appearance.photoStyle}
                    accent={accent}
                    alt={project.title}
                    layout={index % 2 ? "overlap" : "mosaic"}
                  />
                </div>
              </article>
              );
            })
          )}
        </div>
      </section>

      <footer className="relative z-[1] px-6 py-10 text-center text-xs uppercase tracking-[0.3em] text-white/35">
        creado para {displayName}
      </footer>
    </div>
  );
}
