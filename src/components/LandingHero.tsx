"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { type Lang, withLang } from "@/lib/i18n";

const DuoDemo = dynamic(
  () => import("@/components/DuoDemo").then((m) => m.DuoDemo),
  {
    ssr: false,
    loading: () => (
      <div
        className="mx-auto flex h-[220px] w-full max-w-xl items-center justify-center border border-white/15 bg-black/20 sm:h-[280px]"
        aria-hidden
      >
        <div className="h-2 w-16 bg-white/30" />
      </div>
    ),
  },
);

function useDeferredReady(delayMs = 200) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), delayMs);
    return () => window.clearTimeout(id);
  }, [delayMs]);
  return ready;
}

export function LandingHero({ lang = "fr" }: { lang?: Lang }) {
  const demoReady = useDeferredReady(280);
  const copy =
    lang === "en"
      ? {
          titleA: "One activity approved",
          titleB: "by the whole group.",
          subtitle:
            "No more 40-minute loops with friends. You decide and go.",
          ctaTry: "Try now",
          ctaHow: "How it works",
        }
      : {
          titleA: "Une activité validée",
          titleB: "par tout le groupe.",
          subtitle:
            "Moins de discussions, plus d’action : vous choisissez vite et vous profitez.",
          ctaTry: "Essayer",
          ctaHow: "Comment ça marche",
        };

  return (
    <section className="relative min-h-[92svh] overflow-hidden bg-[#0a0a0a]">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Image
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=70"
          alt=""
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          quality={65}
          className="object-cover object-[center_35%] opacity-45 grayscale"
        />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-black/55" />

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

          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/75 sm:text-base">
            {copy.subtitle}
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

        <div>
          {demoReady ? (
            <DuoDemo />
          ) : (
            <div
              className="mx-auto flex h-[220px] w-full max-w-xl items-center justify-center border border-white/15 bg-black/20 sm:h-[280px]"
              aria-hidden
            />
          )}
        </div>
      </div>
    </section>
  );
}
