import Link from "next/link";
import { THEME_OPTIONS } from "@/lib/portfolio";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0b0814] text-white">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-xs uppercase tracking-[0.35em] text-violet-300">
          Atelier
        </p>
        <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-syne)] text-5xl leading-tight sm:text-6xl">
          Un editor para que tu portafolio de diseño compita de verdad.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
          Sube tu foto y tu nombre, elige un look, arma cada proyecto con
          bocetos, proceso y resultado —solo lo que tengas— y publica un enlace
          de solo lectura. Las fotos se ven en galería; un clic las amplía.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/editor"
            className="rounded-full bg-violet-500 px-6 py-3 text-sm font-medium"
          >
            Crear mi portafolio
          </Link>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2">
          {THEME_OPTIONS.map((theme, index) => (
            <article
              key={theme.id}
              className="overflow-hidden rounded-[2rem] border border-white/10"
            >
              <div className={`h-20 ${theme.swatch}`} />
              <div className="bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-violet-200">
                  Tema {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-2 text-2xl">{theme.name}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {theme.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
