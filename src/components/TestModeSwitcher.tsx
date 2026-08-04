"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { FlipDemo } from "@/components/FlipDemo";
import { withLang, type Lang } from "@/lib/i18n";

type Mode = "basic" | "boost";

type RoadmapStep = {
  title: string;
  detail: string;
  duration: string;
};

type BoostExample = {
  id: string;
  label: string;
  context: string;
  result: string;
  vibe: string;
  total: string;
  steps: RoadmapStep[];
};

function BoostPlanTicket({
  example,
  isEn,
}: {
  example: BoostExample;
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
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/85">
              {example.vibe}
            </span>
            <span className="rounded-full border border-coral/40 bg-coral/20 px-2.5 py-1 text-[11px] font-semibold text-coral">
              {isEn ? "Just follow" : "À suivre"}
            </span>
          </div>
        </div>
      </div>

      <div className="relative h-4 bg-white" aria-hidden>
        <div className="absolute inset-x-4 top-1/2 border-t border-dashed border-line" />
        <span className="absolute left-0 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color-mix(in_srgb,var(--coral)_7%,white)]" />
        <span className="absolute right-0 top-1/2 h-4 w-4 translate-x-1/2 -translate-y-1/2 rounded-full bg-[color-mix(in_srgb,var(--coral)_7%,white)]" />
      </div>

      <div className="px-4 pb-5 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
            {isEn ? "Steps already set" : "Étapes déjà définies"}
          </p>
          <p className="text-[11px] font-semibold text-coral">
            {isEn ? "Nothing left to decide" : "Rien à décider"}
          </p>
        </div>

        <ol className="relative mt-4 space-y-0">
          {example.steps.map((step, idx) => {
            const isLast = idx === example.steps.length - 1;
            return (
              <li key={step.title} className="relative grid grid-cols-[28px_1fr] gap-3">
                <div className="relative flex flex-col items-center">
                  <span
                    className={[
                      "relative z-[1] flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-bold",
                      isLast
                        ? "bg-coral text-white"
                        : "border-2 border-coral bg-white text-coral",
                    ].join(" ")}
                  >
                    {idx + 1}
                  </span>
                  {!isLast ? (
                    <span className="mt-1 w-px flex-1 border-l-2 border-dashed border-coral/35" />
                  ) : null}
                </div>
                <div className={`min-w-0 ${isLast ? "pb-0" : "pb-4"}`}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[14px] font-semibold leading-snug text-ink">{step.title}</p>
                    <span className="shrink-0 text-[11px] font-semibold text-coral">{step.duration}</span>
                  </div>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-ink-soft">{step.detail}</p>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-4 flex items-center justify-between gap-3 rounded-[12px] border border-coral/20 bg-coral/5 px-3 py-2.5">
          <p className="text-sm font-semibold text-ink">
            {isEn ? "Everything is set" : "Tout est déjà décidé"}
          </p>
          <span className="text-xs font-semibold text-coral">
            {isEn ? "Follow step 1 →" : "Passer à l'étape 1 →"}
          </span>
        </div>
      </div>
    </article>
  );
}

export function TestModeSwitcher({ lang }: { lang: Lang }) {
  const isEn = lang === "en";
  const [mode, setMode] = useState<Mode>("basic");
  const [activePlan, setActivePlan] = useState(0);

  const boostExamples: BoostExample[] = isEn
    ? [
        {
          id: "rain",
          label: "Rainy evening",
          context: "Rain · 20 min max · tonight",
          result: "Board game cafe + hot chocolate",
          vibe: "Indoor · low effort",
          total: "~40 min",
          steps: [
            {
              title: "Leave at 19:40",
              detail: "Meet at metro Carmes exit",
              duration: "now",
            },
            {
              title: "Go to L'Antre des Jeux",
              detail: "Open now · 12 min walk · good for 4",
              duration: "12 min",
            },
            {
              title: "Play until 21:15",
              detail: "Ask for a starter game on arrival",
              duration: "75 min",
            },
            {
              title: "Finish at Moka House",
              detail: "Hot chocolate stop, 4 min walk",
              duration: "15 min",
            },
          ],
        },
        {
          id: "afterwork",
          label: "After work",
          context: "Low energy · short travel · group",
          result: "Quiet tapas, group-friendly",
          vibe: "Fast · less debate",
          total: "~25 min",
          steps: [
            {
              title: "Leave office at 18:35",
              detail: "Same exit for everyone",
              duration: "now",
            },
            {
              title: "Walk to Casa Lenta",
              detail: "8 min · quiet corner usually free",
              duration: "8 min",
            },
            {
              title: "Order the shared set",
              detail: "Suggested: tapas board + soft drinks",
              duration: "5 min",
            },
            {
              title: "Stay until 20:00",
              detail: "Easy exit before the rush",
              duration: "70 min",
            },
          ],
        },
        {
          id: "date",
          label: "Small budget date",
          context: "Date · low cost · sunset",
          result: "Sunset walk + takeaway picnic",
          vibe: "Romantic · low cost",
          total: "~75 min",
          steps: [
            {
              title: "Stop at Boulangerie Marius",
              detail: "Takeaway picnic under 12€",
              duration: "10 min",
            },
            {
              title: "Walk to Belvédère Saint-Paul",
              detail: "Best sunset angle around 19:55",
              duration: "12 min",
            },
            {
              title: "Picnic until 20:40",
              detail: "Spot near the railing",
              duration: "45 min",
            },
            {
              title: "Return via Parc des Rives",
              detail: "Short calm walk back",
              duration: "10 min",
            },
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
            {
              title: "Partir à 19h40",
              detail: "RDV sortie métro Carmes",
              duration: "maintenant",
            },
            {
              title: "Aller à L'Antre des Jeux",
              detail: "Ouvert · 12 min à pied · adapté pour 4",
              duration: "12 min",
            },
            {
              title: "Jouer jusqu'à 21h15",
              detail: "Demander un jeu de démarrage sur place",
              duration: "75 min",
            },
            {
              title: "Finir chez Moka House",
              detail: "Pause chocolat, 4 min à pied",
              duration: "15 min",
            },
          ],
        },
        {
          id: "afterwork",
          label: "Après boulot",
          context: "Peu d'énergie · trajet court · groupe",
          result: "Tapas calme, adapté au groupe",
          vibe: "Rapide · moins de débat",
          total: "~25 min",
          steps: [
            {
              title: "Quitter le bureau à 18h35",
              detail: "Même sortie pour tout le monde",
              duration: "maintenant",
            },
            {
              title: "Marcher jusqu'à Casa Lenta",
              detail: "8 min · coin calme souvent libre",
              duration: "8 min",
            },
            {
              title: "Commander le set partagé",
              detail: "Suggestion : planche tapas + softs",
              duration: "5 min",
            },
            {
              title: "Rester jusqu'à 20h00",
              detail: "Sortie facile avant le rush",
              duration: "70 min",
            },
          ],
        },
        {
          id: "date",
          label: "Date petit budget",
          context: "Date · petit budget · coucher de soleil",
          result: "Balade + picnic à emporter",
          vibe: "Romantique · low cost",
          total: "~75 min",
          steps: [
            {
              title: "Passer chez Boulangerie Marius",
              detail: "Picnic à emporter sous 12€",
              duration: "10 min",
            },
            {
              title: "Rejoindre Belvédère Saint-Paul",
              detail: "Meilleur angle soleil vers 19h55",
              duration: "12 min",
            },
            {
              title: "Picnic jusqu'à 20h40",
              detail: "Spot près de la rambarde",
              duration: "45 min",
            },
            {
              title: "Retour via Parc des Rives",
              detail: "Petite balade calme",
              duration: "10 min",
            },
          ],
        },
      ];

  const current = boostExamples[activePlan] ?? boostExamples[0];

  return (
    <section className="mx-auto max-w-3xl space-y-4">
      <div className="animate-rise p-1 sm:p-0">
        <h2 className="text-center font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight text-ink sm:text-4xl">
          {isEn ? "Choose your demo mode" : "Choisir le mode de démo"}
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-ink-soft sm:text-[15px]">
          {isEn
            ? "Switch between Basic and Boost. Only one view is shown at a time."
            : "Bascule entre Basique et Boost. Une seule vue s'affiche à la fois."}
        </p>
        <div className="mt-4 grid gap-2 sm:mt-5 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setMode("basic")}
            aria-pressed={mode === "basic"}
            className={[
              "min-h-12 w-full rounded-[var(--radius-ui)] border px-4 py-2.5 text-center text-sm font-semibold transition",
              mode === "basic"
                ? "border-coral bg-coral text-white shadow-sm"
                : "border-line bg-white text-ink hover:border-coral/50",
            ].join(" ")}
          >
            {isEn ? "Basic" : "Basique"}
          </button>
          <button
            type="button"
            onClick={() => setMode("boost")}
            aria-pressed={mode === "boost"}
            className={[
              "min-h-12 w-full rounded-[var(--radius-ui)] border px-4 py-2.5 text-center text-sm font-semibold transition",
              mode === "boost"
                ? "border-coral bg-coral text-white shadow-sm"
                : "border-line bg-white text-ink hover:border-coral/50",
            ].join(" ")}
          >
            Boost
          </button>
        </div>
      </div>

      {mode === "basic" ? (
        <Suspense
          fallback={
            <div
              className="mx-auto h-40 w-full animate-pulse rounded-[var(--radius-ui)] bg-foam"
              aria-label="Chargement"
            />
          }
        >
          <FlipDemo lang={lang} />
        </Suspense>
      ) : (
        <div className="animate-rise space-y-4">
          <header className="text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-coral">
              {isEn ? "Boost preview" : "Aperçu Boost"}
            </p>
            <h3 className="mt-1 text-xl font-bold tracking-tight text-ink sm:text-2xl">
              {isEn ? "AI chooses. Just follow." : "L'IA choisit. Il ne reste qu'à suivre."}
            </h3>
            <p className="mt-1 text-sm text-ink-soft sm:text-[15px]">
              {isEn
                ? "Places, timing and order are already set. No more group debate."
                : "Lieux, horaires et enchaînement déjà fixés. Plus de débat de groupe."}
            </p>
          </header>

          <div className="flex flex-wrap gap-2">
            {boostExamples.map((example, idx) => (
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

          <BoostPlanTicket example={current} isEn={isEn} />

          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href={withLang("/tarifs", lang)} className="btn-secondary w-full sm:w-auto">
              {isEn ? "See Boost details" : "Voir le détail Boost"}
            </Link>
            <Link href={withLang("/download", lang)} className="btn-primary w-full sm:w-auto">
              {isEn ? "Get Boost" : "Obtenir Boost"}
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
