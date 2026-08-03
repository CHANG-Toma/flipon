import type { Metadata } from "next";
import { Suspense } from "react";
import { FlipDemo } from "@/components/FlipDemo";

export const metadata: Metadata = {
  title: "Essayer",
  description:
    "Teste FlipOn en solo ou à deux téléphones : cadre (ambiance, temps, budget), vote privé, une idée commune.",
  alternates: { canonical: "/test" },
  openGraph: {
    title: "Essayer FlipOn",
    description:
      "Cadre → vote privé → une idée. Solo ou duo sur deux téléphones.",
    url: "/test",
  },
};

export default function TestPage() {
  return (
    <main className="safe-bottom min-h-[100dvh] pb-10 pt-5 sm:pb-20 sm:pt-8">
      <div className="page-gutter mx-auto max-w-5xl">
        <header className="mx-auto mb-6 max-w-md animate-rise text-left sm:mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Essayer FlipOn
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Solo pour tester, ou avec un ami sur deux téléphones. Choisis
            l’ambiance, fixe le cadre, vote en privé — une idée en ressort.
          </p>
        </header>

        <Suspense
          fallback={
            <div
              className="mx-auto h-40 w-full max-w-md animate-pulse rounded-[var(--radius-ui)] bg-foam"
              aria-label="Chargement"
            />
          }
        >
          <FlipDemo />
        </Suspense>
      </div>
    </main>
  );
}
