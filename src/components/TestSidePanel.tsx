"use client";

import dynamic from "next/dynamic";
import type { Lang } from "@/lib/i18n";

const DuoDemo = dynamic(
  () => import("@/components/DuoDemo").then((m) => m.DuoDemo),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto flex h-[200px] w-full max-w-sm items-center justify-center rounded-xl bg-white/5">
        <div className="h-2 w-12 rounded bg-white/20" />
      </div>
    ),
  },
);

/** Textes produit (site + app mobile) — source unique pour le panneau /test */
const COPY = {
  fr: {
    eyebrow: "FlipOn",
    title: "Une activité que tout le groupe veut faire.",
    subtitle: "Votez en privé, une idée pour tout le monde.",
    body: "Choisis le cadre, invite avec un code, votez chacun de votre côté.",
    tagline: "Votes privés · une seule idée pour tout le monde",
    steps: [
      { t: "Cadre", d: "Journée ou soirée : temps, budget, ambiance." },
      { t: "Vote", d: "Oui ou passer : l’autre ne voit pas." },
      { t: "Go", d: "Une idée commune + les prochaines étapes." },
    ],
  },
  en: {
    eyebrow: "FlipOn",
    title: "One activity the whole group wants.",
    subtitle: "Vote privately, one idea for everyone.",
    body: "Pick the frame, invite with a code, vote on your own side.",
    tagline: "Private votes · one idea for everyone",
    steps: [
      { t: "Setup", d: "Day or evening: time, budget, vibe." },
      { t: "Vote", d: "Yes or pass: private choices." },
      { t: "Go", d: "One shared idea + next steps." },
    ],
  },
} as const;

export function TestSidePanel({ lang }: { lang: Lang }) {
  const copy = lang === "en" ? COPY.en : COPY.fr;

  return (
    <aside className="flex h-full flex-col justify-between gap-6 rounded-[var(--radius-ui)] bg-[#0f0f0f] p-5 text-white sm:p-6 lg:min-h-[640px]">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-coral">
          {copy.eyebrow}
        </p>
        <h2 className="mt-2 text-xl font-bold leading-snug sm:text-2xl">{copy.title}</h2>
        <p className="mt-2 text-sm font-semibold leading-relaxed text-white/85">
          {copy.subtitle}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-white/60">{copy.body}</p>
      </div>

      <div className="hidden sm:block">
        <DuoDemo />
      </div>

      <div>
        <p className="mb-3 text-center text-xs font-medium text-white/55 sm:text-left">
          {copy.tagline}
        </p>
        <ol className="space-y-3">
          {copy.steps.map((tip, i) => (
            <li key={tip.t} className="flex gap-3 text-sm">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-coral/15 text-xs font-bold text-coral">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold text-white">{tip.t}</p>
                <p className="mt-0.5 leading-relaxed text-white/60">{tip.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </aside>
  );
}
