import type { Portfolio, Project } from "@/lib/types";
import { projectHasContent } from "@/lib/portfolio";
import { PhotoCollection } from "./PhotoGallery";
import { Reveal } from "./Reveal";
import { ProjectDocs } from "./ProjectDocs";
import {
  ProfilePhoto,
  firstProjectImage,
  projectImages,
  projectNotes,
  socialEntries,
  themeVars,
} from "./media";

function Notes({ project, className }: { project: Project; className: string }) {
  const notes = projectNotes(project);
  if (!notes.length && !project.summary) return null;
  return (
    <div className={`space-y-2 text-sm leading-6 ${className}`}>
      {project.summary ? <p>{project.summary}</p> : null}
      {notes.map((note) => (
        <p key={note.key}>
          <span className="font-semibold uppercase tracking-[0.16em] opacity-70">
            {note.label}.{" "}
          </span>
          {note.text}
        </p>
      ))}
    </div>
  );
}

export function SocialPress({
  portfolio,
}: {
  portfolio: Portfolio;
  shareUrl?: string;
}) {
  const { profile, appearance, projects } = portfolio;
  const accent = appearance.accent;
  const visible = projects.filter(projectHasContent);
  const displayName = profile.name || "Tu nombre";
  const firstName = displayName.split(" ")[0];
  const socials = socialEntries(portfolio);
  const stats = [
    { value: profile.stats.years, label: "Años" },
    { value: profile.stats.projects, label: "Proyectos" },
    { value: profile.stats.clients, label: "Clientes" },
    { value: profile.stats.awards, label: "Logros" },
  ].filter((item) => item.value.trim());
  const verticals = visible.flatMap(projectImages).slice(0, 4);

  return (
    <div className="social-press min-h-screen" style={themeVars(accent, "social-press")}>
      <header className="mx-auto flex max-w-6xl flex-wrap justify-center gap-6 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.28em]">
        <a href="#trabajo">Mi trabajo</a>
        <a href="#sobre-mi">Sobre mí</a>
        <a href="#casos">Casos</a>
        <a href="#contacto">Contacto</a>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-8 pt-4">
        <p className="relative z-10 font-[family-name:var(--font-script)] text-4xl leading-none sm:text-6xl">
          portafolio de {firstName.toLowerCase()}
        </p>
        <div className="mt-4 grid items-center gap-3 md:grid-cols-[minmax(0,1fr)_minmax(160px,240px)_minmax(0,1fr)]">
          <h1 className="hidden text-right font-[family-name:var(--font-bebas)] text-[clamp(3.5rem,10vw,8.5rem)] leading-[0.8] tracking-wide md:block" style={{ color: "var(--display)" }}>
            PORTA
          </h1>
          {profile.photo ? (
            <ProfilePhoto
              src={profile.photo}
              alt={displayName}
              shape="portrait"
              className="mx-auto max-h-[340px] w-full max-w-[240px] shadow-2xl"
            />
          ) : (
            <div className="mx-auto aspect-[3/4] w-full max-w-[240px]" style={{ background: "var(--page-2)" }} />
          )}
          <h1 className="hidden font-[family-name:var(--font-bebas)] text-[clamp(3.5rem,10vw,8.5rem)] leading-[0.8] tracking-wide md:block" style={{ color: "var(--display)" }}>
            FOLIO
          </h1>
          <h1 className="text-center font-[family-name:var(--font-bebas)] text-6xl leading-[0.8] tracking-wide md:hidden" style={{ color: "var(--display)" }}>
            PORTAFOLIO
          </h1>
        </div>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <p className="max-w-md text-sm leading-7">
            {profile.tagline ||
              "Historias visuales que conectan marcas con su audiencia."}
          </p>
          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em]">
            {socials.map((item) => (
              <a key={item.label} href={item.href}>
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="sobre-mi" className="mx-auto grid max-w-6xl gap-3 px-6 pb-6 lg:grid-cols-2">
        <Reveal className="p-6" style={{ background: "var(--page-2)" }}>
          <h2 className="font-[family-name:var(--font-bebas)] text-5xl tracking-wide">
            ¿Quién soy?
          </h2>
          <p className="mt-4 text-sm leading-7">
            {profile.bio ||
              "Cuenta tu enfoque en redes, contenido y las marcas con las que trabajas."}
          </p>
          {stats.length ? (
            <div className="mt-6 flex flex-wrap gap-3">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="px-3 py-2 text-center"
                  style={{ background: "var(--accent-2)", color: "var(--paper)" }}
                >
                  <p className="text-lg font-semibold">{item.value}</p>
                  <p className="text-[10px] uppercase tracking-[0.16em]">{item.label}</p>
                </div>
              ))}
            </div>
          ) : null}
        </Reveal>
        <Reveal delay={80} className="p-6" style={{ background: "var(--paper)" }}>
          <h2 className="font-[family-name:var(--font-bebas)] text-5xl tracking-wide">
            Perfil
          </h2>
          <p className="mt-3 text-sm uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>
            {profile.role || "Creadora de contenido"}
            {profile.location ? ` · ${profile.location}` : ""}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {(profile.role || "Social media, Contenido, Dirección de arte")
              .split(/[,/|]/)
              .map((skill) => skill.trim())
              .filter(Boolean)
              .slice(0, 6)
              .map((skill) => (
                <span
                  key={skill}
                  className="rounded-full px-3 py-1 text-xs"
                  style={{ background: "var(--accent-2)", color: "var(--paper)" }}
                >
                  {skill}
                </span>
              ))}
          </div>
        </Reveal>
      </section>

      <section id="trabajo" className="mx-auto max-w-6xl px-6 pb-6">
        <h2 className="mb-4 font-[family-name:var(--font-bebas)] text-5xl tracking-wide">
          Mi trabajo incluye
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project) => {
            const cover = firstProjectImage(project);
            return (
              <article key={project.id} className="p-3" style={{ background: "var(--paper)" }}>
                {cover ? (
                  <img
                    src={cover.src}
                    alt={project.title}
                    className="mb-3 aspect-[3/4] w-full object-contain"
                  />
                ) : (
                  <div className="mb-3 aspect-[3/4]" style={{ background: "var(--page)" }} />
                )}
                <h3 className="font-semibold">{project.title || "Proyecto"}</h3>
                <p className="text-xs uppercase tracking-[0.16em]" style={{ color: "var(--muted)" }}>
                  {project.role || project.year}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="casos" className="mx-auto max-w-6xl space-y-4 px-6 pb-6">
        <h2 className="font-[family-name:var(--font-bebas)] text-5xl tracking-wide">
          Casos de estudio
        </h2>
        {visible.map((project, index) => (
          <Reveal key={project.id} delay={index * 60} className="grid gap-4 p-5 lg:grid-cols-[0.9fr_1.1fr]" style={{ background: "var(--paper)" }}>
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>
                {project.year || "Caso"}
              </p>
              <h3 className="mt-1 text-2xl font-semibold">
                {project.title || "Sin título"}
              </h3>
              <Notes project={project} className="mt-3 opacity-80" />
              <ProjectDocs project={project} />
            </div>
            <PhotoCollection
              images={projectImages(project)}
              photoStyle={appearance.photoStyle}
              accent={accent}
              alt={project.title}
              layout="board"
            />
          </Reveal>
        ))}
      </section>

      {verticals.length ? (
        <section className="mx-auto max-w-6xl px-6 pb-10">
          <h2 className="mb-4 font-[family-name:var(--font-bebas)] text-5xl tracking-wide">
            Formato vertical
          </h2>
          <PhotoCollection
            images={verticals}
            photoStyle="device"
            accent={accent}
            alt="Formato vertical"
            layout="fan"
            groupByStage={false}
          />
        </section>
      ) : null}

      <section id="contacto" className="px-6 py-10" style={{ background: "var(--accent-2)", color: "var(--paper)" }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <p className="font-[family-name:var(--font-bebas)] text-4xl tracking-wide">
            Contacto
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            {socials.map((item) => (
              <a key={item.label} href={item.href} className="underline">
                {item.label}
              </a>
            ))}
            {profile.email ? <span>{profile.email}</span> : null}
          </div>
        </div>
      </section>
    </div>
  );
}

export function BurgundyStudio({
  portfolio,
}: {
  portfolio: Portfolio;
  shareUrl?: string;
}) {
  const { profile, appearance, projects } = portfolio;
  const accent = appearance.accent;
  const visible = projects.filter(projectHasContent);
  const displayName = profile.name || "Tu nombre";
  const parts = displayName.split(" ");
  const socials = socialEntries(portfolio);
  const mosaic = profile.photo
    ? Array.from({ length: 16 }, (_, index) => ({
        id: `m-${index}`,
        src: profile.photo,
      }))
    : [];
  const covers = visible
    .map((project) => ({
      project,
      image: firstProjectImage(project),
    }))
    .filter((item) => item.image);

  return (
    <div
      className="burgundy-studio min-h-screen"
      style={themeVars(accent, "burgundy-studio")}
    >
      <section className="mx-auto max-w-5xl px-6 pb-8 pt-10">
        <p className="font-[family-name:var(--font-bebas)] text-[18vw] leading-[0.8] tracking-wide sm:text-8xl">
          PORTAFOLIO
        </p>
        <div className="mt-2 grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
          <p className="font-[family-name:var(--font-bebas)] text-4xl tracking-wide sm:text-right">
            {parts[0]}
          </p>
          {profile.photo ? (
            <img
              src={profile.photo}
              alt={displayName}
              className="mx-auto h-44 w-36 object-contain object-top"
            />
          ) : (
            <div className="mx-auto h-40 w-40" style={{ background: "var(--accent-soft)" }} />
          )}
          <p className="font-[family-name:var(--font-bebas)] text-4xl tracking-wide">
            {parts.slice(1).join(" ") || profile.role}
          </p>
        </div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.28em]">
          {profile.role || "Diseño UX UI web"}
        </p>
      </section>

      <section id="sobre-mi" style={{ background: "var(--accent)", color: "var(--paper)" }}>
        <div className="mx-auto grid max-w-5xl items-stretch gap-0 md:grid-cols-2">
          <Reveal className="p-8">
            <h2 className="font-[family-name:var(--font-bebas)] text-5xl tracking-wide">
              Sobre mí
            </h2>
            <p className="mt-4 text-sm leading-7 opacity-85">
              {profile.bio ||
                "Preséntate: tu nivel, tu enfoque en producto digital y hacia dónde quieres crecer."}
            </p>
          </Reveal>
          {mosaic.length ? (
            <div className="grid grid-cols-4">
              {mosaic.map((tile, index) => (
                <div key={tile.id} className="aspect-square overflow-hidden">
                  <img
                    src={tile.src}
                    alt=""
                    className="h-full w-full object-cover"
                    style={{
                      objectPosition: `${(index % 4) * 28}% ${Math.floor(index / 4) * 28}%`,
                    }}
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section id="trabajo" className="mx-auto max-w-5xl px-6 py-10">
        <h2 className="mb-6 font-[family-name:var(--font-bebas)] text-5xl tracking-wide">
          Mis trabajos
        </h2>
        {covers.length ? (
          <div className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-3">
            {covers.map(({ project, image }) => (
              <a key={project.id} href={`#p-${project.id}`} className="block bg-white p-2">
                <img
                  src={image?.src}
                  alt={project.title}
                  className="aspect-[4/3] w-full object-contain"
                />
              </a>
            ))}
          </div>
        ) : null}
        <div className="space-y-8">
          {visible.map((project) => (
            <article key={project.id} id={`p-${project.id}`}>
              <h3 className="mb-3 text-2xl">{project.title || "Sin título"}</h3>
              <PhotoCollection
                images={projectImages(project)}
                photoStyle={appearance.photoStyle}
                accent={accent}
                alt={project.title}
                layout="bento"
              />
              <Notes project={project} className="mt-3 opacity-80" />
              <ProjectDocs project={project} />
            </article>
          ))}
        </div>
      </section>

      <section id="contacto" className="px-6 py-10" style={{ background: "var(--accent)", color: "var(--paper)" }}>
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
          <h2 className="font-[family-name:var(--font-bebas)] text-5xl tracking-wide">
            Contactos
          </h2>
          <div className="space-y-1 text-sm">
            {socials.map((item) => (
              <p key={item.label}>
                <a href={item.href} className="underline">
                  {item.label}
                </a>
              </p>
            ))}
            {profile.email ? <p>{profile.email}</p> : null}
          </div>
        </div>
      </section>
    </div>
  );
}
