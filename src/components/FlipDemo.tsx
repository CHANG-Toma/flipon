"use client";

import { useMemo, useState } from "react";
import {
  Constraints,
  Plan,
  filterPlans,
  type Budget,
  type Duration,
  type Energy,
  type Place,
} from "@/data/plans";

type Step = "constraints" | "swipe" | "match";

const STEPS: { id: Step; label: string }[] = [
  { id: "constraints", label: "Cadre" },
  { id: "swipe", label: "Vote" },
  { id: "match", label: "Idée" },
];

const durationOptions: { value: Duration; label: string }[] = [
  { value: "30", label: "30 min" },
  { value: "60", label: "1 h" },
  { value: "120", label: "2 h" },
  { value: "soirée", label: "Soirée" },
];

const budgetOptions: { value: Budget; label: string }[] = [
  { value: "0", label: "Gratuit" },
  { value: "20", label: "≤ 20 €" },
  { value: "50", label: "≤ 50 €" },
  { value: "80+", label: "80 € +" },
];

const energyOptions: { value: Energy; label: string }[] = [
  { value: "basse", label: "Tranquille" },
  { value: "moyenne", label: "Normal" },
  { value: "haute", label: "Dynamique" },
];

const placeOptions: { value: Place; label: string }[] = [
  { value: "dedans", label: "Dedans" },
  { value: "dehors", label: "Dehors" },
  { value: "peu-importe", label: "Peu importe" },
];

function Stepper({ current }: { current: Step }) {
  const currentIndex = STEPS.findIndex((s) => s.id === current);

  return (
    <ol className="mb-8 flex items-center gap-2" aria-label="Étapes">
      {STEPS.map((s, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <li key={s.id} className="flex flex-1 items-center gap-2">
            <div
              className={[
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                active
                  ? "bg-coral text-white"
                  : done
                    ? "bg-sky text-coral-deep"
                    : "bg-foam text-ink-soft",
              ].join(" ")}
              aria-current={active ? "step" : undefined}
            >
              {done ? "✓" : i + 1}
            </div>
            <span
              className={[
                "hidden text-sm font-medium sm:inline",
                active ? "text-ink" : "text-ink-soft",
              ].join(" ")}
            >
              {s.label}
            </span>
            {i < STEPS.length - 1 && (
              <div
                className={[
                  "ml-1 hidden h-px flex-1 sm:block",
                  done ? "bg-coral/40" : "bg-line",
                ].join(" ")}
                aria-hidden
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function ChoiceGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  columns = 2,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  columns?: 2 | 3 | 4;
}) {
  const grid =
    columns === 4
      ? "grid-cols-2 sm:grid-cols-4"
      : columns === 3
        ? "grid-cols-3"
        : "grid-cols-2";

  return (
    <fieldset className="space-y-2.5">
      <legend className="text-sm font-semibold text-ink">{label}</legend>
      <div className={`grid gap-2 ${grid}`} role="radiogroup" aria-label={label}>
        {options.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={active}
              data-active={active}
              onClick={() => onChange(opt.value)}
              className="chip w-full text-center"
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function MetaTags({ plan }: { plan: Plan }) {
  const tags = [
    `~${plan.durationMin} min`,
    plan.budgetMax === 0 ? "Gratuit" : `≤ ${plan.budgetMax} €`,
    plan.place,
    `Énergie ${plan.energy}`,
  ];
  return (
    <ul className="mt-4 flex flex-wrap gap-2">
      {tags.map((t) => (
        <li
          key={t}
          className="rounded-md bg-foam px-2.5 py-1 text-xs font-medium text-ink-soft"
        >
          {t}
        </li>
      ))}
    </ul>
  );
}

export function FlipDemo() {
  const [step, setStep] = useState<Step>("constraints");
  const [constraints, setConstraints] = useState<Constraints>({
    duration: "60",
    budget: "20",
    energy: "moyenne",
    place: "peu-importe",
  });
  const [deck, setDeck] = useState<Plan[]>([]);
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState<Plan[]>([]);
  const [fly, setFly] = useState<"left" | "right" | null>(null);
  const [matched, setMatched] = useState<Plan | null>(null);

  const current = deck[index];
  const progress = useMemo(() => {
    if (!deck.length) return 0;
    return Math.min(100, Math.round(((index + 1) / deck.length) * 100));
  }, [deck.length, index]);

  function startSwipe() {
    const filtered = filterPlans(constraints);
    const pool =
      filtered.length >= 3
        ? filtered
        : filterPlans({
            ...constraints,
            place: "peu-importe",
            budget: "80+",
          });
    setDeck(pool.slice(0, 6));
    setIndex(0);
    setLiked([]);
    setMatched(null);
    setStep("swipe");
  }

  function finish(likes: Plan[]) {
    setMatched(likes[0] ?? deck[0] ?? null);
    setStep("match");
  }

  function vote(yes: boolean) {
    if (!current || fly) return;
    setFly(yes ? "right" : "left");
    const nextLiked = yes ? [...liked, current] : liked;

    window.setTimeout(() => {
      setFly(null);
      setLiked(nextLiked);
      const nextIndex = index + 1;
      if (nextIndex >= deck.length) finish(nextLiked);
      else setIndex(nextIndex);
    }, 220);
  }

  function reset() {
    setStep("constraints");
    setDeck([]);
    setIndex(0);
    setLiked([]);
    setMatched(null);
    setFly(null);
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <Stepper current={step} />

      {step === "constraints" && (
        <div className="animate-rise space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-ink">
              Qu’est-ce qui est jouable ?
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
              Choisis le cadre. Ensuite tu votes sur quelques idées.
            </p>
          </div>

          <div className="surface space-y-5 p-5">
            <ChoiceGroup
              label="Durée"
              options={durationOptions}
              value={constraints.duration}
              onChange={(duration) => setConstraints((c) => ({ ...c, duration }))}
              columns={4}
            />
            <ChoiceGroup
              label="Budget"
              options={budgetOptions}
              value={constraints.budget}
              onChange={(budget) => setConstraints((c) => ({ ...c, budget }))}
              columns={4}
            />
            <ChoiceGroup
              label="Énergie"
              options={energyOptions}
              value={constraints.energy}
              onChange={(energy) => setConstraints((c) => ({ ...c, energy }))}
              columns={3}
            />
            <ChoiceGroup
              label="Lieu"
              options={placeOptions}
              value={constraints.place}
              onChange={(place) => setConstraints((c) => ({ ...c, place }))}
              columns={3}
            />
          </div>

          <button type="button" onClick={startSwipe} className="btn-primary w-full">
            Voir des idées
          </button>
        </div>
      )}

      {step === "swipe" && current && (
        <div className="animate-rise space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink">
                Ça vous dit ?
              </h2>
              <p className="mt-1 text-sm text-ink-soft">
                Idée {index + 1} sur {deck.length}
              </p>
            </div>
          </div>

          <div
            className="h-1.5 overflow-hidden rounded-full bg-foam-deep"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progression du vote"
          >
            <div
              className="h-full rounded-full bg-coral transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div
            className={[
              "surface min-h-[280px] p-5 transition-all duration-200",
              fly === "right" ? "translate-x-6 opacity-0" : "",
              fly === "left" ? "-translate-x-6 opacity-0" : "",
            ].join(" ")}
          >
            <p className="text-xs font-semibold text-coral">{current.category}</p>
            <h3 className="mt-2 text-xl font-bold leading-snug text-ink">
              {current.title}
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
              {current.blurb}
            </p>
            <MetaTags plan={current} />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => vote(false)}
              className="btn-secondary"
              disabled={!!fly}
            >
              Passer
            </button>
            <button
              type="button"
              onClick={() => vote(true)}
              className="btn-primary"
              disabled={!!fly}
            >
              Oui
            </button>
          </div>
        </div>
      )}

      {step === "match" && (
        <div className="animate-rise space-y-5">
          <div>
            <p className="text-sm font-semibold text-coral">C’est bon</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-ink">
              Votre idée
            </h2>
            <p className="mt-1.5 text-sm text-ink-soft">
              En vrai, ce serait le croisement de vos deux votes.
            </p>
          </div>

          {matched ? (
            <div className="surface p-5">
              <p className="text-xs font-semibold text-coral">{matched.category}</p>
              <h3 className="mt-2 text-xl font-bold text-ink">{matched.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                {matched.blurb}
              </p>
              <MetaTags plan={matched} />
              <ol className="mt-5 space-y-3 border-t border-line pt-5">
                {matched.steps.map((s, i) => (
                  <li key={s} className="flex gap-3 text-[15px] text-ink">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky text-xs font-bold text-coral-deep">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed pt-0.5">{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <p className="surface p-5 text-sm text-ink-soft">
              Rien n’est ressorti. Élargis le cadre et réessaie.
            </p>
          )}

          <button type="button" onClick={reset} className="btn-secondary w-full">
            Recommencer
          </button>
        </div>
      )}
    </div>
  );
}
