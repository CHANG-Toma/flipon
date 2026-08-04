import type { Metadata } from "next";
import { Suspense } from "react";
import { FlipDemo } from "@/components/FlipDemo";
import { getLang } from "@/lib/i18n";

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

export default async function TestPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const lang = getLang(await searchParams);
  const isEn = lang === "en";
  return (
    <main className="safe-bottom bg-[radial-gradient(ellipse_120%_60%_at_50%_-10%,color-mix(in_srgb,var(--coral)_7%,white),transparent_60%)] pb-10 pt-5 sm:pb-20 sm:pt-8">
      <div className="page-gutter mx-auto max-w-5xl">
        <header className="mx-auto mb-6 max-w-md animate-rise text-left sm:mb-8">
          <p className="mb-3 rounded-[var(--radius-ui)] border border-line bg-white px-3.5 py-2.5 text-center text-xs leading-relaxed text-ink-soft shadow-sm">
            <span className="font-semibold text-ink">Démo web</span>
            {" — "}
            {isEn
              ? "test the real FlipOn flow. The mobile app comes next."
              : "teste le vrai flux FlipOn. L’app mobile arrivera ensuite."}
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {isEn ? "Try FlipOn" : "Essayer FlipOn"}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            {isEn
              ? "Solo to discover, or duo on two phones. Setup -> private vote -> one idea. No account."
              : "Solo pour découvrir, ou duo sur deux téléphones. Cadre → vote privé → une idée. Sans compte."}
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
          <FlipDemo lang={lang} />
        </Suspense>
      </div>
    </main>
  );
}
