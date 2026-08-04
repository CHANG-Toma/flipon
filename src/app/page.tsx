import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { AnimatedHeading } from "@/components/AnimatedHeading";
import { LandingHero } from "@/components/LandingHero";
import { getLang, withLang } from "@/lib/i18n";

const WaitlistForm = dynamic(
  () =>
    import("@/components/WaitlistForm").then((m) => m.WaitlistForm),
  {
    loading: () => (
      <div className="h-12 w-full max-w-md animate-pulse rounded-[var(--radius-ui)] bg-line/60" />
    ),
  },
);

export const metadata: Metadata = {
  title: "FlipOn : Une activité validée par tout le groupe",
  description:
    "Cadre, vote privé, une idée : FlipOn sort l’activité où tout le monde a dit oui. Potes, couple, colloc.",
  alternates: { canonical: "/" },
};

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const lang = getLang(await searchParams);
  const isEn = lang === "en";
  const steps = isEn
    ? [
        { t: "1. Setup", d: "Tonight: time, budget, and vibe." },
        { t: "2. Vote", d: "Yes or pass: private choices." },
        { t: "3. Go", d: "One idea + next steps." },
      ]
    : [
        { t: "1. Cadre", d: "Ce soir : temps, budget, ambiance." },
        { t: "2. Vote", d: "Oui ou passer: l’autre ne voit pas." },
        { t: "3. Go", d: "Une idée + les prochaines étapes." },
      ];

  return (
    <main>
      <LandingHero lang={lang} />

      <section className="content-auto page-gutter py-10 sm:py-14">
        <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-3 lg:gap-5">
          <article className="surface bg-white p-5 shadow-sm lg:col-span-2 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-coral">
              {isEn ? "Objective" : "Objectif"}
            </p>
            <h2 className="mt-2 text-xl font-bold tracking-tight text-ink sm:text-2xl">
              {isEn
                ? "Help a group choose one activity fast."
                : "Aider un groupe à choisir une activité rapidement."}
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-soft sm:text-base">
              {isEn
                ? "When nobody wants to decide, FlipOn gives one clear direction everyone can accept."
                : "Quand personne ne veut trancher, FlipOn donne une direction claire que tout le monde peut accepter."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                isEn ? "30s setup" : "Cadre en 30s",
                isEn ? "Private vote" : "Vote privé",
                isEn ? "No account" : "Sans compte",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-line bg-petal px-2.5 py-1 text-[11px] font-semibold text-ink-soft"
                >
                  {item}
                </span>
              ))}
            </div>
          </article>

          <aside className="surface flex flex-col bg-white p-5 shadow-sm sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
              {isEn ? "Try now" : "Passer à l’action"}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              {isEn
                ? "See the full flow in under 2 minutes."
                : "Vois le flux complet en moins de 2 minutes."}
            </p>
            <div className="mt-4 flex flex-col gap-2.5">
              <Link
                href={withLang("/test", lang)}
                prefetch
                className="btn-primary w-full"
              >
                {isEn ? "Start demo" : "Lancer la démo"}
              </Link>
              <Link
                href={withLang("/tarifs", lang)}
                prefetch
                className="btn-secondary w-full"
              >
                {isEn ? "Compare plans" : "Comparer les offres"}
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="content-auto border-y border-line bg-petal page-gutter py-12 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-xl">
            <AnimatedHeading
              text={
                isEn
                  ? "Less debate. More real plans."
                  : "Moins de débat. Plus de vrais plans."
              }
              className="text-xl font-bold tracking-tight text-ink sm:text-3xl"
            />
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft sm:text-base">
              {isEn
                ? "Everyone answers privately, then FlipOn outputs one shared plan."
                : "Chacun répond en privé, puis FlipOn sort un plan commun."}
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3 sm:gap-4">
            {steps.map((item) => (
              <article key={item.t} className="surface bg-white p-4 shadow-sm sm:p-5">
                <h3 className="font-bold text-ink">{item.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {item.d}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-auto page-gutter py-10 sm:py-14">
        <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-2 lg:gap-5">
          <article className="surface bg-white p-5 shadow-sm sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-coral">
              {isEn ? "Use cases" : "Pour qui"}
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-soft sm:text-base">
              {isEn
                ? "Friends, couples, roommates, group nights: same product. “Date” only changes suggestion style."
                : "Potes, couple, colloc, soirées de groupe : même produit. « Date » change seulement le style des idées."}
            </p>
          </article>
          <article className="surface bg-white p-5 shadow-sm sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-coral">
              {isEn ? "What you get" : "Ce que tu obtiens"}
            </p>
            <ul className="mt-2 space-y-2 text-sm text-ink-soft">
              <li>
                {isEn
                  ? "Setup in under 30 seconds."
                  : "Un cadre défini en moins de 30 secondes."}
              </li>
              <li>
                {isEn
                  ? "Private vote without social pressure."
                  : "Un vote privé sans pression sociale."}
              </li>
              <li>
                {isEn
                  ? "One clear group result."
                  : "Un résultat de groupe clair."}
              </li>
            </ul>
          </article>
        </div>
      </section>

      <section
        id="waitlist"
        className="content-auto scroll-mt-20 page-gutter py-12 sm:py-20"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-sm">
            <AnimatedHeading
              text={isEn ? "We are still building." : "On construit encore."}
              className="text-xl font-bold text-ink sm:text-2xl"
            />
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              {isEn
                ? "Leave your email for launch updates, or send quick feedback after the demo."
                : "Laisse ton e-mail pour le lancement, ou envoie un retour rapide après la démo."}
            </p>
          </div>
          <WaitlistForm lang={lang} />
        </div>
      </section>

      <footer className="safe-bottom border-t border-line page-gutter py-5 text-sm text-ink-soft">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <p className="font-bold text-ink">
            Flip<span className="text-coral">On</span>
          </p>
          <p>{isEn ? "France · 2026" : "France · 2026"}</p>
        </div>
      </footer>
    </main>
  );
}
