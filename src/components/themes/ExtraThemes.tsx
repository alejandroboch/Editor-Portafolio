import { STAGE_META, type Portfolio, type Project } from "@/lib/types";
import { projectHasContent } from "@/lib/portfolio";
import { PhotoCollection, type GalleryLayout } from "./PhotoGallery";
import {
  projectImages,
  projectNotes,
  socialEntries,
  themeVars,
  withAlpha,
} from "./media";

function Notes({
  project,
  className,
}: {
  project: Project;
  className: string;
}) {
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

function Spread({
  project,
  accent,
  photoStyle,
  layout,
  reverse = false,
  panelClass,
  titleClass,
  noteClass,
}: {
  project: Project;
  accent: string;
  photoStyle: Portfolio["appearance"]["photoStyle"];
  layout: GalleryLayout;
  reverse?: boolean;
  panelClass: string;
  titleClass: string;
  noteClass: string;
}) {
  const images = projectImages(project);
  return (
    <article
      className={`grid items-stretch gap-0 overflow-hidden lg:grid-cols-12 ${panelClass}`}
    >
      <div className={`p-5 lg:col-span-4 ${reverse ? "lg:order-2" : ""}`}>
        <p className="text-[11px] uppercase tracking-[0.22em] opacity-60">
          {project.year || "Proyecto"}
        </p>
        <h3 className={titleClass}>{project.title || "Sin título"}</h3>
        {project.role ? (
          <p className="mt-1 text-sm opacity-80">{project.role}</p>
        ) : null}
        <Notes project={project} className={`mt-4 ${noteClass}`} />
      </div>
      <div className={`p-3 lg:col-span-8 ${reverse ? "lg:order-1" : ""}`}>
        <PhotoCollection
          images={images}
          photoStyle={photoStyle}
          accent={accent}
          alt={project.title}
          layout={layout}
        />
      </div>
    </article>
  );
}

export function CoastEditorial({ portfolio }: { portfolio: Portfolio; shareUrl?: string }) {
  const { profile, appearance, projects } = portfolio;
  const accent = appearance.accent;
  const visible = projects.filter(projectHasContent);
  const displayName = profile.name || "Tu nombre";
  const first = visible[0];
  const rest = visible.slice(1);
  const photoPool = visible.flatMap(projectImages);
  const socials = socialEntries(portfolio);
  const tall = photoPool[0];
  const stack = photoPool.slice(1, 4);

  return (
    <div
      className="coast-editorial min-h-screen text-white"
      style={{ ...themeVars(accent), background: "#2f6f80" }}
    >
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-6 px-6 py-4 text-[11px] uppercase tracking-[0.28em]">
        <a href="#casos">Casos</a>
        <a href="#sobre-mi">Sobre mí</a>
        <a href="#fotos">Fotografía</a>
        <a href="#contacto">Contacto</a>
      </header>

      <section className="relative mx-auto max-w-6xl overflow-hidden">
        {profile.photo ? (
          <img
            src={profile.photo}
            alt={displayName}
            className="h-[380px] w-full object-cover object-top"
          />
        ) : (
          <div className="h-[380px] bg-white/10" />
        )}
        <div className="absolute inset-x-0 bottom-10 text-center">
          <p className="font-[family-name:var(--font-playfair)] text-5xl italic sm:text-7xl">
            Portafolio de {displayName.split(" ")[0]}
          </p>
          <p className="mt-3 text-xs uppercase tracking-[0.4em]">
            {profile.role || "Creadora de contenido"}
          </p>
        </div>
      </section>

      <section
        id="sobre-mi"
        className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-3 py-6 lg:grid-cols-12"
      >
        <div className="col-span-2 flex flex-col gap-3 lg:col-span-3">
          {tall ? (
            <img src={tall.src} alt="" className="h-64 w-full object-cover lg:h-full" />
          ) : null}
          {stack.map((image) => (
            <img key={image.id} src={image.src} alt="" className="h-28 w-full object-cover" />
          ))}
        </div>
        <div className="col-span-2 bg-[#1f5563] p-6 lg:col-span-4">
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl italic">Sobre mí</h2>
          <p className="mt-4 text-sm leading-7 text-white/85">
            {profile.bio || "Cuenta tu historia, tu estilo y el tipo de proyectos que buscas."}
          </p>
        </div>
        <div id="fotos" className="col-span-2 bg-white p-4 text-[#1f5563] lg:col-span-5">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl">Fotografía</h2>
          <PhotoCollection
            images={photoPool.slice(0, 8)}
            photoStyle="editorial"
            accent={accent}
            alt="Fotografía"
            layout="magazine"
            className="mt-3"
          />
        </div>
      </section>

      <section id="casos" className="mx-auto max-w-6xl space-y-3 px-3 pb-8">
        {first ? (
          <div className="relative overflow-hidden bg-white text-[#1f4f5c]">
            <PhotoCollection
              images={projectImages(first)}
              photoStyle="editorial"
              accent={accent}
              alt={first.title}
              layout="magazine"
            />
            <div className="absolute bottom-4 left-4 max-w-sm bg-[#1f5563]/90 p-4 text-white">
              <p className="text-[11px] uppercase tracking-[0.2em]">{first.year}</p>
              <h3 className="font-[family-name:var(--font-playfair)] text-3xl">
                {first.title || "Proyecto"}
              </h3>
              <Notes project={first} className="mt-2 text-white/85" />
            </div>
          </div>
        ) : (
          <p className="p-8 text-white/70">Aún no hay proyectos.</p>
        )}
        {rest.map((project, index) => (
          <Spread
            key={project.id}
            project={project}
            accent={accent}
            photoStyle="editorial"
            layout="magazine"
            reverse={index % 2 === 0}
            panelClass="bg-white text-[#1f4f5c]"
            titleClass="font-[family-name:var(--font-playfair)] text-3xl"
            noteClass="text-[#1f4f5c]/80"
          />
        ))}
      </section>

      <section id="contacto" className="mx-auto grid max-w-6xl grid-cols-1 gap-3 px-3 pb-16 lg:grid-cols-2">
        <div className="bg-[#1f5563] p-6">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl italic">Contacto</h2>
          <p className="mt-3 text-sm">
            {profile.email || profile.location || "Añade tu correo para que te escriban."}
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            {socials.map((item) => (
              <a key={item.label} href={item.href} className="underline">
                {item.label}
              </a>
            ))}
          </div>
        </div>
        {photoPool[4] ? (
          <img src={photoPool[4].src} alt="" className="h-48 w-full object-cover" />
        ) : profile.photo ? (
          <img src={profile.photo} alt="" className="h-48 w-full object-cover" />
        ) : null}
      </section>
    </div>
  );
}

export function PolaroidNavy({ portfolio }: { portfolio: Portfolio; shareUrl?: string }) {
  const { profile, appearance, projects } = portfolio;
  const accent = appearance.accent;
  const visible = projects.filter(projectHasContent);
  const displayName = profile.name || "Tu nombre";
  const stats = [
    { value: profile.stats.years, label: "Años" },
    { value: profile.stats.projects, label: "Proyectos" },
    { value: profile.stats.clients, label: "Clientes" },
    { value: profile.stats.awards, label: "Logros" },
  ].filter((item) => item.value.trim());
  const mosaic = visible.flatMap(projectImages);
  const socials = socialEntries(portfolio);

  return (
    <div className="polaroid-navy min-h-screen bg-[#f7f4ee] text-[#16324a]" style={themeVars(accent)}>
      <section className="mx-auto grid max-w-6xl items-center gap-4 px-6 py-8 lg:grid-cols-[1fr_1fr]">
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-5xl leading-[0.9] sm:text-7xl">
            Portafolio de
            <br />
            {displayName.split(" ")[0]}
          </h1>
          <p className="mt-4 text-sm uppercase tracking-[0.28em] text-[#2c5a7a]">
            {profile.role || "Creadora visual"}
            {profile.location ? ` · ${profile.location}` : ""}
          </p>
        </div>
        <div className="relative h-[340px]">
          {profile.photo ? (
            <img
              src={profile.photo}
              alt={displayName}
              className="absolute right-10 top-6 z-[3] w-48 object-cover shadow-2xl"
            />
          ) : null}
          <PhotoCollection
            images={mosaic.slice(0, 5)}
            photoStyle="polaroid"
            accent={accent}
            alt="Collage"
            layout="overlap"
          />
        </div>
      </section>

      <section id="sobre-mi" className="mx-auto grid max-w-6xl gap-3 px-4 pb-6 lg:grid-cols-12">
        <div className="bg-white p-6 lg:col-span-4">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl">Sobre mí</h2>
          <p className="mt-3 text-sm leading-7 text-[#16324a]/80">
            {profile.bio || "Presenta tu voz, tu nicho y cómo trabajas con marcas o clientes."}
          </p>
        </div>
        <div className="bg-[#1b3d57] p-4 text-white lg:col-span-5">
          <p className="text-[11px] uppercase tracking-[0.24em] text-white/60">Contenido</p>
          <PhotoCollection
            images={mosaic.slice(0, 6)}
            photoStyle="polaroid"
            accent={accent}
            alt="Contenido"
            layout="scatter"
          />
        </div>
        {stats.length ? (
          <div className="grid grid-cols-2 gap-2 lg:col-span-3">
            {stats.map((item) => (
              <div key={item.label} className="bg-[#1b3d57] p-4 text-center text-white">
                <p className="text-2xl font-semibold">{item.value}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/70">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <section id="casos" className="mx-auto max-w-6xl space-y-4 px-4 pb-8">
        {visible.map((project, index) => (
          <Spread
            key={project.id}
            project={project}
            accent={accent}
            photoStyle="polaroid"
            layout={index % 2 ? "scatter" : "overlap"}
            reverse={index % 2 === 1}
            panelClass={index % 2 ? "bg-[#1b3d57] text-white" : "bg-white"}
            titleClass="font-[family-name:var(--font-playfair)] text-3xl"
            noteClass={index % 2 ? "text-white/80" : "text-[#16324a]/80"}
          />
        ))}
      </section>

      <section id="contacto" className="mx-auto max-w-6xl px-4 pb-16">
        <div className="flex flex-wrap gap-4 bg-[#1b3d57] p-6 text-white">
          {socials.map((item) => (
            <a key={item.label} href={item.href} className="underline">
              {item.label}
            </a>
          ))}
          <span>{profile.email}</span>
        </div>
      </section>
    </div>
  );
}

export function SolarPop({ portfolio }: { portfolio: Portfolio; shareUrl?: string }) {
  const { profile, appearance, projects } = portfolio;
  const accent = appearance.accent;
  const visible = projects.filter(projectHasContent);
  const displayName = profile.name || "Tu nombre";
  const stats = [
    { value: profile.stats.years, label: "Años" },
    { value: profile.stats.projects, label: "Proyectos" },
    { value: profile.stats.clients, label: "Clientes" },
    { value: profile.stats.awards, label: "Industrias" },
  ].filter((item) => item.value.trim());
  const socials = socialEntries(portfolio);

  return (
    <div
      className="solar-pop relative min-h-screen overflow-hidden text-[#3b2418]"
      style={{
        ...themeVars(accent),
        background: "#fff6ec",
      }}
    >
      <div
        className="pointer-events-none absolute -right-16 top-10 h-64 w-64 rounded-full"
        style={{ background: withAlpha(accent, 0.25) }}
      />
      <div
        className="pointer-events-none absolute -left-10 bottom-40 h-40 w-40 rounded-[2rem] rotate-12"
        style={{ background: withAlpha(accent, 0.18) }}
      />

      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <p className="text-xs font-bold uppercase tracking-[0.28em]" style={{ color: accent }}>
          {displayName}
        </p>
        <a
          href="#contacto"
          className="rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white"
          style={{ background: accent }}
        >
          Creemos
        </a>
      </header>

      <section className="relative mx-auto grid max-w-6xl items-center gap-6 px-6 pb-8 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <h1
            className="font-[family-name:var(--font-bebas)] text-6xl leading-[0.85] sm:text-8xl"
            style={{ color: accent }}
          >
            {profile.role || "Diseño de marca"}
            <br />
            que brilla
          </h1>
          <p className="mt-4 max-w-md text-sm leading-7">
            {profile.tagline || "Marcas valientes, sitios memorables y piezas que se sienten vivas."}
          </p>
        </div>
        <div className="relative">
          <div
            className="absolute -left-6 top-8 h-40 w-40 rounded-full"
            style={{ background: withAlpha(accent, 0.35) }}
          />
          {profile.photo ? (
            <img
              src={profile.photo}
              alt={displayName}
              className="relative z-[1] ml-auto h-72 w-64 rounded-[3rem] object-cover"
            />
          ) : (
            <div className="relative z-[1] ml-auto h-72 w-64 rounded-[3rem] bg-orange-100" />
          )}
        </div>
      </section>

      <section id="sobre-mi" className="relative mx-auto grid max-w-6xl gap-4 px-6 pb-8 lg:grid-cols-[1.4fr_.6fr]">
        <div className="rounded-[2.2rem] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Hola, soy {displayName}.</h2>
          <p className="mt-3 text-sm leading-7 text-[#3b2418]/75">
            {profile.bio || "Cuenta cómo diseñas marcas y por qué tu proceso se siente distinto."}
          </p>
        </div>
        {stats.length ? (
          <div className="grid grid-cols-2 gap-2">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-[1.4rem] p-3 text-center text-white"
                style={{ background: accent }}
              >
                <p className="text-2xl font-bold">{item.value}</p>
                <p className="text-[10px] uppercase tracking-[0.16em]">{item.label}</p>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <section id="trabajo" className="relative mx-auto max-w-6xl px-6 pb-8">
        <h2 className="font-[family-name:var(--font-bebas)] text-5xl" style={{ color: accent }}>
          Trabajos seleccionados
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {visible.map((project, index) => (
            <article
              key={project.id}
              className="overflow-hidden rounded-[2rem] p-4 text-white"
              style={{
                background: index % 2 === 0 ? accent : "#fff",
                color: index % 2 === 0 ? "#fff" : "#3b2418",
              }}
            >
              <p className="text-[10px] uppercase tracking-[0.18em] opacity-70">
                {project.role || "Proyecto"}
              </p>
              <h3 className="mb-3 text-2xl font-bold">{project.title || "Sin título"}</h3>
              <PhotoCollection
                images={projectImages(project)}
                photoStyle="soft-card"
                accent={accent}
                alt={project.title}
                layout="bento"
              />
              <Notes
                project={project}
                className={`mt-3 ${index % 2 === 0 ? "text-white/85" : "text-[#3b2418]/75"}`}
              />
            </article>
          ))}
        </div>
      </section>

      <section id="contacto" className="relative mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-[2rem] p-8 text-white" style={{ background: accent }}>
          <h2 className="font-[family-name:var(--font-bebas)] text-5xl">Construyamos algo increíble</h2>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            {socials.map((item) => (
              <a key={item.label} href={item.href} className="underline">
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function CrimsonAtelier({ portfolio }: { portfolio: Portfolio; shareUrl?: string }) {
  const { profile, appearance, projects } = portfolio;
  const accent = appearance.accent;
  const visible = projects.filter(projectHasContent);
  const displayName = profile.name || "Tu nombre";
  const socials = socialEntries(portfolio);
  const first = visible[0];
  const others = visible.slice(1);

  return (
    <div
      className="crimson-atelier min-h-screen text-[#f3d6a5]"
      style={{ ...themeVars(accent), background: "#3d0b14" }}
    >
      <section className="relative mx-auto max-w-6xl px-6 py-8">
        <p className="absolute left-6 top-10 z-[2] font-[family-name:var(--font-cormorant)] text-7xl leading-none sm:text-8xl">
          Portafolio
        </p>
        {profile.photo ? (
          <img
            src={profile.photo}
            alt={displayName}
            className="ml-auto h-80 w-[55%] object-cover object-top"
          />
        ) : (
          <div className="ml-auto h-80 w-[55%] bg-black/20" />
        )}
        <p className="mt-4 text-sm uppercase tracking-[0.35em] text-[#f3d6a5]/70">
          {profile.role || "Diseño UX UI web"} · {displayName}
        </p>
      </section>

      <section id="sobre-mi" className="mx-auto grid max-w-6xl gap-3 px-4 pb-6 lg:grid-cols-12">
        <div className="border border-[#f3d6a5]/20 p-6 lg:col-span-5">
          <h2 className="font-[family-name:var(--font-cormorant)] text-3xl">¿Quién soy?</h2>
          <p className="mt-3 text-sm leading-7 text-[#f3d6a5]/80">
            {profile.bio || "Habla de tu camino, tu estilo visual y cómo acompañas a cada cliente."}
          </p>
        </div>
        <div className="border border-[#f3d6a5]/20 p-6 lg:col-span-3">
          <h2 className="font-[family-name:var(--font-cormorant)] text-2xl">Etapas</h2>
          <ol className="mt-4 space-y-2 text-sm">
            {STAGE_META.map((stage, index) => (
              <li key={stage.key}>
                0{index + 1} · {stage.label}
              </li>
            ))}
          </ol>
        </div>
        {first ? (
          <div className="border border-[#f3d6a5]/20 p-3 lg:col-span-4">
            <p className="px-2 text-xs uppercase tracking-[0.2em] opacity-70">Destacado</p>
            <PhotoCollection
              images={projectImages(first)}
              photoStyle="glow"
              accent={accent}
              alt={first.title}
              layout="mosaic"
            />
          </div>
        ) : null}
      </section>

      <section id="trabajo" className="mx-auto grid max-w-6xl gap-3 px-4 pb-8 md:grid-cols-2">
        {(first ? [first, ...others] : others).map((project, index) => (
          <article
            key={project.id}
            className={`border border-[#f3d6a5]/20 p-4 ${index === 0 ? "md:col-span-2" : ""}`}
          >
            <h3 className="mb-3 font-[family-name:var(--font-cormorant)] text-3xl">
              {project.title || "Sin título"}
            </h3>
            <PhotoCollection
              images={projectImages(project)}
              photoStyle="glow"
              accent={accent}
              alt={project.title}
              layout={index === 0 ? "magazine" : "mosaic"}
            />
            <Notes project={project} className="mt-3 text-[#f3d6a5]/80" />
          </article>
        ))}
      </section>

      <section id="contacto" className="mx-auto grid max-w-6xl items-center gap-6 px-6 pb-16 lg:grid-cols-2">
        <div>
          <h2 className="font-[family-name:var(--font-cormorant)] text-4xl">Colaboración</h2>
          <p className="mt-3 max-w-md text-sm leading-7">
            ¿Quieres un sitio nuevo o rediseñar el que ya tienes? Escríbeme.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            {socials.map((item) => (
              <a key={item.label} href={item.href} className="underline">
                {item.label}
              </a>
            ))}
          </div>
        </div>
        {profile.photo ? (
          <img
            src={profile.photo}
            alt=""
            className="mx-auto h-40 w-40 rounded-full object-cover"
          />
        ) : null}
      </section>
    </div>
  );
}

export function TealBoard({ portfolio }: { portfolio: Portfolio; shareUrl?: string }) {
  const { profile, appearance, projects } = portfolio;
  const accent = appearance.accent;
  const visible = projects.filter(projectHasContent);
  const displayName = profile.name || "Tu nombre";
  const mosaic = visible.flatMap(projectImages);

  return (
    <div
      className="teal-board min-h-screen px-4 py-8 text-[#e8f3f4]"
      style={{ ...themeVars(accent), background: "#d7d2c8" }}
    >
      <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-6">
        <article className="relative overflow-hidden rounded-md p-6 md:col-span-4" style={{ background: "#174956" }}>
          {profile.photo ? (
            <img
              src={profile.photo}
              alt={displayName}
              className="absolute bottom-0 right-6 h-52 object-contain"
            />
          ) : null}
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">
            {profile.role || "Ilustración y diseño gráfico"}
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-bebas)] text-6xl tracking-[0.14em] sm:text-8xl">
            Portafolio
          </h1>
          <p className="mt-2 font-[family-name:var(--font-cormorant)] text-2xl">{displayName}</p>
        </article>
        <article className="rounded-md p-5 md:col-span-2" style={{ background: "#1f5d6b" }}>
          <h2 className="text-xs uppercase tracking-[0.3em]">Introducción</h2>
          <p className="mt-3 text-sm leading-7 text-white/85">
            {profile.bio || "Presenta tu enfoque como ilustradora o diseñadora gráfica."}
          </p>
        </article>

        <article className="rounded-md p-3 md:col-span-3" style={{ background: "#174956" }}>
          <p className="px-2 pb-2 text-xs uppercase tracking-[0.3em]">Galería</p>
          <PhotoCollection
            images={mosaic.slice(0, 8)}
            photoStyle="editorial"
            accent={accent}
            alt="Galería"
            layout="board"
          />
        </article>

        {visible.map((project, index) => (
          <article
            key={project.id}
            className={`rounded-md p-4 ${index === 0 ? "md:col-span-3" : "md:col-span-2"}`}
            style={{ background: index % 2 ? "#1f5d6b" : "#174956" }}
          >
            <h3 className="mb-3 font-[family-name:var(--font-bebas)] text-3xl tracking-[0.1em]">
              {project.title || "Proyecto"}
            </h3>
            <PhotoCollection
              images={projectImages(project)}
              photoStyle="editorial"
              accent={accent}
              alt={project.title}
              layout="board"
            />
            <Notes project={project} className="mt-3 text-white/80" />
          </article>
        ))}
      </div>
    </div>
  );
}
