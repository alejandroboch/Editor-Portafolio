import type { Portfolio } from "@/lib/types";
import { projectHasContent } from "@/lib/portfolio";
import { PhotoCollection } from "./PhotoGallery";
import { Reveal } from "./Reveal";
import { ProjectDocs } from "./ProjectDocs";
import {
  ProfilePhoto,
  SectionLabel,
  firstProjectImage,
  initialsOf,
  projectImages,
  projectNotes,
  themeVars,
  withAlpha,
} from "./media";

export function LilacStudio({
  portfolio,
}: {
  portfolio: Portfolio;
  shareUrl?: string;
}) {
  const { profile, appearance, projects } = portfolio;
  const accent = appearance.accent;
  const visibleProjects = projects.filter(projectHasContent);
  const displayName = profile.name || "Tu nombre";
  const initials = initialsOf(displayName);

  const stats = [
    { value: profile.stats.years, label: "Años de experiencia" },
    { value: profile.stats.projects, label: "Proyectos" },
    { value: profile.stats.clients, label: "Clientes" },
    { value: profile.stats.awards, label: "Reconocimientos" },
  ].filter((item) => item.value.trim());

  const talkHref = profile.email
    ? `mailto:${profile.email}`
    : profile.socials.website ||
      profile.socials.linkedin ||
      profile.socials.instagram ||
      "#contacto";

  return (
    <div
      className="lilac-studio relative min-h-screen overflow-hidden text-slate-800"
      style={{
        ...themeVars(accent, "lilac-studio"),
        background: `radial-gradient(720px 420px at 92% 0%, ${withAlpha(accent, 0.35)}, transparent 55%), radial-gradient(480px 280px at 8% 8%, rgba(255,255,255,.95), transparent 50%), var(--page)`,
      }}
    >
      <span className="ls-spark left-[46%] top-28 opacity-80" />
      <span className="ls-spark right-[28%] top-40 opacity-70" />

      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-semibold text-white"
          style={{ background: accent }}
        >
          {initials}
        </div>
        <nav className="hidden items-center gap-7 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 md:flex">
          <a href="#inicio">Inicio</a>
          <a href="#trabajo">Trabajo</a>
          <a href="#sobre-mi">Sobre mí</a>
          <a href="#contacto">Contacto</a>
        </nav>
        <a
          href={talkHref}
          className="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white"
          style={{ background: accent }}
        >
          Hablemos
        </a>
      </header>

      <section
        id="inicio"
        className="mx-auto grid max-w-6xl items-center gap-10 px-6 pb-8 pt-4 lg:grid-cols-[1.15fr_.85fr]"
      >
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-[0.28em]"
            style={{ color: accent }}
          >
            Hola, soy creativa
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-fraunces)] text-5xl leading-[0.88] text-slate-900 sm:text-7xl">
            {profile.role || "Diseñadora digital"}
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-500">
            {profile.tagline ||
              "Diseño experiencias digitales hermosas, funcionales y fáciles de usar."}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#trabajo"
              className="rounded-full px-5 py-2.5 text-sm font-medium text-white"
              style={{ background: accent }}
            >
              Ver portafolio
            </a>
            {profile.email ? (
              <a
                href={`mailto:${profile.email}`}
                className="rounded-full border border-violet-200 bg-white/80 px-5 py-2.5 text-sm text-slate-600"
              >
                Contactar
              </a>
            ) : null}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm">
          <div
            className="absolute -right-4 top-6 h-52 w-52 rounded-full"
            style={{ background: withAlpha(accent, 0.18) }}
          />
          <div className="relative overflow-hidden rounded-full border-[10px] border-white shadow-[0_25px_60px_rgba(124,107,196,.18)]">
            {profile.photo ? (
              <ProfilePhoto
                src={profile.photo}
                alt={displayName}
                shape="circle"
              />
            ) : (
              <div className="flex aspect-square items-center justify-center bg-violet-100 text-violet-400">
                Foto de perfil
              </div>
            )}
          </div>
          {profile.location ? (
            <div className="absolute bottom-8 right-0 rounded-2xl bg-white/95 px-4 py-2 text-xs font-medium text-slate-500 shadow-lg">
              Desde {profile.location}
            </div>
          ) : null}
        </div>
      </section>

      {stats.length ? (
        <section className="mx-auto grid max-w-6xl gap-4 px-6 pb-10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-[1.6rem] bg-white/90 px-6 py-5 text-center shadow-[0_12px_30px_rgba(124,107,196,.08)]"
            >
              <p
                className="font-[family-name:var(--font-fraunces)] text-3xl"
                style={{ color: accent }}
              >
                {item.value}
              </p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                {item.label}
              </p>
            </div>
          ))}
        </section>
      ) : null}

      {visibleProjects.length ? (
        <section className="mx-auto max-w-6xl px-6 pb-6">
          <p
            className="text-xs font-semibold uppercase tracking-[0.28em]"
            style={{ color: accent }}
          >
            Especialidad
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {visibleProjects.slice(0, 4).map((project) => {
              const cover = firstProjectImage(project);
              return (
                <article
                  key={project.id}
                  className="overflow-hidden rounded-[1.8rem] bg-white p-4 shadow-[0_16px_36px_rgba(124,107,196,.1)]"
                >
                  {cover ? (
                    <img
                      src={cover.src}
                      alt={project.title}
                      className="mb-3 aspect-[3/4] w-full rounded-[1.2rem] bg-violet-50 object-contain"
                    />
                  ) : (
                    <div
                      className="mb-3 h-28 rounded-[1.2rem]"
                      style={{ background: withAlpha(accent, 0.14) }}
                    />
                  )}
                  <h3 className="font-[family-name:var(--font-fraunces)] text-xl text-slate-900">
                    {project.title || "Proyecto"}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {project.summary || project.role || "Caso de estudio"}
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      <section id="sobre-mi" className="mx-auto max-w-6xl px-6 py-8">
        <div className="rounded-[2rem] bg-white/80 p-8 shadow-[0_16px_40px_rgba(124,107,196,.08)]">
          <SectionLabel>Sobre mí</SectionLabel>
          <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-3xl text-slate-900">
            {displayName}
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-500">
            {profile.bio ||
              "Escribe una bio breve: tu enfoque, industrias con las que trabajas y lo que te hace distinta en el mercado."}
          </p>
        </div>
      </section>

      <section id="trabajo" className="mx-auto max-w-6xl px-6 py-8">
        <p
          className="text-xs font-semibold uppercase tracking-[0.28em]"
          style={{ color: accent }}
        >
          Trabajo seleccionado
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-4xl text-slate-900">
          Proyectos
        </h2>
        <div className="mt-8 space-y-8">
          {visibleProjects.length === 0 ? (
            <p className="rounded-[2rem] bg-white/70 p-10 text-slate-400">
              Aún no hay proyectos publicados. Puedes subir solo el resultado,
              o también bocetos y proceso si los tienes.
            </p>
          ) : (
            visibleProjects.map((project, index) => {
              const notes = projectNotes(project);
              return (
              <Reveal key={project.id} delay={index * 70}>
              <article
                className="grid overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_40px_rgba(124,107,196,.1)] lg:grid-cols-12"
              >
                <div className={`p-6 lg:col-span-4 ${index % 2 ? "lg:order-2" : ""}`}>
                  <SectionLabel>{project.year || "Caso de estudio"}</SectionLabel>
                  <h3 className="mt-1 font-[family-name:var(--font-fraunces)] text-3xl text-slate-900">
                    {project.title || "Sin título"}
                  </h3>
                  {project.role ? (
                    <p className="mt-1 text-sm" style={{ color: accent }}>
                      {project.role}
                    </p>
                  ) : null}
                  {project.summary ? (
                    <p className="mt-4 text-sm leading-7 text-slate-500">
                      {project.summary}
                    </p>
                  ) : null}
                  {notes.length ? (
                    <div className="mt-4 space-y-2 text-sm leading-6 text-slate-500">
                      {notes.map((note) => (
                        <p key={note.key}>
                          <span className="font-semibold uppercase tracking-[0.14em] text-slate-400">
                            {note.label}.{" "}
                          </span>
                          {note.text}
                        </p>
                      ))}
                    </div>
                  ) : null}
                  <ProjectDocs project={project} />
                </div>
                <div className={`p-4 lg:col-span-8 ${index % 2 ? "lg:order-1" : ""}`}>
                  <PhotoCollection
                    images={projectImages(project)}
                    photoStyle={appearance.photoStyle}
                    accent={accent}
                    alt={project.title}
                    layout={index % 2 ? "bento" : "magazine"}
                  />
                </div>
              </article>
              </Reveal>
              );
            })
          )}
        </div>
      </section>

      <section id="contacto" className="mx-auto max-w-6xl px-6 pb-16 pt-4">
        <div
          className="overflow-hidden rounded-[2rem] px-8 py-10 text-white"
          style={{
            background: `linear-gradient(135deg, ${accent}, ${withAlpha(accent, 0.75)})`,
          }}
        >
          <p className="text-xs uppercase tracking-[0.28em] text-white/70">
            Creemos algo juntos
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-4xl">
            {displayName}
          </h2>
          <p className="mt-3 max-w-lg text-sm text-white/80">
            Si este trabajo resuena contigo, hablemos de tu siguiente proyecto.
          </p>
        </div>
      </section>
    </div>
  );
}
