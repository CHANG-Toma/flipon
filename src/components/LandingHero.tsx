"use client";

import Link from "next/link";
import { AppPhoneShowcase } from "@/components/marketing/AppPhoneShowcase";
import { type Lang, withLang } from "@/lib/i18n";

export function LandingHero({ lang = "fr" }: { lang?: Lang }) {
  const copy =
    lang === "en"
      ? {
          titleA: "One activity",
          titleB: "the whole group wants.",
          subtitle: "Where you want, when you want.",
          support:
            "Day or evening: FlipOn ends the “what should we do?” loop and locks one shared plan.",
          ctaTry: "Try now",
          ctaHow: "How it works",
        }
      : {
          titleA: "Une activité",
          titleB: "que tout le groupe veut faire.",
          subtitle: "Où tu veux, quand tu veux.",
          support:
            "Journée ou soirée : FlipOn coupe le « on fait quoi ? » et verrouille un plan commun.",
          ctaTry: "Essayer",
          ctaHow: "Comment ça marche",
        };

  return (
    <section className="relative min-h-[92svh] overflow-hidden bg-[#0a0a0a]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_40%,rgb(255_106_43_/_12%),transparent_55%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto grid min-h-[92svh] max-w-6xl items-center gap-10 page-gutter pb-12 pt-20 sm:pb-16 sm:pt-24 lg:grid-cols-2 lg:gap-14 lg:pb-20">
        <div className="max-w-xl">
          <p className="font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
            Flip<span className="text-[#ff4d00]">On</span>
          </p>

          <h1 className="mt-5 text-xl font-bold leading-snug text-white sm:text-3xl md:text-[2.1rem]">
            {copy.titleA}
            <br />
            {copy.titleB}
          </h1>

          <p className="mt-4 max-w-md text-lg font-semibold leading-snug text-[#ff4d00] sm:text-xl">
            {copy.subtitle}
          </p>
          <p className="mt-2 max-w-md text-[15px] leading-relaxed text-white/75 sm:text-base">
            {copy.support}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={withLang("/test", lang)}
              prefetch
              className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-ui)] bg-[#ff4d00] px-7 text-base font-bold text-white hover:bg-[#e04400]"
            >
              {copy.ctaTry}
            </Link>
            <Link
              href={withLang("/presentation", lang)}
              prefetch
              className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-ui)] border border-white px-6 text-[15px] font-semibold text-white hover:bg-white/10"
            >
              {copy.ctaHow}
            </Link>
          </div>
        </div>

        <AppPhoneShowcase lang={lang} variant="hero" />
      </div>
    </section>
  );
}
