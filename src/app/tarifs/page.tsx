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
        "AI ideas based on your location and moment",
        "Nearby activity count in real time",
        "Weather-aware suggestions to avoid bad picks",
        "Best-fit idea for the whole group (less debate)",
        "Faster decision in a few taps",
        "Duo+ / Group+ sessions without friction",
      ]
    : [
        "Idées IA selon votre lieu et le moment",
        "Nombre d’activités autour en temps réel",
        "Suggestions selon la météo pour éviter les mauvais plans",
        "Idée la plus acceptable pour le groupe (moins de débat)",
        "Décision plus rapide en quelques taps",
        "Sessions Duo+ / Groupe+ sans friction",
      ];
  const freeFeatures = isEn
    ? [
        "Private vote -> one shared idea",
        "Catalog + smart filters",
        "Quick setup templates",
        "Auto Plan B if no match",
        "Result sharing (copy / WhatsApp)",
      ]
    : [
        "Vote privé → une idée commune",
        "Catalogue + filtres intelligents",
        "Templates de cadres rapides",
        "Plan B auto si aucun match",
        "Partage résultat (copie / WhatsApp)",
      ];
  const boostHighlights = isEn
    ? [
        "Where you want, when you want",
        "Real context = better choices",
        "Shared result, without friction",
      ]
    : [
        "Où tu veux, quand tu veux",
        "Contexte réel = meilleurs choix",
        "Résultat commun, sans friction",
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
                <em>now</em>, not just a catalog.
              </>
            ) : (
              <>
                Même vote. Des idées inventées pour <em>ici</em> et{" "}
                <em>maintenant</em>, pas seulement le catalogue.
              </>
            )}
          </p>
        </header>

        <section className="mt-8 grid items-stretch gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5">
          <article className="flex h-full flex-col rounded-[var(--radius-ui)] border border-line bg-white p-5 shadow-sm sm:p-6">
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
              className="btn-secondary mt-auto w-full"
            >
              {isEn ? "Download app" : "Télécharger l’app"}
            </Link>
          </article>

          <article className="relative flex h-full flex-col overflow-hidden rounded-[var(--radius-ui)] border-2 border-coral bg-ink p-5 text-white shadow-sm sm:p-6">
            <div
              className="pointer-events-none absolute inset-0 opacity-80"
              aria-hidden
              style={{
                background:
                  "radial-gradient(ellipse 80% 60% at 90% -5%, color-mix(in srgb, var(--coral) 45%, transparent), transparent 55%)",
              }}
            />
            <div className="relative z-10 flex h-full flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-coral">
                {isEn ? "Recommended" : "Recommandé"}
              </p>
              <h2 className="mt-1 text-xl font-bold">Boost</h2>
              <p className="mt-1 text-sm text-white/75">
                {isEn
                  ? "Enjoy your best moments with less friction."
                  : "Pour passer vos meilleurs moments en toute simplicité."}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-coral/40 bg-coral/10 px-2.5 py-1 text-[11px] font-semibold text-coral">
                  {isEn ? "Less debate" : "Moins de débat"}
                </span>
                <span className="rounded-full border border-coral/40 bg-coral/10 px-2.5 py-1 text-[11px] font-semibold text-coral">
                  {isEn ? "Real-time nearby" : "Autour en temps réel"}
                </span>
                <span className="rounded-full border border-coral/40 bg-coral/10 px-2.5 py-1 text-[11px] font-semibold text-coral">
                  {isEn ? "Weather-smart" : "Météo intelligente"}
                </span>
                <span className="rounded-full border border-coral/40 bg-coral/10 px-2.5 py-1 text-[11px] font-semibold text-coral">
                  {isEn ? "Time saver" : "Gain de temps"}
                </span>
              </div>

              <p className="mt-5 flex items-baseline gap-1.5">
                <span className="font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight">
                  {BOOST_PRICE} €
                </span>
                <span className="text-sm text-white/60">
                  {isEn ? "/ month" : "/ mois"}
                </span>
              </p>

              <ul className="mt-3 space-y-1.5 text-sm font-semibold text-white">
                {boostHighlights.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="inline-flex h-1.5 w-1.5 rounded-full bg-coral" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <ul className="mt-5 space-y-2.5 text-sm text-white/90">
                {boostFeatures.map((f) => (
                  <li key={f} className="flex gap-2.5">
                    <Check onDark />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-7">
                <Link
                  href={withLang("/download", lang)}
                  prefetch
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-[var(--radius-ui)] bg-coral px-6 text-[15px] font-bold text-white hover:bg-coral-deep"
                >
                  {isEn ? "Download Boost" : "Télécharger Boost"}
                </Link>
              </div>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
