import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { AnimatedHeading } from "@/components/AnimatedHeading";
import { LandingHero } from "@/components/LandingHero";
import { AppPhoneShowcase } from "@/components/marketing/AppPhoneShowcase";
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
    "Cadre, vote privé, une idée : FlipOn aide un groupe à trancher une activité, en journée ou le soir.",
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
        { t: "1. Join", d: "Enter a code and jump into a session." },
        { t: "2. Start", d: "Private vote, one shared plan." },
        { t: "3. Nearby", d: "Premium context around you." },
      ]
    : [
        { t: "1. Rejoindre", d: "Entre un code et rejoins une session." },
        { t: "2. Lancer", d: "Vote privé, un plan commun." },
        { t: "3. Autour", d: "Contexte Premium près de toi." },
      ];

  return (
    <main>
      <LandingHero lang={lang} />

      <section className="content-auto page-gutter py-10 sm:py-14">
        <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-3 lg:gap-5">
          <article className="premium-card lg:col-span-2 p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-coral">
              {isEn ? "Objective" : "Objectif"}
            </p>
            <h2 className="mt-2 text-xl font-bold tracking-tight text-ink sm:text-2xl">
              {isEn
                ? "Help a group decide what to do together."
                : "Aider un groupe à trancher quoi faire ensemble."}
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-soft sm:text-base">
              {isEn
                ? "Brunch, walk, terrace, or later out: one shared plan after a private vote."
                : "Brunch, balade, terrasse ou sortie plus tard : un plan commun après un vote privé."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                isEn ? "Day or evening" : "Journée ou soirée",
                isEn ? "Private vote" : "Vote privé",
                isEn ? "One shared plan" : "Un plan commun",
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

          <aside className="premium-card flex flex-col p-5 sm:p-6">
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
                href={withLang("/join", lang)}
                prefetch
                className="btn-secondary w-full"
              >
                {isEn ? "Join with a code" : "Rejoindre avec un code"}
              </Link>
              <Link
                href={withLang("/tarifs", lang)}
                prefetch
                className="w-full text-center text-sm font-medium text-ink-soft hover:text-ink"
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
              <article
                key={item.t}
                className="premium-card p-4 sm:p-5"
              >
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full border border-coral/25 bg-coral/10 px-2 text-xs font-bold text-coral">
                    {item.t.split(".")[0]}
                  </span>
                  <h3 className="text-base font-bold text-ink">
                    {item.t.replace(/^\d+\.\s*/, "")}
                  </h3>
                </div>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">
                  {item.d}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-auto page-gutter py-12 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-coral">
              {isEn ? "In the app" : "Dans l’app"}
            </p>
            <h2 className="mt-2 text-xl font-bold tracking-tight text-ink sm:text-3xl">
              {isEn
                ? "See exactly what you get before you start."
                : "Vois concrètement ce que tu obtiens avant de commencer."}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft sm:text-base">
              {isEn
                ? "Join a session, start a private vote, or explore what’s nearby."
                : "Rejoins une session, lance un vote privé, ou explore ce qu’il y a autour."}
            </p>
          </div>
          <AppPhoneShowcase lang={lang} variant="section" className="mt-10" />
        </div>
      </section>

      <section className="content-auto page-gutter py-10 sm:py-14">
        <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-2 lg:gap-5">
          <article className="premium-card p-5 sm:p-6">
            <div
              className="pointer-events-none absolute right-0 top-0 h-20 w-20 rounded-full bg-coral/10 blur-2xl"
              aria-hidden
            />
            <p className="text-xs font-semibold uppercase tracking-wide text-coral">
              {isEn ? "Use cases" : "Pour qui"}
            </p>
            <h3 className="mt-2 text-lg font-bold tracking-tight text-ink sm:text-xl">
              {isEn ? "One product, multiple social contexts." : "Un produit, plusieurs contextes sociaux."}
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-soft sm:text-base">
              {isEn
                ? "Friends, couples, roommates, weekend groups: one refined flow to turn shared intent into a plan."
                : "Potes, couples, colocs, sorties du week-end : une même expérience, pensée pour transformer une envie commune en vrai plan."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                isEn ? "Friends" : "Potes",
                isEn ? "Couples" : "Couples",
                isEn ? "Roommates" : "Colocs",
                isEn ? "Weekend plans" : "Sorties week-end",
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
          <article className="premium-card p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-coral">
              {isEn ? "What you get" : "Ce que tu obtiens"}
            </p>
            <ul className="mt-3 space-y-2.5 text-sm text-ink-soft">
              <li className="flex items-start gap-2.5">
                <span className="mt-[0.38rem] h-1.5 w-1.5 shrink-0 rounded-full bg-coral" />
                <span>
                {isEn
                  ? "Setup in under 30 seconds."
                  : "Un cadre défini en moins de 30 secondes."}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-[0.38rem] h-1.5 w-1.5 shrink-0 rounded-full bg-coral" />
                <span>
                {isEn
                  ? "Private vote without social pressure."
                  : "Un vote privé sans pression sociale."}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-[0.38rem] h-1.5 w-1.5 shrink-0 rounded-full bg-coral" />
                <span>
                {isEn
                  ? "One clear group result."
                  : "Un résultat de groupe clair."}
                </span>
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
        <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-bold text-ink">
            Flip<span className="text-coral">On</span>
          </p>
          <nav className="flex flex-wrap gap-x-4 gap-y-1" aria-label="Légal">
            <a className="hover:text-ink" href="/legal/confidentialite">
              {isEn ? "Privacy" : "Confidentialité"}
            </a>
            <a className="hover:text-ink" href="/legal/cgu">
              {isEn ? "Terms" : "CGU"}
            </a>
            <a className="hover:text-ink" href="/legal/mentions">
              {isEn ? "Legal notice" : "Mentions"}
            </a>
          </nav>
          <p>{isEn ? "France · 2026" : "France · 2026"}</p>
        </div>
      </footer>
    </main>
  );
}
