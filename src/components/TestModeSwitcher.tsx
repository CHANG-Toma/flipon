"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DemoPhoneFrame } from "@/components/DemoPhoneFrame";
import { FlipDemo } from "@/components/FlipDemo";
import { TestSidePanel } from "@/components/TestSidePanel";
import { withLang, type Lang } from "@/lib/i18n";

type Mode = "basic" | "premium";

type RoadmapStep = {
  title: string;
  detail: string;
  duration: string;
};

type PremiumExample = {
  id: string;
  label: string;
  context: string;
  result: string;
  vibe: string;
  total: string;
  steps: RoadmapStep[];
};

function PremiumPlanTicket({
  example,
  isEn,
}: {
  example: PremiumExample;
  isEn: boolean;
}) {
  return (
    <article className="overflow-hidden rounded-[var(--radius-ui)] border border-line bg-white shadow-sm">
      <div className="relative bg-ink px-4 py-4 text-white sm:px-5">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 70% 80% at 100% 0%, color-mix(in srgb, var(--coral) 55%, transparent), transparent 55%)",
          }}
        />
        <div className="relative z-[1]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-coral">
              {isEn ? "Plan ready" : "Plan prêt"}
            </p>
            <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-white/90">
              {example.total}
            </span>
          </div>
          <h4 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight sm:text-3xl">
            {example.result}
          </h4>
          <p className="mt-1.5 text-sm text-white/70">{example.context}</p>
        </div>
      </div>

      <div className="px-4 pb-5 pt-4 sm:px-5">
        <ol className="space-y-3">
          {example.steps.map((step, idx) => {
            const isLast = idx === example.steps.length - 1;
            return (
              <li key={step.title} className="relative grid grid-cols-[1.5rem_1fr] gap-3 text-sm">
                <div className="relative flex flex-col items-center">
                  <span className="relative z-[1] flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-coral/10 text-xs font-bold text-coral">
                    {idx + 1}
                  </span>
                  {!isLast ? (
                    <span
                      className="mt-1 w-px flex-1 rounded-full bg-coral/35"
                      aria-hidden
                    />
                  ) : null}
                </div>
                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-ink">{step.title}</p>
                    <span className="shrink-0 text-[11px] font-semibold text-coral">{step.duration}</span>
                  </div>
                  <p className="mt-0.5 text-ink-soft">{step.detail}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </article>
  );
}

function TestModeSwitcherInner({ lang }: { lang: Lang }) {
  const isEn = lang === "en";
  const searchParams = useSearchParams();
  const inRoom = Boolean(searchParams.get("room"));
  const [mode, setMode] = useState<Mode>("basic");
  const [activePlan, setActivePlan] = useState(0);

  const premiumExamples: PremiumExample[] = isEn
    ? [
        {
          id: "rain",
          label: "Rainy evening",
          context: "Rain · 20 min max · tonight",
          result: "Board game cafe + hot chocolate",
          vibe: "Indoor · low effort",
          total: "~40 min",
          steps: [
            { title: "Leave at 19:40", detail: "Meet at metro Carmes exit", duration: "now" },
            { title: "Go to L'Antre des Jeux", detail: "Open now · 12 min walk", duration: "12 min" },
            { title: "Play until 21:15", detail: "Starter game on arrival", duration: "75 min" },
          ],
        },
        {
          id: "afterwork",
          label: "After work",
          context: "Low energy · group",
          result: "Quiet tapas, group-friendly",
          vibe: "Fast · less debate",
          total: "~25 min",
          steps: [
            { title: "Leave office at 18:35", detail: "Same exit for everyone", duration: "now" },
            { title: "Walk to Casa Lenta", detail: "8 min · quiet corner", duration: "8 min" },
            { title: "Stay until 20:00", detail: "Easy exit before rush", duration: "70 min" },
          ],
        },
      ]
    : [
        {
          id: "rain",
          label: "Soirée pluie",
          context: "Pluie · 20 min max · ce soir",
          result: "Bar à jeux + chocolat chaud",
          vibe: "Indoor · peu d'effort",
          total: "~40 min",
          steps: [
            { title: "Partir à 19h40", detail: "RDV sortie métro Carmes", duration: "maintenant" },
            { title: "Aller à L'Antre des Jeux", detail: "Ouvert · 12 min à pied", duration: "12 min" },
            { title: "Jouer jusqu'à 21h15", detail: "Jeu de démarrage sur place", duration: "75 min" },
          ],
        },
        {
          id: "afterwork",
          label: "Après boulot",
          context: "Peu d'énergie · groupe",
          result: "Tapas calme, adapté au groupe",
          vibe: "Rapide · moins de débat",
          total: "~25 min",
          steps: [
            { title: "Quitter le bureau à 18h35", detail: "Même sortie pour tous", duration: "maintenant" },
            { title: "Marcher jusqu'à Casa Lenta", detail: "8 min · coin calme", duration: "8 min" },
            { title: "Rester jusqu'à 20h00", detail: "Sortie avant le rush", duration: "70 min" },
          ],
        },
      ];

  const current = premiumExamples[activePlan] ?? premiumExamples[0];

  return (
    <section className="mx-auto max-w-6xl space-y-4 sm:space-y-5">
      {inRoom ? (
        <div className="border-b border-line pb-4">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {isEn ? "Session in progress" : "Session en cours"}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            {isEn
              ? "Vote privately — results appear once everyone has voted."
              : "Vote en privé — les résultats apparaissent quand tout le monde a voté."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 border-b border-line pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              {isEn ? "Try FlipOn" : "Essayer FlipOn"}
            </h1>
            <div className="mt-2 flex gap-5">
              <button
                type="button"
                className="test-toolbar-tab"
                data-active={mode === "basic"}
                aria-pressed={mode === "basic"}
                onClick={() => setMode("basic")}
              >
                {isEn ? "Basic" : "Basique"}
              </button>
              <button
                type="button"
                className="test-toolbar-tab"
                data-active={mode === "premium"}
                aria-pressed={mode === "premium"}
                onClick={() => setMode("premium")}
              >
                Premium
              </button>
            </div>
          </div>

          <Link
            href={withLang("/join", lang)}
            className="rounded-full border-2 border-coral px-5 py-2 text-sm font-semibold text-coral transition hover:bg-coral hover:text-white"
          >
            {isEn ? "Join" : "Rejoindre"}
          </Link>
        </div>
      )}

      {mode === "basic" ? (
        inRoom ? (
          <div className="mx-auto max-w-md">
            <FlipDemo lang={lang} />
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-6">
            <TestSidePanel lang={lang} />
            <div className="flex items-start justify-center lg:pt-2">
              <DemoPhoneFrame>
                <FlipDemo lang={lang} compact />
              </DemoPhoneFrame>
            </div>
          </div>
        )
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-6">
          <aside className="rounded-[var(--radius-ui)] border border-line bg-white p-5 shadow-sm sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-coral">
              {isEn ? "Premium preview" : "Aperçu Premium"}
            </p>
            <h2 className="mt-2 text-xl font-bold text-ink">
              {isEn ? "AI picks the plan." : "L’IA choisit le plan."}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              {isEn
                ? "Same vote — but the result is a step-by-step itinerary, not just an idea."
                : "Même vote — mais le résultat est un itinéraire étape par étape, pas juste une idée."}
            </p>
            <Link href={withLang("/tarifs", lang)} className="btn-secondary mt-5 w-full">
              {isEn ? "See pricing" : "Voir les tarifs"}
            </Link>
          </aside>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {premiumExamples.map((example, idx) => (
                <button
                  key={example.id}
                  type="button"
                  onClick={() => setActivePlan(idx)}
                  aria-pressed={activePlan === idx}
                  className={[
                    "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                    activePlan === idx
                      ? "border-coral bg-coral text-white"
                      : "border-line bg-white text-ink-soft hover:border-coral/40 hover:text-ink",
                  ].join(" ")}
                >
                  {example.label}
                </button>
              ))}
            </div>
            <PremiumPlanTicket example={current} isEn={isEn} />
            <Link href={withLang("/download", lang)} className="btn-primary inline-flex w-full sm:w-auto">
              {isEn ? "Get the app" : "Télécharger l’app"}
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}

export function TestModeSwitcher({ lang }: { lang: Lang }) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-2">
          <div className="h-80 animate-pulse rounded-[var(--radius-ui)] bg-foam" />
          <div className="h-80 animate-pulse rounded-[var(--radius-ui)] bg-foam" />
        </div>
      }
    >
      <TestModeSwitcherInner lang={lang} />
    </Suspense>
  );
}
