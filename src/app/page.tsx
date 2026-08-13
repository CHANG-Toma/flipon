import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { LandingHero } from "@/components/LandingHero";
import { AppPhoneShowcase } from "@/components/marketing/AppPhoneShowcase";
import { LandingStats } from "@/components/marketing/LandingStats";
import { LazyAurora } from "@/components/marketing/LazyAurora";
import { AnimatedHeading } from "@/components/AnimatedHeading";
import SpotlightCard from "@/components/react-bits/SpotlightCard";
import { getLandingCopy } from "@/lib/landing-copy";
import { getLang, withLang } from "@/lib/i18n";

const WaitlistForm = dynamic(
  () =>
    import("@/components/WaitlistForm").then((m) => m.WaitlistForm),
  {
    loading: () => (
      <div className="h-12 w-full max-w-md animate-pulse rounded-full bg-line/60" />
    ),
  },
);

export const metadata: Metadata = {
  title: "FlipOn : une activité que tout le groupe veut faire",
  description:
    "Fini le « on fait quoi ? ». FlipOn aide amis, couples et colocs à trancher une activité : cadre en 30 secondes, vote privé, un plan commun.",
  keywords: [
    "idée activité entre amis",
    "on fait quoi ce soir",
    "vote privé groupe",
    "application sortie",
    "choisir une activité",
    "plan entre potes",
    "FlipOn",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "FlipOn : une activité que tout le groupe veut faire",
    description:
      "Cadre, vote privé, une idée : FlipOn coupe le débat et verrouille un plan commun. Jour ou soir.",
    url: "/",
    images: [
      {
        url: "/marketing/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "iPhone affichant FlipOn : nouvelle session, vote privé, plan commun",
      },
    ],
  },
};

function Check() {
  return (
    <span
      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-coral/15 text-coral"
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

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const lang = getLang(await searchParams);
  const isEn = lang === "en";
  const copy = getLandingCopy(lang);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HowTo",
        name: isEn
          ? "Pick a group activity with FlipOn"
          : "Trancher une activité de groupe avec FlipOn",
        description: isEn
          ? "Set a frame, vote in private, get one shared plan."
          : "Posez un cadre, votez en privé, obtenez un plan commun.",
        totalTime: "PT2M",
        step: copy.steps.map((step, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: step.title,
          text: step.body,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: copy.faqs.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };

  return (
    <main data-nav-overlay>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingHero lang={lang} />

      <section className="bg-[#0a0a0a] page-gutter">
        <LandingStats stats={copy.stats} />
      </section>

      <section className="content-auto page-gutter py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="landing-kicker">
              {isEn ? "A real advantage" : "Un vrai atout"}
            </p>
            <h2 className="landing-h2 mt-4">
              {isEn
                ? "The private vote is how a group actually decides."
                : "Le vote privé, c’est comme ça qu’un groupe tranche vraiment."}
            </h2>
            <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-ink-soft">
              {isEn
                ? "The quality of the plan is not the longest thread. It is the activity everyone is ready to do now — without performing, without giving in."
                : "La qualité d’un plan, ce n’est pas le plus long fil. C’est l’activité que tout le monde est prêt à faire maintenant — sans jouer un rôle, sans céder."}
            </p>
            <p className="mt-4 max-w-lg text-[17px] leading-relaxed text-ink-soft">
              {isEn
                ? "Use FlipOn to set a frame in 30 seconds, vote on your own phone, and leave with one shared idea."
                : "Utilise FlipOn pour poser un cadre en 30 secondes, voter chacun de son côté, et partir avec une seule idée commune."}
            </p>
            <Link
              href={withLang("/commencer", lang)}
              prefetch
              className="btn-primary mt-8 rounded-full px-8"
            >
              {isEn ? "Start" : "Commencer"}
            </Link>
          </div>
          <ul className="space-y-5">
            {copy.pains.map((item) => (
              <li key={item.title} className="border-t border-line pt-5 first:border-t-0 first:pt-0">
                <h3 className="text-lg font-bold text-ink">{item.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="content-auto bg-petal page-gutter py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="landing-kicker">
              {isEn ? "See your result" : "Vois le résultat"}
            </p>
            <h2 className="landing-h2 mt-4">
              {isEn
                ? "Is “what should we do?” eating your evening?"
                : "Le « on fait quoi ? » mange-t-il encore vos soirées ?"}
            </h2>
            <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-ink-soft">
              {isEn
                ? "Try the flow. In a few minutes you get a frame, a private vote, and one plan the group can keep."
                : "Teste le flux. En quelques minutes tu obtiens un cadre, un vote privé, et un plan que le groupe peut tenir."}
            </p>
            <ul className="mt-8 space-y-3">
              {copy.checks.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] text-ink">
                  <Check />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href={withLang("/test", lang)}
              prefetch
              className="btn-primary mt-8 rounded-full px-8"
            >
              {isEn ? "Try it" : "Essayer"}
            </Link>
          </div>
          <AppPhoneShowcase lang={lang} variant="hero" className="lg:justify-end" />
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#0a0a0a] page-gutter py-16 text-center sm:py-24">
        <LazyAurora />
        <p className="relative z-10 mx-auto max-w-3xl font-[family-name:var(--font-display)] text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
          {copy.pullQuote.lineA}
          <br />
          <span className="landing-gradient-text">{copy.pullQuote.lineB}</span>
        </p>
      </section>

      <section className="content-auto page-gutter py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="landing-kicker">
            {isEn ? "What you can expect" : "Ce que tu peux attendre"}
          </p>
          <AnimatedHeading
            text={
              isEn
                ? "From the first vote to a real night out."
                : "Du premier vote à une vraie sortie."
            }
            className="landing-h2 mt-4 max-w-2xl"
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {copy.outcomes.map((item) => (
              <SpotlightCard
                key={item.kicker}
                className="rounded-[var(--radius-ui)] border border-line bg-white p-5"
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-coral">
                  {item.kicker}
                </p>
                <h3 className="mt-3 text-xl font-bold text-ink">{item.title}</h3>
                <ul className="mt-4 space-y-2 text-sm leading-relaxed text-ink-soft">
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </SpotlightCard>
            ))}
          </div>
          <Link
            href={withLang("/commencer", lang)}
            prefetch
            className="btn-primary mt-12 rounded-full px-8"
          >
            {isEn ? "Start" : "Commencer"}
          </Link>
        </div>
      </section>

      <section className="content-auto bg-petal page-gutter py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="landing-kicker">
              {isEn ? "In the app" : "Dans l’app"}
            </p>
            <h2 className="landing-h2 mt-4">
              {isEn
                ? "The right idea, at the right time."
                : "La bonne idée, au bon moment."}
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-ink-soft">
              {isEn
                ? "Join with a code, start a private-vote session, or explore what’s around you."
                : "Rejoins avec un code, lance une session à vote privé, ou explore ce qu’il y a autour."}
            </p>
          </div>
          <AppPhoneShowcase lang={lang} variant="section" className="mt-14" />
        </div>
      </section>

      <section
        id="comment-ca-marche"
        className="content-auto scroll-mt-20 page-gutter py-16 sm:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <p className="landing-kicker">
            {isEn ? "How it works" : "Comment ça marche"}
          </p>
          <AnimatedHeading
            text={
              isEn
                ? "You’re three steps from a real plan."
                : "Vous n’êtes qu’à 3 étapes d’un vrai plan."
            }
            className="landing-h2 mt-4 max-w-2xl"
          />
          <ol className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-12">
            {copy.steps.map((item, index) => (
              <li key={item.title}>
                <p className="font-[family-name:var(--font-display)] text-5xl font-extrabold text-coral/25">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 text-xl font-bold text-ink">{item.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                  {item.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="content-auto border-y border-line page-gutter py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="landing-kicker">{copy.premium.kicker}</p>
            <h2 className="landing-h2 mt-4">{copy.premium.title}</h2>
            <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-ink-soft">
              {copy.premium.body}
            </p>
            <Link
              href={withLang("/commencer", lang)}
              prefetch
              className="btn-primary mt-8 rounded-full px-8"
            >
              {copy.premium.cta}
            </Link>
          </div>
          <ul className="space-y-3">
            {copy.premium.points.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[15px] text-ink">
                <Check />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="content-auto bg-petal page-gutter py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="landing-kicker">
            {isEn ? "Your context" : "Ton contexte"}
          </p>
          <h2 className="landing-h2 mt-4 max-w-2xl">
            {isEn
              ? "One flow, adapted to how you go out."
              : "Un même flux, adapté à ta façon de sortir."}
          </h2>
          <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {copy.audiences.map((item) => (
              <article key={item.title}>
                <h3 className="text-xl font-bold text-ink">{item.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0a0a0a] page-gutter py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#ff4d00]">
            {isEn ? "Unlock the evening" : "Libérez la soirée"}
          </p>
          <h2 className="mt-4 max-w-2xl font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            {isEn
              ? "Your starting point toward a shared plan."
              : "Votre point de départ vers un plan commun."}
          </h2>
          <ol className="mt-12 grid gap-8 sm:grid-cols-3">
            {copy.startSteps.map((item, index) => (
              <li key={item.title}>
                <p className="text-sm font-bold text-[#ff4d00]">
                  {index + 1}. {item.title}
                </p>
                <p className="mt-2 text-[15px] leading-relaxed text-white/65">
                  {item.body}
                </p>
              </li>
            ))}
          </ol>
          <Link
            href={withLang("/commencer", lang)}
            prefetch
            className="mt-12 inline-flex min-h-12 items-center justify-center rounded-full bg-[#ff4d00] px-8 text-base font-bold text-white hover:bg-[#e04400]"
          >
            {isEn ? "Try FlipOn" : "Essayer FlipOn"}
          </Link>
        </div>
      </section>

      <section
        id="faq"
        className="content-auto scroll-mt-20 page-gutter py-16 sm:py-24"
      >
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-20">
          <div>
            <p className="landing-kicker">FAQ</p>
            <h2 className="landing-h2 mt-4">
              {isEn ? "Questions before you try." : "Les questions avant d’essayer."}
            </h2>
          </div>
          <div className="divide-y divide-line border-y border-line">
            {copy.faqs.map((item) => (
              <details key={item.q} className="landing-faq group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-base font-semibold text-ink sm:text-lg">
                  {item.q}
                  <span
                    className="shrink-0 text-coral transition-transform group-open:rotate-45"
                    aria-hidden
                  >
                    +
                  </span>
                </summary>
                <p className="pb-5 text-[15px] leading-relaxed text-ink-soft">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section
        id="waitlist"
        className="content-auto scroll-mt-20 bg-[#0a0a0a] page-gutter py-16 sm:py-24"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-md">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#ff4d00]">
              {isEn ? "Start today" : "Commencez dès aujourd’hui"}
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {isEn ? "We are still building." : "On construit encore."}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-white/60">
              {isEn
                ? "Leave your email for launch updates, or send feedback after the demo."
                : "Laisse ton e-mail pour le lancement, ou envoie un retour après la démo."}
            </p>
          </div>
          <WaitlistForm lang={lang} />
        </div>
      </section>

      <footer className="safe-bottom border-t border-white/10 bg-[#0a0a0a] page-gutter py-8 text-sm text-white/50">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <p className="font-[family-name:var(--font-display)] text-lg font-extrabold text-white">
            Flip<span className="text-[#ff4d00]">On</span>
          </p>
          <nav className="flex flex-col gap-2" aria-label={isEn ? "Product" : "Produit"}>
            <Link className="hover:text-white" href={withLang("/presentation", lang)}>
              {isEn ? "How it works" : "Présentation"}
            </Link>
            <Link className="hover:text-white" href={withLang("/commencer", lang)}>
              {isEn ? "Start" : "Commencer"}
            </Link>
            <Link className="hover:text-white" href={withLang("/download", lang)}>
              {isEn ? "Download" : "Télécharger"}
            </Link>
            <Link className="hover:text-white" href={withLang("/test", lang)}>
              {isEn ? "Demo" : "Démo"}
            </Link>
          </nav>
          <nav className="flex flex-col gap-2" aria-label="Légal">
            <a className="hover:text-white" href="/legal/confidentialite">
              {isEn ? "Privacy" : "Confidentialité"}
            </a>
            <a className="hover:text-white" href="/legal/cgu">
              {isEn ? "Terms" : "CGU"}
            </a>
            <a className="hover:text-white" href="/legal/mentions">
              {isEn ? "Legal notice" : "Mentions"}
            </a>
          </nav>
          <p>{isEn ? "France · 2026" : "France · 2026"}</p>
        </div>
      </footer>
    </main>
  );
}
