import Link from "next/link";
import { AppPhoneShowcase } from "@/components/marketing/AppPhoneShowcase";
import { type Lang, withLang } from "@/lib/i18n";

export function LandingHero({ lang = "fr" }: { lang?: Lang }) {
  const isEn = lang === "en";
  const copy = isEn
    ? {
        kicker: "Done with “what should we do?”",
        title: "One activity the whole group wants.",
        support:
          "Day or evening: FlipOn ends the loop and locks one shared plan — after a private vote.",
        ctaTry: "Start",
        ctaHow: "How it works",
        proof: "Private vote · A plan in 2 minutes",
      }
    : {
        kicker: "Fini le « on fait quoi ? »",
        title: "Une activité que tout le groupe veut faire.",
        support:
          "Journée ou soirée : FlipOn coupe la boucle et verrouille un plan commun — après un vote privé.",
        ctaTry: "Commencer",
        ctaHow: "Comment ça marche",
        proof: "Vote privé · Un plan en 2 minutes",
      };

  return (
    <section className="relative overflow-hidden bg-[#0a0a0a]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_40%,rgb(255_106_43_/_14%),transparent_55%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto grid min-h-[88svh] max-w-6xl items-center gap-12 page-gutter pb-16 pt-28 sm:pb-20 sm:pt-32 lg:grid-cols-2 lg:gap-16 lg:pb-24 lg:pt-28">
        <div className="max-w-xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#ff4d00]">
            {copy.kicker}
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-[2.15rem] font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-[3.35rem]">
            {copy.title}
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/72 sm:text-lg">
            {copy.support}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={withLang("/commencer", lang)}
              prefetch
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#ff4d00] px-8 text-base font-bold text-white hover:bg-[#e04400]"
            >
              {copy.ctaTry}
            </Link>
            <Link
              href={withLang("/presentation", lang)}
              prefetch
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/80 px-7 text-[15px] font-semibold text-white hover:bg-white/10"
            >
              {copy.ctaHow}
            </Link>
          </div>
          <p className="mt-5 text-sm text-white/55">{copy.proof}</p>
        </div>

        <AppPhoneShowcase lang={lang} variant="hero" priority />
      </div>
    </section>
  );
}
