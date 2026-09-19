"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { readPublishedCache } from "@/lib/draft";
import type { Portfolio } from "@/lib/types";
import { PortfolioView } from "@/components/themes/PortfolioView";

export default function PublicPortfolioPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [missing, setMissing] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    let cancelled = false;
    const cached = readPublishedCache(id);
    if (cached) setPortfolio(cached);
    setShareUrl(`${window.location.origin}/p/${id}`);

    async function load() {
      try {
        const res = await fetch(`/api/portfolios/${id}`, { cache: "no-store" });
        if (!res.ok) {
          if (!cached) setMissing(true);
          return;
        }
        const data = (await res.json()) as Portfolio;
        if (!cancelled) {
          setPortfolio(data);
          setMissing(false);
        }
      } catch {
        if (!cached) setMissing(true);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (missing && !portfolio) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#0b0814] px-6 text-center text-zinc-300">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-violet-300">
            Atelier
          </p>
          <h1 className="mt-3 text-3xl">Este portafolio no existe</h1>
          <p className="mt-2 text-zinc-500">
            El enlace puede haber caducado o aún no se ha publicado.
          </p>
        </div>
      </main>
    );
  }

  if (!portfolio) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#0b0814] text-zinc-400">
        Cargando portafolio…
      </main>
    );
  }

  return <PortfolioView portfolio={portfolio} shareUrl={shareUrl} />;
}
