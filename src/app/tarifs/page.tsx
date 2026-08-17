import type { Metadata } from "next";
import Link from "next/link";
import { getLang, withLang } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Tarifs",
  description:
    "FlipOn est une app payante : 7 jours d’essai, puis 3,99 € par mois. Vote privé, idées selon le lieu et la météo, un plan commun.",
  alternates: { canonical: "/tarifs" },
  openGraph: {
    title: "Tarifs FlipOn",
    description:
      "Un seul abonnement : 3,99 € / mois après 7 jours d’essai. Tout FlipOn, sans version limitée.",
    url: "/tarifs",
  },
};

const PREMIUM_PRICE = "3,99";

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
  const features = isEn
    ? [
        "Private vote → one shared idea",
        "AI ideas based on your location and moment",
        "Nearby activity count in real time",
        "Weather-aware suggestions to avoid bad picks",
        "Best-fit idea for the whole group (less debate)",
        "Catalog + smart filters as backup",
        "Auto Plan B if no match",
        "Result sharing (copy / WhatsApp)",
        "Duo+ / Group+ sessions without friction",
      ]
    : [
        "Vote privé → une idée commune",
        "Idées IA selon votre lieu et le moment",
        "Nombre d’activités autour en temps réel",
        "Suggestions selon la météo pour éviter les mauvais plans",
        "Idée la plus acceptable pour le groupe (moins de débat)",
        "Catalogue + filtres intelligents en secours",
        "Plan B auto si aucun match",
        "Partage résultat (copie / WhatsApp)",
        "Sessions Duo+ / Groupe+ sans friction",
      ];
  const highlights = isEn
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
      <div className="page-gutter mx-auto max-w-3xl">
        <header className="mx-auto max-w-2xl animate-rise text-center">
          <p className="premium-kicker">
            {isEn ? "Pricing" : "Tarifs"}
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">
            {isEn
              ? "One subscription. The full app."
              : "Un seul abonnement. Toute l’app."}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-ink-soft sm:text-base">
            {isEn ? (
              <>
                No limited free tier. 7 days to try, then {PREMIUM_PRICE} € a
                month — private vote, ideas for <em>here</em> and{" "}
                <em>now</em>.
              </>
            ) : (
              <>
                Pas de version limitée. 7 jours pour essayer, puis{" "}
                {PREMIUM_PRICE} € par mois — vote privé, idées pour{" "}
                <em>ici</em> et <em>maintenant</em>.
              </>
            )}
          </p>
        </header>

        <article className="relative mx-auto mt-8 flex max-w-xl flex-col overflow-hidden rounded-[var(--radius-ui)] border-2 border-coral bg-ink p-5 text-white shadow-sm sm:mt-10 sm:p-8">
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
              FlipOn
            </p>
            <h2 className="mt-1 text-xl font-bold">
              {isEn ? "Monthly" : "Mensuel"}
            </h2>
            <p className="mt-1 text-sm text-white/75">
              {isEn
                ? "Enjoy your best moments with less friction."
                : "Pour passer vos meilleurs moments en toute simplicité."}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full border border-coral/40 bg-coral/10 px-2.5 py-1 text-[11px] font-semibold text-coral">
                {isEn ? "7-day trial" : "Essai 7 jours"}
              </span>
              <span className="rounded-full border border-coral/40 bg-coral/10 px-2.5 py-1 text-[11px] font-semibold text-coral">
                {isEn ? "Less debate" : "Moins de débat"}
              </span>
              <span className="rounded-full border border-coral/40 bg-coral/10 px-2.5 py-1 text-[11px] font-semibold text-coral">
                {isEn ? "Real-time nearby" : "Autour en temps réel"}
              </span>
              <span className="rounded-full border border-coral/40 bg-coral/10 px-2.5 py-1 text-[11px] font-semibold text-coral">
                {isEn ? "Weather-smart" : "Météo intelligente"}
              </span>
            </div>

            <p className="mt-5 flex items-baseline gap-1.5">
              <span className="font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight">
                {PREMIUM_PRICE} €
              </span>
              <span className="text-sm text-white/60">
                {isEn ? "/ month" : "/ mois"}
              </span>
            </p>
            <p className="mt-1 text-sm text-white/60">
              {isEn
                ? "Then billed monthly. Cancel anytime in the app."
                : "Puis facturé chaque mois. Annulable à tout moment dans l’app."}
            </p>

            <ul className="mt-4 space-y-1.5 text-sm font-semibold text-white">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-coral" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <ul className="mt-5 space-y-2.5 text-sm text-white/90">
              {features.map((f) => (
                <li key={f} className="flex gap-2.5">
                  <Check onDark />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-7">
              <Link
                href={withLang("/commencer", lang)}
                prefetch
                className="inline-flex min-h-12 w-full items-center justify-center rounded-[var(--radius-ui)] bg-coral px-6 text-[15px] font-bold text-white hover:bg-coral-deep"
              >
                {isEn ? "Start 7-day trial" : "Commencer l’essai 7 jours"}
              </Link>
              <Link
                href={withLang("/download", lang)}
                prefetch
                className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-[var(--radius-ui)] border border-white/20 px-6 text-[14px] font-semibold text-white/90 hover:border-white/40"
              >
                {isEn ? "Get the app" : "Télécharger l’app"}
              </Link>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
