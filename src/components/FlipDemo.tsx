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
  { value: "basse", label: "Basse" },
  { value: "moyenne", label: "Moyenne" },
  { value: "haute", label: "Haute" },
];

const placeOptions: { value: Place; label: string }[] = [
  { value: "dedans", label: "Dedans" },
  { value: "dehors", label: "Dehors" },
  { value: "peu-importe", label: "Peu importe" },
];

function ChoiceGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="font-[family-name:var(--font-syne)] text-sm font-semibold uppercase tracking-[0.12em] text-ink-soft">
        {label}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={[
                "border px-4 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "border-ink bg-ink text-white"
                  : "border-ink/15 bg-white text-ink hover:border-ink/40",
              ].join(" ")}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </fieldset>
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
    return Math.min(100, Math.round((index / deck.length) * 100));
  }, [deck.length, index]);

  function startSwipe() {
    const filtered = filterPlans(constraints);
    const pool = filtered.length >= 3 ? filtered : filterPlans({
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
    const pick = likes[0] ?? deck[0] ?? null;
    setMatched(pick);
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
      if (nextIndex >= deck.length) {
        finish(nextLiked);
      } else {
        setIndex(nextIndex);
      }
    }, 280);
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
    <div className="mx-auto w-full max-w-lg">
      {step === "constraints" && (
        <div className="animate-rise space-y-8">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-teal">
              Étape 1 — Contraintes
            </p>
            <h2 className="font-[family-name:var(--font-syne)] text-3xl font-bold tracking-tight text-ink">
              Qu’est-ce qui est possible ce soir ?
            </h2>
            <p className="text-ink-soft">
              20 secondes. Ensuite vous swiperez — en vrai, chacun de son côté.
            </p>
          </div>

          <div className="space-y-6 rounded-none border border-ink/10 bg-white/70 p-6 backdrop-blur-sm">
            <ChoiceGroup
              label="Durée"
              options={durationOptions}
              value={constraints.duration}
              onChange={(duration) => setConstraints((c) => ({ ...c, duration }))}
            />
            <ChoiceGroup
              label="Budget"
              options={budgetOptions}
              value={constraints.budget}
              onChange={(budget) => setConstraints((c) => ({ ...c, budget }))}
            />
            <ChoiceGroup
              label="Énergie"
              options={energyOptions}
              value={constraints.energy}
              onChange={(energy) => setConstraints((c) => ({ ...c, energy }))}
            />
            <ChoiceGroup
              label="Lieu"
              options={placeOptions}
              value={constraints.place}
              onChange={(place) => setConstraints((c) => ({ ...c, place }))}
            />
          </div>

          <button
            type="button"
            onClick={startSwipe}
            className="h-12 w-full bg-coral text-[15px] font-semibold text-white transition-colors hover:bg-coral-deep"
          >
            Lancer les propositions
          </button>
        </div>
      )}

      {step === "swipe" && current && (
        <div className="animate-rise space-y-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.14em] text-teal">
                Étape 2 — Swipe
              </p>
              <h2 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-ink">
                Oui ou non — sans débat
              </h2>
            </div>
            <p className="text-sm text-ink-soft">
              {index + 1}/{deck.length}
            </p>
          </div>

          <div className="h-1.5 w-full overflow-hidden bg-foam-deep">
            <div
              className="h-full bg-teal transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div
            className={[
              "relative min-h-[340px] border border-ink/10 bg-white p-7 transition-transform duration-300",
              fly === "right" ? "translate-x-8 rotate-3 opacity-0" : "",
              fly === "left" ? "-translate-x-8 -rotate-3 opacity-0" : "",
              !fly ? "animate-swipe-hint" : "",
            ].join(" ")}
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-coral">
              {current.category}
            </p>
            <h3 className="font-[family-name:var(--font-syne)] text-2xl font-bold leading-tight text-ink">
              {current.title}
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
              {current.blurb}
            </p>
            <ul className="mt-5 space-y-2 text-sm text-ink">
              <li>
                ~{current.durationMin} min ·{" "}
                {current.budgetMax === 0 ? "gratuit" : `≤ ${current.budgetMax} €`} ·{" "}
                {current.place} · énergie {current.energy}
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => vote(false)}
              className="h-14 border border-ink/20 bg-white text-base font-semibold text-ink transition-colors hover:bg-foam"
            >
              Passer
            </button>
            <button
              type="button"
              onClick={() => vote(true)}
              className="h-14 bg-teal text-base font-semibold text-white transition-colors hover:bg-teal-soft"
            >
              On valide
            </button>
          </div>
        </div>
      )}

      {step === "match" && (
        <div className="animate-rise space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-match">
              Match
            </p>
            <h2 className="font-[family-name:var(--font-syne)] text-3xl font-bold tracking-tight text-ink">
              Votre plan
            </h2>
            <p className="text-ink-soft">
              Un seul résultat. En duo réel, ce serait l’intersection de vos swipes.
            </p>
          </div>

          {matched ? (
            <div className="border border-match/30 bg-white p-7">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-match">
                {matched.category}
              </p>
              <h3 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-ink">
                {matched.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                {matched.blurb}
              </p>
              <ol className="mt-6 space-y-3">
                {matched.steps.map((s, i) => (
                  <li key={s} className="flex gap-3 text-[15px] text-ink">
                    <span className="font-[family-name:var(--font-syne)] font-bold text-coral">
                      {i + 1}.
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <p className="text-ink-soft">
              Aucun plan n’a matché — élargissez les contraintes et réessayez.
            </p>
          )}

          <button
            type="button"
            onClick={reset}
            className="h-12 w-full border border-ink/20 bg-white text-[15px] font-semibold text-ink transition-colors hover:bg-foam"
          >
            Recommencer
          </button>
        </div>
      )}
    </div>
  );
}
