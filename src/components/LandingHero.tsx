"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Aurora = dynamic(() => import("@/components/react-bits/Aurora"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-[#121212]" />,
});

const BlurText = dynamic(() => import("@/components/react-bits/BlurText"), {
  ssr: false,
  loading: () => (
    <h1 className="text-2xl font-bold leading-snug tracking-tight text-white/90 sm:text-3xl md:text-[2.15rem]">
      « On devrait faire un truc… » — et vous restez au canapé.
    </h1>
  ),
});

const DuoDemo = dynamic(
  () => import("@/components/DuoDemo").then((m) => m.DuoDemo),
  {
    ssr: false,
    loading: () => (
      <div
        className="mx-auto flex h-[280px] w-full max-w-xl items-center justify-center rounded-[var(--radius-ui)] border border-white/10 bg-white/5"
        aria-hidden
      >
        <div className="h-8 w-8 animate-pulse rounded-full bg-coral/40" />
      </div>
    ),
  },
);

function useDeferredReady(delayMs = 120) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let idleId: number | undefined;
    let timeoutId: number | undefined;

    const enable = () => {
      if (!cancelled) setReady(true);
    };

    timeoutId = window.setTimeout(() => {
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(enable, { timeout: 800 });
      } else {
        enable();
      }
    }, delayMs);

    return () => {
      cancelled = true;
      if (timeoutId) window.clearTimeout(timeoutId);
      if (idleId && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
    };
  }, [delayMs]);

  return ready;
}

export function LandingHero() {
  const auroraReady = useDeferredReady(180);
  const demoReady = useDeferredReady(350);

  return (
    <section className="relative min-h-[92svh] overflow-hidden hero-landing">
      <div className="absolute inset-0 z-0 bg-[#121212]">
        {auroraReady ? (
          <Aurora
            colorStops={["#ff5c7a", "#2dd4bf", "#ff8fa3"]}
            amplitude={1.05}
            blend={0.55}
            speed={0.85}
          />
        ) : (
          <div
            className="h-full w-full bg-[radial-gradient(ellipse_at_70%_20%,rgba(255,92,122,0.35),transparent_55%),radial-gradient(ellipse_at_15%_80%,rgba(45,212,191,0.22),transparent_50%),#121212]"
            aria-hidden
          />
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden>
        <Image
          src="https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?auto=format&fit=crop&w=1600&q=70"
          alt=""
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          quality={65}
          placeholder="blur"
          blurDataURL="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Cfilter id='b'%3E%3CfeGaussianBlur stdDeviation='1'/%3E%3C/filter%3E%3Crect width='16' height='9' fill='%231a1218' filter='url(%23b)'/%3E%3C/svg%3E"
          className="animate-drift-slow object-cover object-[center_40%] opacity-25"
        />
      </div>

      <div className="hero-fx" aria-hidden>
        <span className="hero-orb hero-orb-a" />
        <span className="hero-orb hero-orb-b" />
      </div>

      <div className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-r from-black/80 via-black/55 to-black/25" />
      <div className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-t from-black/70 via-transparent to-black/35" />

      <div className="relative z-10 mx-auto grid min-h-[92svh] max-w-6xl items-center gap-8 page-gutter pb-12 pt-20 sm:gap-10 sm:pb-16 sm:pt-24 lg:grid-cols-2 lg:gap-12 lg:pb-20">
        <div className="max-w-xl">
          <p className="font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
            Flip<span className="text-coral">On</span>
          </p>

          <div className="mt-4 sm:mt-5">
            <BlurText
              text="« On devrait faire un truc… » — et vous restez au canapé."
              delay={60}
              animateBy="words"
              direction="bottom"
              className="text-xl font-bold leading-snug tracking-tight text-white sm:text-3xl md:text-[2.15rem]"
              stepDuration={0.28}
            />
          </div>

          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/70 sm:mt-4 sm:text-lg">
            Une idée d’activité à deux. Pas une liste. Vous votez chacun de
            votre côté — FlipOn garde celle qui passe pour les deux.
          </p>

          <div className="mt-6 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:items-center sm:gap-3">
            <Link
              href="/test"
              prefetch
              className="btn-primary w-full min-h-12 px-7 text-base shadow-[0_10px_40px_rgb(255_92_122/0.4)] sm:w-auto"
            >
              Essayer maintenant
            </Link>
            <Link
              href="/presentation"
              prefetch
              className="inline-flex min-h-12 w-full items-center justify-center rounded-[var(--radius-ui)] border border-white/30 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
            >
              Comment ça marche
            </Link>
          </div>
        </div>

        <div className="reveal-in" style={{ animationDelay: "80ms" }}>
          {demoReady ? (
            <DuoDemo />
          ) : (
            <div
              className="mx-auto flex h-[220px] w-full max-w-xl items-center justify-center rounded-[var(--radius-ui)] border border-white/10 bg-white/5 sm:h-[280px]"
              aria-hidden
            >
              <div className="h-8 w-8 animate-pulse rounded-full bg-coral/40" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
