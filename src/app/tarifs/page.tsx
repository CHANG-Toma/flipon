import type { Metadata } from "next";
import Link from "next/link";
import { getLang, withLang } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Tarifs",
  description:
    "Basique : catalogue FlipOn + vote. Boost 3,99 € : pour passer vos meilleurs moments en toute simplicité.",
  alternates: { canonical: "/tarifs" },
  openGraph: {
    title: "Tarifs FlipOn",
    description:
      "Basique 0 € (catalogue) · Boost 3,99 € pour passer vos meilleurs moments en toute simplicité.",
    url: "/tarifs",
  },
};

const BOOST_PRICE = "3,99";

function Check({ onDark }: { onDark?: boolean }) {
  return (
    <span
      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
        onDark ? "bg-coral text-white" : "bg-coral/15 text-coral"
      }`}
      aria-hidden
    >
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path
          d="M2 5.2L4.1 7.3L8 2.8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default async function TarifsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const lang = getLang(await searchParams);
  const isEn = lang === "en";
  const boostFeatures = isEn
    ? [
        "Everything in Basic",
        "AI-generated ideas for your group",
        "Nearby activity count around you",
        "Location / neighborhood context",
        "Weather + time of day",
      ]
    : [
        "Tout Basique inclus",
        "Idées générées par IA pour ton groupe",
        "Nombre d’activités trouvées autour de vous",
        "Lieu / quartier pris en compte",
        "Météo + moment de la journée",
      ];
  const freeFeatures = isEn
    ? [
        "Private vote -> one shared idea",
        "Filters + catalog activity counter",
        "FlipOn catalog ideas (no AI)",
      ]
    : [
        "Vote privé → une idée commune",
        "Filtres + compteur du catalogue",
        "Idées FlipOn (pas d’IA)",
      ];

  return (
    <main className="safe-bottom overflow-x-hidden pb-14 pt-6 sm:pb-20 sm:pt-10">
      <div className="page-gutter mx-auto max-w-5xl">
        <header className="mx-auto max-w-2xl animate-rise text-center">
          <p className="text-sm font-semibold text-coral">
            {isEn ? "Pricing" : "Tarifs"}
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">
            {isEn
              ? "Boost for your best moments."
              : "Boost pour vos meilleurs moments."}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-ink-soft sm:text-base">
            {isEn ? (
              <>
                Same voting flow. Ideas generated for <em>here</em> and{" "}
                <em>now</em> — not just a catalog.
              </>
            ) : (
              <>
                Même vote. Des idées inventées pour <em>ici</em> et{" "}
                <em>maintenant</em> — pas seulement le catalogue.
              </>
            )}
          </p>
        </header>

        <section className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5">
          <article className="rounded-[var(--radius-ui)] border border-line bg-white p-5 shadow-sm sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
              {isEn ? "Free" : "Gratuit"}
            </p>
            <h2 className="mt-1 text-xl font-bold text-ink">
              {isEn ? "Basic" : "Basique"}
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              {isEn
                ? "Well-filtered FlipOn catalog. Enough to decide tonight."
                : "Catalogue FlipOn, bien filtré. Assez pour trancher ce soir."}
            </p>

            <p className="mt-5 flex items-baseline gap-1.5">
              <span className="font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight text-ink">
                0 €
              </span>
              <span className="text-sm text-ink-soft">
                {isEn ? "/ month" : "/ mois"}
              </span>
            </p>

            <ul className="mt-5 space-y-2.5 text-sm text-ink">
              {freeFeatures.map((f) => (
                <li key={f} className="flex gap-2.5">
                  <Check />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href={withLang("/download", lang)}
              prefetch
              className="btn-secondary mt-7 w-full"
            >
              {isEn ? "Download app" : "Télécharger l’app"}
            </Link>
          </article>

          <article className="relative overflow-hidden rounded-[var(--radius-ui)] border-2 border-coral bg-ink p-5 text-white shadow-sm sm:p-6">
            <div
              className="pointer-events-none absolute inset-0 opacity-80"
              aria-hidden
              style={{
                background:
                  "radial-gradient(ellipse 80% 60% at 90% -5%, color-mix(in srgb, var(--coral) 45%, transparent), transparent 55%)",
              }}
            />
            <div className="relative z-10">
              <p className="text-xs font-semibold uppercase tracking-wide text-coral">
                {isEn ? "Recommended" : "Recommandé"}
              </p>
              <h2 className="mt-1 text-xl font-bold">Boost</h2>
              <p className="mt-1 text-sm text-white/75">
                {isEn
                  ? "Enjoy your best moments with less friction."
                  : "Pour passer vos meilleurs moments en toute simplicité."}
              </p>

              <p className="mt-5 flex items-baseline gap-1.5">
                <span className="font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight">
                  {BOOST_PRICE} €
                </span>
                <span className="text-sm text-white/60">
                  {isEn ? "/ month" : "/ mois"}
                </span>
              </p>

              <ul className="mt-5 space-y-2.5 text-sm text-white/90">
                {boostFeatures.map((f) => (
                  <li key={f} className="flex gap-2.5">
                    <Check onDark />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={withLang("/download", lang)}
                prefetch
                className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-[var(--radius-ui)] bg-coral px-6 text-[15px] font-bold text-white hover:bg-coral-deep"
              >
                {isEn ? "Download Boost" : "Télécharger Boost"}
              </Link>
              <p className="mt-2 text-center text-xs text-white/50">
                {isEn
                  ? "Boost ships with the mobile app."
                  : "Boost arrive avec l’app."}
              </p>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
