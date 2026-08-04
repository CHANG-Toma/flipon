"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Constraints,
  Plan,
  buildDeck,
  countMatchingPlans,
  vibeLabel,
  type Budget,
  type Duration,
  type Energy,
  type Place,
  type Vibe,
} from "@/data/plans";
import type { DuoPublicSnapshot, DuoRole } from "@/lib/duo-types";
import { FeedbackForm } from "@/components/FeedbackForm";
import type { Lang } from "@/lib/i18n";

type Mode = "pick" | "solo" | "duo";
type SoloStep = "constraints" | "swipe" | "match";
type DuoPhase =
  | "constraints"
  | "lobby"
  | "swipe"
  | "waiting"
  | "match";

const STEPS_SOLO: { id: SoloStep; label: string }[] = [
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

const vibeOptions: { value: Vibe; label: string }[] = [
  { value: "potes", label: "Potes" },
  { value: "groupe", label: "Groupe" },
  { value: "date", label: "Date" },
  { value: "peu-importe", label: "Peu importe" },
];

const DEFAULT_CONSTRAINTS: Constraints = {
  duration: "60",
  budget: "20",
  energy: "moyenne",
  place: "peu-importe",
  vibe: "potes",
};

function Stepper({
  labels,
  currentIndex,
}: {
  labels: string[];
  currentIndex: number;
}) {
  return (
    <ol
      className="mb-6 flex items-start gap-1 rounded-[var(--radius-ui)] border border-line bg-white/85 px-2 py-2 shadow-sm backdrop-blur-sm sm:mb-8 sm:items-center sm:gap-2 sm:px-3"
      aria-label="Étapes"
    >
      {labels.map((label, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <li
            key={label}
            className="flex min-w-0 flex-1 flex-col items-center gap-1.5 sm:flex-row sm:items-center sm:gap-2"
          >
            <div
              className={[
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold sm:h-7 sm:w-7",
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
                "max-w-full truncate text-center text-[10px] font-medium leading-tight sm:text-left sm:text-sm",
                active ? "text-ink" : "text-ink-soft",
              ].join(" ")}
            >
              {label}
            </span>
            {i < labels.length - 1 && (
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
  lang,
  columns = 2,
  disabled = false,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  lang: Lang;
  columns?: 2 | 3 | 4;
  disabled?: boolean;
}) {
  const grid =
    columns === 4
      ? "grid-cols-2 sm:grid-cols-4"
      : columns === 3
        ? "grid-cols-3"
        : "grid-cols-2";

  return (
    <fieldset className="space-y-2.5" disabled={disabled}>
      <legend className="text-sm font-semibold text-ink">{label}</legend>
      <div className={`grid gap-1.5 sm:gap-2 ${grid}`} role="radiogroup" aria-label={label}>
        {options.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={active}
              data-active={active}
              disabled={disabled}
              onClick={() => onChange(opt.value)}
              className="chip w-full text-center leading-snug disabled:opacity-60"
            >
              {lang === "en"
                ? {
                    "1 h": "1 h",
                    "2 h": "2 h",
                    Soirée: "Evening",
                    Gratuit: "Free",
                    "≤ 20 €": "<= 20 EUR",
                    "≤ 50 €": "<= 50 EUR",
                    "80 € +": "80 EUR +",
                    Tranquille: "Calm",
                    Normal: "Normal",
                    Dynamique: "Dynamic",
                    Dedans: "Indoor",
                    Dehors: "Outdoor",
                    "Peu importe": "Any",
                    Potes: "Friends",
                    Groupe: "Group",
                    Date: "Date",
                  }[opt.label] ?? opt.label
                : opt.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function placeLabel(p: Plan["place"], lang: Lang): string {
  if (lang === "en") return p === "dedans" ? "Indoor" : "Outdoor";
  return p === "dedans" ? "Dedans" : "Dehors";
}

function energyLabel(e: Energy, lang: Lang): string {
  if (lang === "en") {
    switch (e) {
      case "basse":
        return "Calm";
      case "haute":
        return "Dynamic";
      default:
        return "Normal";
    }
  }
  switch (e) {
    case "basse":
      return "Tranquille";
    case "haute":
      return "Dynamique";
    default:
      return "Normal";
  }
}

function MetaTags({ plan, lang }: { plan: Plan; lang: Lang }) {
  const vibeHint =
    plan.vibes.length === 1
      ? vibeLabel(plan.vibes[0])
      : plan.vibes.includes("date") && plan.vibes.length <= 2
        ? lang === "en"
          ? "great for two"
          : "idéal à deux"
        : null;

  const tags = [
    `~${plan.durationMin} min`,
    plan.budgetMax === 0 ? (lang === "en" ? "Free" : "Gratuit") : `≤ ${plan.budgetMax} €`,
    placeLabel(plan.place, lang),
    energyLabel(plan.energy, lang),
    ...(vibeHint ? [vibeHint] : []),
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

function ConstraintsForm({
  constraints,
  setConstraints,
  lang,
  readOnly = false,
  showCount = true,
}: {
  constraints: Constraints;
  setConstraints: (fn: (c: Constraints) => Constraints) => void;
  lang: Lang;
  readOnly?: boolean;
  showCount?: boolean;
}) {
  const isEn = lang === "en";
  const matchCount = countMatchingPlans(constraints);
  const deckPreview = Math.min(6, matchCount);

  return (
    <div className="space-y-4">
      {showCount && !readOnly && (
        <div
          className="sticky top-[calc(3rem+env(safe-area-inset-top))] z-10 rounded-[var(--radius-ui)] border border-coral/20 bg-white/95 px-4 py-3 text-center shadow-sm backdrop-blur-sm sm:top-[calc(3.5rem+env(safe-area-inset-top))]"
          aria-live="polite"
        >
          {matchCount === 0 ? (
            <p className="text-sm font-semibold text-coral">
              {isEn ? "0 activities with this setup" : "0 activité avec ce cadre"}
            </p>
          ) : (
            <p className="text-sm font-semibold text-ink">
              <span className="font-[family-name:var(--font-display)] text-2xl font-extrabold text-coral">
                {matchCount}
              </span>{" "}
              {isEn
                ? `activit${matchCount > 1 ? "ies" : "y"} found`
                : `activité${matchCount > 1 ? "s" : ""} trouvée${matchCount > 1 ? "s" : ""}`}
            </p>
          )}
          <p className="mt-0.5 text-xs text-ink-soft">
            {matchCount === 0
              ? isEn
                ? "Try wider filters (time, budget, place...)."
                : "Élargis un filtre (durée, budget, lieu…)."
              : matchCount > 6
                ? isEn
                  ? `You will vote on ${deckPreview} · ${vibeLabel(constraints.vibe)}`
                  : `Tu en voteras ${deckPreview} · ${vibeLabel(constraints.vibe)}`
                : isEn
                  ? `You are voting on ${deckPreview} · ${vibeLabel(constraints.vibe)}`
                  : `Tu vas en voter ${deckPreview} · ${vibeLabel(constraints.vibe)}`}
          </p>
        </div>
      )}

      <div className="surface space-y-4 p-4 sm:space-y-5 sm:p-5">
        <ChoiceGroup
          label={isEn ? "Vibe" : "Ambiance"}
          options={vibeOptions}
          value={constraints.vibe}
          onChange={(vibe) => setConstraints((c) => ({ ...c, vibe }))}
          lang={lang}
          columns={4}
          disabled={readOnly}
        />
        <p className="-mt-2 text-xs leading-relaxed text-ink-soft">
          {constraints.vibe === "date"
            ? isEn
              ? "Calmer ideas for two — not a dating feed."
              : "Idées plus calmes / à deux — pas un feed de rencontres."
            : constraints.vibe === "groupe"
              ? isEn
                ? "Ideas that work for groups, indoors or outdoors."
                : "Plans qui marchent à plusieurs autour d’une table ou dehors."
              : constraints.vibe === "potes"
                ? isEn
                  ? "Simple outings and challenges with friends."
                  : "Sorties et défis simples entre amis."
                : isEn
                  ? "Mix all vibes."
                  : "On mélange toutes les ambiances."}
        </p>
        {constraints.vibe === "date" && (
          <p className="-mt-1 text-xs font-medium text-ink">
            {isEn
              ? "Reminder: not a dating app — only a vibe filter."
              : "Rappel : ce n’est pas une app de rencontres — juste une ambiance d’idées."}
          </p>
        )}
        <ChoiceGroup
          label={isEn ? "Duration" : "Durée"}
          options={durationOptions}
          value={constraints.duration}
          onChange={(duration) => setConstraints((c) => ({ ...c, duration }))}
          lang={lang}
          columns={4}
          disabled={readOnly}
        />
        <ChoiceGroup
          label="Budget"
          options={budgetOptions}
          value={constraints.budget}
          onChange={(budget) => setConstraints((c) => ({ ...c, budget }))}
          lang={lang}
          columns={4}
          disabled={readOnly}
        />
        <ChoiceGroup
          label={isEn ? "Energy" : "Énergie"}
          options={energyOptions}
          value={constraints.energy}
          onChange={(energy) => setConstraints((c) => ({ ...c, energy }))}
          lang={lang}
          columns={3}
          disabled={readOnly}
        />
        <ChoiceGroup
          label={isEn ? "Place" : "Lieu"}
          options={placeOptions}
          value={constraints.place}
          onChange={(place) => setConstraints((c) => ({ ...c, place }))}
          lang={lang}
          columns={3}
          disabled={readOnly}
        />
      </div>
    </div>
  );
}

function DemoBanner({ lang }: { lang: Lang }) {
  return (
    <div className="rounded-[var(--radius-ui)] border border-line bg-white p-3 shadow-sm sm:p-3.5">
      <p className="text-center text-xs leading-relaxed text-ink-soft">
        <span className="rounded-full bg-coral/10 px-2 py-0.5 font-semibold text-coral">
          Démo web
        </span>
        {" · "}
        {lang === "en"
          ? "same logic as the app (Basic). Mobile version is coming soon."
          : "même logique que l’app (Basique). La vraie version arrivera sur mobile."}
      </p>
    </div>
  );
}

function ConstraintsSummary({ constraints, lang }: { constraints: Constraints; lang: Lang }) {
  const localize = (label?: string) =>
    lang === "en"
      ? {
          Soirée: "Evening",
          Gratuit: "Free",
          "≤ 20 €": "<= 20 EUR",
          "≤ 50 €": "<= 50 EUR",
          "80 € +": "80 EUR +",
          Tranquille: "Calm",
          Normal: "Normal",
          Dynamique: "Dynamic",
          Dedans: "Indoor",
          Dehors: "Outdoor",
          "Peu importe": "Any",
          Potes: "Friends",
          Groupe: "Group",
          Date: "Date",
        }[label ?? ""] ?? label
      : label;
  const bits = [
    vibeLabel(constraints.vibe),
    localize(durationOptions.find((o) => o.value === constraints.duration)?.label),
    localize(budgetOptions.find((o) => o.value === constraints.budget)?.label),
    localize(energyOptions.find((o) => o.value === constraints.energy)?.label),
    localize(placeOptions.find((o) => o.value === constraints.place)?.label),
  ];
  return (
    <p className="surface px-4 py-3 text-sm leading-relaxed text-ink-soft">
      <span className="font-semibold text-ink">{lang === "en" ? "Setup" : "Cadre"}</span>
      {" · "}
      {bits.join(" · ")}
    </p>
  );
}

function RealAppNote({ lang }: { lang: Lang }) {
  return (
    <p className="rounded-[var(--radius-ui)] border border-line bg-foam px-3.5 py-3 text-xs leading-relaxed text-ink-soft">
      {lang === "en" ? (
        <>
          <span className="font-semibold text-ink">For two:</span> share code or link.
          In the real app, each person opens FlipOn directly.
        </>
      ) : (
        <>
          <span className="font-semibold text-ink">À deux :</span> partage le code
          ou le lien. Sur la vraie app, chacun ouvrira FlipOn directement — sans
          lien.
        </>
      )}
    </p>
  );
}

function humanizeDuoError(raw: string, lang: Lang): string {
  const t = raw.toLowerCase();
  if (t.includes("redis") || t.includes("503")) {
    return lang === "en"
      ? "Duo mode is unavailable right now (server). Try again soon or use solo mode."
      : "Le duo n’est pas dispo pour le moment (serveur). Réessaie dans un instant, ou teste en solo.";
  }
  if (t.includes("introuvable") || t.includes("404") || t.includes("code")) {
    return lang === "en"
      ? "Invalid code or expired session. Ask for a new code."
      : "Code invalide ou session expirée. Demande un nouveau code à l’autre.";
  }
  if (t.includes("expir") || t.includes("ferm")) {
    return lang === "en" ? "This session is over. Create a new one." : "Cette session est terminée. Crée-en une nouvelle.";
  }
  if (t.includes("network") || t.includes("fetch")) {
    return lang === "en" ? "No network. Check your connection and retry." : "Pas de réseau. Vérifie ta connexion et réessaie.";
  }
  return raw;
}

function VoteCard({
  current,
  index,
  total,
  progress,
  fly,
  onVote,
  privateLabel,
  lang,
}: {
  current: Plan;
  index: number;
  total: number;
  progress: number;
  fly: "left" | "right" | null;
  onVote: (yes: boolean) => void;
  privateLabel?: string;
  lang: Lang;
}) {
  const isEn = lang === "en";
  return (
    <div className="animate-rise space-y-4 pb-2">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
          {isEn ? "Would you do this?" : "Ça vous dit ?"}
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          {isEn ? "Idea" : "Idée"} {index + 1} {isEn ? "of" : "sur"} {total}
          {privateLabel ? (
            <>
              <span className="hidden sm:inline">{` · ${privateLabel}`}</span>
              <span className="mt-0.5 block text-xs sm:hidden">{privateLabel}</span>
            </>
          ) : null}
        </p>
        <p className="mt-1 text-xs text-ink-soft">
          {isEn
            ? "Your choices stay private until the final result."
            : "Tes choix restent privés jusqu’au résultat final."}
        </p>
      </div>

      <div
        className="h-1.5 overflow-hidden rounded-full bg-foam-deep"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={isEn ? "Vote progress" : "Progression du vote"}
      >
        <div
          className="h-full rounded-full bg-coral transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div
        className={[
          "surface min-h-[240px] border-coral/15 bg-white p-4 shadow-sm transition-all duration-200 sm:min-h-[280px] sm:p-5",
          fly === "right" ? "translate-x-6 opacity-0" : "",
          fly === "left" ? "-translate-x-6 opacity-0" : "",
        ].join(" ")}
      >
        <p className="text-xs font-semibold text-coral">{current.category}</p>
        <h3 className="mt-2 text-lg font-bold leading-snug text-ink sm:text-xl">
          {current.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft sm:text-[15px]">
          {current.blurb}
        </p>
        <MetaTags plan={current} lang={lang} />
      </div>

      <div className="vote-dock">
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={() => onVote(false)}
            className="btn-secondary min-h-12 w-full touch-manipulation"
            disabled={!!fly}
          >
            {isEn ? "No / Skip" : "Non / Passer"}
          </button>
          <button
            type="button"
            onClick={() => onVote(true)}
            className="btn-primary min-h-12 w-full touch-manipulation"
            disabled={!!fly}
          >
            {isEn ? "Yes" : "Oui, chaud"}
          </button>
        </div>
      </div>
    </div>
  );
}

function MatchView({
  matched,
  subtitle,
  onReset,
  lang,
}: {
  matched: Plan | null;
  subtitle: string;
  onReset: () => void;
  lang: Lang;
}) {
  const isEn = lang === "en";
  return (
    <div className="animate-rise space-y-5">
      <div>
        <p className="text-sm font-semibold text-coral">{isEn ? "Done" : "C’est bon"}</p>
        <h2 className="mt-1 text-xl font-bold tracking-tight text-ink sm:text-2xl">
          {isEn ? "Your idea" : "Votre idée"}
        </h2>
        <p className="mt-1.5 text-sm text-ink-soft">{subtitle}</p>
      </div>

      {matched ? (
        <div className="surface p-4 sm:p-5">
          <p className="text-xs font-semibold text-coral">{matched.category}</p>
          <h3 className="mt-2 text-lg font-bold text-ink sm:text-xl">{matched.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft sm:text-[15px]">
            {matched.blurb}
          </p>
          <MetaTags plan={matched} lang={lang} />
          <ol className="mt-5 space-y-3 border-t border-line pt-5">
            {matched.steps.map((s, i) => (
              <li key={s} className="flex gap-3 text-sm text-ink sm:text-[15px]">
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
          {isEn
            ? "No shared idea this time. Widen your setup, or say yes to at least one option and retry."
            : "Aucune idée en commun / retenue cette fois. Élargis le cadre, ou dis oui à au moins une proposition, puis réessaie."}
        </p>
      )}

      <FeedbackForm lang={lang} />

      <button type="button" onClick={onReset} className="btn-secondary w-full">
        {isEn ? "Restart" : "Recommencer"}
      </button>
    </div>
  );
}

export function FlipDemo({ lang = "fr" }: { lang?: Lang }) {
  const isEn = lang === "en";
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomFromUrl = searchParams.get("room")?.toUpperCase() ?? null;

  const [mode, setMode] = useState<Mode>(roomFromUrl ? "duo" : "pick");
  const [soloStep, setSoloStep] = useState<SoloStep>("constraints");
  const [duoPhase, setDuoPhase] = useState<DuoPhase>(
    roomFromUrl ? "lobby" : "constraints",
  );
  const [constraints, setConstraints] =
    useState<Constraints>(DEFAULT_CONSTRAINTS);
  const [deck, setDeck] = useState<Plan[]>([]);
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState<Plan[]>([]);
  const [fly, setFly] = useState<"left" | "right" | null>(null);
  const [matched, setMatched] = useState<Plan | null>(null);

  const [role, setRole] = useState<DuoRole | null>(roomFromUrl ? "guest" : null);
  const [roomId, setRoomId] = useState<string | null>(roomFromUrl);
  const [snapshot, setSnapshot] = useState<DuoPublicSnapshot | null>(null);
  const [joinCode, setJoinCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [joinBootstrapped, setJoinBootstrapped] = useState(false);

  const current = deck[index];
  const progress = useMemo(() => {
    if (!deck.length) return 0;
    return Math.min(100, Math.round(((index + 1) / deck.length) * 100));
  }, [deck.length, index]);

  const inActiveFlow =
    (mode === "solo" && soloStep === "swipe") ||
    (mode === "duo" &&
      (duoPhase === "swipe" ||
        duoPhase === "waiting" ||
        duoPhase === "lobby"));

  useEffect(() => {
    if (!inActiveFlow) return;
    const onLeave = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [inActiveFlow]);

  const persistRole = useCallback((id: string, r: DuoRole) => {
    try {
      sessionStorage.setItem(`flipon-duo-${id}`, r);
    } catch {
      /* private mode */
    }
  }, []);

  const readPersistedRole = useCallback((id: string): DuoRole | null => {
    try {
      const v = sessionStorage.getItem(`flipon-duo-${id}`);
      return v === "host" || v === "guest" ? v : null;
    } catch {
      return null;
    }
  }, []);

  const pollRoom = useCallback(async () => {
    if (!roomId || !role) return;
    try {
      const res = await fetch(`/api/duo/${roomId}?role=${role}`, {
        cache: "no-store",
      });
      if (!res.ok) return;
      const data = (await res.json()) as DuoPublicSnapshot;
      setSnapshot(data);
      setConstraints(data.constraints);

      if (data.bothReady && duoPhase === "lobby") {
        setDeck(data.deck);
        setIndex(0);
        setLiked([]);
        setDuoPhase("swipe");
      }

      if (data.bothVoted && (duoPhase === "waiting" || duoPhase === "swipe")) {
        setMatched(data.match);
        setDuoPhase("match");
      }
    } catch {
      /* ignore transient poll errors */
    }
  }, [roomId, role, duoPhase]);

  useEffect(() => {
    if (mode !== "duo" || !roomId || !role) return;
    if (duoPhase === "match" || duoPhase === "constraints") return;
    pollRoom();
    const id = window.setInterval(pollRoom, 1500);
    return () => window.clearInterval(id);
  }, [mode, roomId, role, duoPhase, pollRoom]);

  useEffect(() => {
    if (typeof window === "undefined" || !roomId) return;
    setShareUrl(`${window.location.origin}/test?room=${roomId}`);
  }, [roomId]);

  useEffect(() => {
    if (!roomFromUrl || joinBootstrapped || mode !== "duo") return;

    const existing = readPersistedRole(roomFromUrl);
    if (existing === "host") {
      setRole("host");
      setRoomId(roomFromUrl);
      setDuoPhase("lobby");
      setJoinBootstrapped(true);
      void (async () => {
        const res = await fetch(`/api/duo/${roomFromUrl}?role=host`, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = (await res.json()) as DuoPublicSnapshot;
          setSnapshot(data);
          setConstraints(data.constraints);
          setDeck(data.deck);
        }
      })();
      return;
    }

    let cancelled = false;
    (async () => {
      setBusy(true);
      setError(null);
      try {
        const res = await fetch(`/api/duo/${roomFromUrl}/join`, {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? (isEn ? "Cannot join" : "Impossible de rejoindre"));
        if (cancelled) return;
        setRole("guest");
        persistRole(data.room.id, "guest");
        setRoomId(data.room.id);
        setSnapshot(data.room);
        setConstraints(data.room.constraints);
        setDuoPhase("lobby");
        setJoinBootstrapped(true);
      } catch (e) {
        if (!cancelled) {
          setError(
            humanizeDuoError(e instanceof Error ? e.message : isEn ? "Network error" : "Erreur réseau", lang),
          );
          setMode("pick");
        }
      } finally {
        if (!cancelled) setBusy(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [
    roomFromUrl,
    joinBootstrapped,
    mode,
    persistRole,
    readPersistedRole,
  ]);

  function resetAll() {
    if (roomId) {
      void fetch(`/api/duo/${roomId}/close`, { method: "POST" }).catch(
        () => undefined,
      );
    }
    setMode("pick");
    setSoloStep("constraints");
    setDuoPhase("constraints");
    setConstraints(DEFAULT_CONSTRAINTS);
    setDeck([]);
    setIndex(0);
    setLiked([]);
    setFly(null);
    setMatched(null);
    setRole(null);
    setRoomId(null);
    setSnapshot(null);
    setJoinCode("");
    setError(null);
    setJoinBootstrapped(false);
    router.replace("/test");
  }

  function startSoloSwipe() {
    const pool = buildDeck(constraints);
    if (!pool.length) {
      setError(isEn ? "No idea for this setup — widen one filter." : "Aucun plan pour ce cadre — élargis un critère.");
      return;
    }
    setError(null);
    setDeck(pool);
    setIndex(0);
    setLiked([]);
    setMatched(null);
    setSoloStep("swipe");
  }

  function finishSolo(likes: Plan[]) {
    setMatched(likes[0] ?? null);
    setSoloStep("match");
  }

  function voteSolo(yes: boolean) {
    if (!current || fly) return;
    setFly(yes ? "right" : "left");
    const nextLiked = yes ? [...liked, current] : liked;
    window.setTimeout(() => {
      setFly(null);
      setLiked(nextLiked);
      const nextIndex = index + 1;
      if (nextIndex >= deck.length) finishSolo(nextLiked);
      else setIndex(nextIndex);
    }, 220);
  }

  async function createDuoSession() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/duo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ constraints }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? (isEn ? "Cannot create session" : "Création impossible"));
      setRole("host");
      persistRole(data.room.id, "host");
      setJoinBootstrapped(true);
      setRoomId(data.room.id);
      setSnapshot(data.room);
      setDeck(data.room.deck);
      setDuoPhase("lobby");
      router.replace(`/test?room=${data.room.id}`);
    } catch (e) {
      setError(
        humanizeDuoError(e instanceof Error ? e.message : isEn ? "Network error" : "Erreur réseau", lang),
      );
    } finally {
      setBusy(false);
    }
  }

  async function joinWithCode() {
    const code = joinCode.trim().toUpperCase();
    if (code.length < 4) {
      setError(
        isEn
          ? "Enter the 4-character code shown on the other phone"
          : "Entre le code à 4 caractères affiché sur l’autre téléphone",
      );
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/duo/${code}/join`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? (isEn ? "Invalid code" : "Code invalide"));
      setRole("guest");
      persistRole(data.room.id, "guest");
      setRoomId(data.room.id);
      setSnapshot(data.room);
      setConstraints(data.room.constraints);
      setDuoPhase("lobby");
      setJoinBootstrapped(true);
      router.replace(`/test?room=${data.room.id}`);
    } catch (e) {
      setError(
        humanizeDuoError(e instanceof Error ? e.message : isEn ? "Network error" : "Erreur réseau", lang),
      );
    } finally {
      setBusy(false);
    }
  }

  async function markReady() {
    if (!roomId || !role) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/duo/${roomId}/ready`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? (isEn ? "Action failed" : "Impossible"));
      setSnapshot(data);
      if (data.bothReady) {
        setDeck(data.deck);
        setIndex(0);
        setLiked([]);
        setDuoPhase("swipe");
      }
    } catch (e) {
      setError(
        humanizeDuoError(e instanceof Error ? e.message : isEn ? "Network error" : "Erreur réseau", lang),
      );
    } finally {
      setBusy(false);
    }
  }

  async function submitDuoVotes(likes: Plan[]) {
    if (!roomId || !role) return;
    setDuoPhase("waiting");
    try {
      const res = await fetch(`/api/duo/${roomId}/votes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          likedIds: likes.map((p) => p.id),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? (isEn ? "Submit failed" : "Envoi impossible"));
      setSnapshot(data);
      if (data.bothVoted) {
        setMatched(data.match);
        setDuoPhase("match");
      }
    } catch (e) {
      setError(
        humanizeDuoError(e instanceof Error ? e.message : isEn ? "Network error" : "Erreur réseau", lang),
      );
      setDuoPhase("swipe");
    }
  }

  function voteDuo(yes: boolean) {
    if (!current || fly) return;
    setFly(yes ? "right" : "left");
    const nextLiked = yes ? [...liked, current] : liked;
    window.setTimeout(() => {
      setFly(null);
      setLiked(nextLiked);
      const nextIndex = index + 1;
      if (nextIndex >= deck.length) void submitDuoVotes(nextLiked);
      else setIndex(nextIndex);
    }, 220);
  }

  async function copyLink() {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(isEn ? "Copy failed — copy the link manually." : "Copie impossible — sélectionne le lien à la main");
    }
  }

  const youReady =
    role === "host" ? snapshot?.hostReady : snapshot?.guestReady;
  const partnerReady =
    role === "host" ? snapshot?.guestReady : snapshot?.hostReady;

  /* ——— Mode pick ——— */
  if (mode === "pick") {
    return (
      <div className="mx-auto w-full max-w-md animate-rise space-y-4 sm:space-y-5">
        <DemoBanner lang={lang} />

        <div>
          <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
            {isEn ? "How do you want to test?" : "Comment tu testes ?"}
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
            {isEn
              ? "Same app logic: setup -> private vote -> one idea. Choose your mode."
              : "Même logique que l’app : cadre → vote privé → une idée. Choisis ton mode."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setMode("solo");
            setSoloStep("constraints");
          }}
          className="surface w-full bg-white p-4 text-left shadow-sm transition-colors hover:border-coral/40 active:scale-[0.99] sm:p-5"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-bold text-ink">{isEn ? "Solo · discover" : "Solo · découvrir"}</p>
              <p className="mt-1 text-sm text-ink-soft">
                {isEn
                  ? "2 minutes solo to experience the flow."
                  : "2 minutes seul·e pour voir le flux. Idéal pour comprendre."}
              </p>
            </div>
            <span className="rounded-full bg-foam px-2 py-1 text-[11px] font-semibold text-ink-soft">
              {isEn ? "Quick" : "Rapide"}
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            setMode("duo");
            setDuoPhase("constraints");
            setRole(null);
            setRoomId(null);
          }}
          className="surface w-full border-coral/30 bg-coral/[0.04] p-4 text-left shadow-sm transition-colors hover:border-coral/50 active:scale-[0.99] sm:p-5"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-bold text-ink">{isEn ? "Duo · real test" : "Duo · le vrai test"}</p>
              <p className="mt-1 text-sm text-ink-soft">
                {isEn
                  ? "2 phones. One creates the session, the other joins with the code. Private voting -> shared idea."
                  : "2 téléphones. Un crée la session, l’autre entre le code. Chacun vote en privé → une idée commune."}
              </p>
            </div>
            <span className="rounded-full bg-coral/10 px-2 py-1 text-[11px] font-semibold text-coral">
              {isEn ? "Recommended" : "Recommandé"}
            </span>
          </div>
        </button>

        {error && (
          <p className="text-sm font-medium text-coral" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }

  /* ——— Solo ——— */
  if (mode === "solo") {
    const stepIndex = STEPS_SOLO.findIndex((s) => s.id === soloStep);
    return (
      <div className="mx-auto w-full max-w-md">
        <Stepper
          labels={isEn ? ["Setup", "Vote", "Idea"] : STEPS_SOLO.map((s) => s.label)}
          currentIndex={stepIndex}
        />

        {soloStep === "constraints" && (
          <div className="animate-rise space-y-5 sm:space-y-6">
            <DemoBanner lang={lang} />
            <div>
              <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                {isEn ? "What is doable now?" : "Qu’est-ce qui est jouable ?"}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                {isEn
                  ? "Pick a vibe first, then your constraints. Ideas follow your choices."
                  : "Ambiance d’abord, puis le cadre. Les idées suivent tes choix."}
              </p>
            </div>
            <ConstraintsForm
              constraints={constraints}
              setConstraints={setConstraints}
              lang={lang}
            />
            {error && (
              <p className="text-sm font-medium text-coral" role="alert">
                {error}
              </p>
            )}
            <div className="surface space-y-2.5 border-coral/20 bg-white p-3 shadow-sm sm:p-3.5">
              <button
                type="button"
                onClick={startSoloSwipe}
                className="btn-primary w-full"
                disabled={countMatchingPlans(constraints) === 0}
              >
                {isEn ? "Start voting" : "Lancer le vote"}
              </button>
              <button
                type="button"
                onClick={resetAll}
                className="btn-secondary w-full"
              >
                {isEn ? "Back" : "Retour"}
              </button>
            </div>
          </div>
        )}

        {soloStep === "swipe" && current && (
          <VoteCard
            current={current}
            index={index}
            total={deck.length}
            progress={progress}
            fly={fly}
            onVote={voteSolo}
            privateLabel={
              isEn
                ? `Setup ${vibeLabel(constraints.vibe)}`
                : `Cadre ${vibeLabel(constraints.vibe)}`
            }
            lang={lang}
          />
        )}

        {soloStep === "swipe" && !current && (
          <div className="animate-rise space-y-4">
            <p className="text-sm text-ink-soft">
              {isEn
                ? "No more ideas in this deck. Change setup or restart."
                : "Plus d’idées dans ce deck. Recadre ou recommence."}
            </p>
            <button type="button" onClick={resetAll} className="btn-secondary w-full">
              {isEn ? "Restart" : "Recommencer"}
            </button>
          </div>
        )}

        {soloStep === "match" && (
          <MatchView
            matched={matched}
            subtitle={
              isEn
                ? `Solo (${vibeLabel(constraints.vibe)}): your first “yes” idea. In duo, it would be the overlap of both votes.`
                : `En solo (${vibeLabel(constraints.vibe)}) : ta première idée « oui ». À plusieurs, ce serait le croisement de vos votes.`
            }
            onReset={resetAll}
            lang={lang}
          />
        )}
      </div>
    );
  }

  /* ——— Duo ——— */
  const duoStepIndex =
    duoPhase === "constraints"
      ? 0
      : duoPhase === "lobby"
        ? 1
        : duoPhase === "swipe" || duoPhase === "waiting"
          ? 2
          : 3;

  return (
    <div className="mx-auto w-full max-w-md">
      <Stepper
          labels={isEn ? ["Setup", "Duo", "Vote", "Idea"] : ["Cadre", "Duo", "Vote", "Idée"]}
        currentIndex={duoStepIndex}
      />

      {error && (
        <p className="mb-4 text-sm font-medium text-coral" role="alert">
          {error}
        </p>
      )}

      {duoPhase === "constraints" && !role && (
        <div className="animate-rise space-y-5 sm:space-y-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
              {isEn ? "Create or join" : "Créer ou rejoindre"}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
              {isEn
                ? "One phone sets the setup and creates the session. The other joins with the code."
                : "Un téléphone fixe le cadre et crée la session. L’autre rejoint avec le code."}
            </p>
          </div>

          <RealAppNote lang={lang} />

          <ConstraintsForm
            constraints={constraints}
            setConstraints={setConstraints}
              lang={lang}
          />

          <button
            type="button"
            onClick={createDuoSession}
            className="btn-primary w-full"
            disabled={busy || countMatchingPlans(constraints) === 0}
          >
            {busy ? (isEn ? "Creating..." : "Création…") : isEn ? "Create session" : "Créer la session"}
          </button>

          <div className="relative py-2 text-center text-xs font-medium text-ink-soft">
            <span className="bg-[var(--petal)] relative z-10 px-2">{isEn ? "or" : "ou"}</span>
            <span
              className="absolute left-0 right-0 top-1/2 h-px bg-line"
              aria-hidden
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="CODE"
              maxLength={6}
              inputMode="text"
              autoCapitalize="characters"
              autoCorrect="off"
              className="min-h-12 w-full flex-1 rounded-[var(--radius-ui)] border border-line bg-white px-3 text-center text-lg font-bold tracking-[0.2em] text-ink outline-none focus:border-coral sm:text-base"
              aria-label={isEn ? "Session code" : "Code de session"}
            />
            <button
              type="button"
              onClick={joinWithCode}
              className="btn-secondary w-full shrink-0 sm:w-auto sm:px-4"
              disabled={busy}
            >
              {isEn ? "Join" : "Rejoindre"}
            </button>
          </div>

          <button
            type="button"
            onClick={resetAll}
            className="w-full text-sm font-medium text-ink-soft hover:text-ink"
          >
            {isEn ? "Back" : "Retour"}
          </button>
        </div>
      )}

      {duoPhase === "lobby" && role && snapshot && (
        <div className="animate-rise space-y-4 sm:space-y-5">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
              {role === "host" ? (isEn ? "Invite your partner" : "Invite l’autre") : isEn ? "You joined" : "Tu as rejoint"}
            </h2>
            <p className="mt-1.5 text-sm text-ink-soft">
              {role === "host"
                ? isEn
                  ? "Share code or link. Then both of you confirm you're ready."
                  : "Envoie le code ou le lien. Ensuite vous validez tous les deux."
                : isEn
                  ? "Setup is already fixed. Confirm when you are ready."
                  : "Le cadre est déjà fixé. Dis que tu es prêt·e quand vous y êtes."}
            </p>
          </div>

          <RealAppNote lang={lang} />

          <ConstraintsSummary constraints={constraints} lang={lang} />

          <div className="surface border-coral/25 bg-white p-4 text-center shadow-sm sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
              {isEn ? "Code" : "Code"}
            </p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-[0.2em] text-ink sm:text-4xl sm:tracking-[0.25em]">
              {snapshot.id}
            </p>
            {shareUrl && role === "host" && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(shareUrl)}`}
                  alt={isEn ? "QR code to join session" : "QR code pour rejoindre la session"}
                  width={140}
                  height={140}
                  className="mx-auto mt-4 h-[140px] w-[140px] rounded-lg border border-line bg-white p-2 sm:h-[160px] sm:w-[160px]"
                />
                <p className="mt-3 break-all px-1 text-[11px] leading-relaxed text-ink-soft sm:text-xs">
                  {shareUrl}
                </p>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={copyLink}
                    className="btn-secondary w-full"
                  >
                    {copied ? (isEn ? "Link copied" : "Lien copié") : isEn ? "Copy link" : "Copier le lien"}
                  </button>
                  {"share" in navigator ? (
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await navigator.share({
                            title: isEn ? "FlipOn — join session" : "FlipOn — rejoins la session",
                            text: isEn
                              ? `Join my FlipOn session. Code ${snapshot.id}`
                              : `Rejoins ma session FlipOn. Code ${snapshot.id}`,
                            url: shareUrl,
                          });
                        } catch {
                          /* dismissed */
                        }
                      }}
                      className="btn-primary w-full"
                    >
                      {isEn ? "Share" : "Partager"}
                    </button>
                  ) : (
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(
                        isEn
                          ? `Join my FlipOn session! Code ${snapshot.id} — ${shareUrl}`
                          : `Rejoins ma session FlipOn ! Code ${snapshot.id} — ${shareUrl}`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary w-full text-center"
                    >
                      WhatsApp
                    </a>
                  )}
                </div>
              </>
            )}
          </div>

          {role === "guest" && (
            <p className="text-center text-xs text-ink-soft">
              {isEn
                ? "Setup is fixed by host — you cannot edit it."
                : "Cadre fixé par l’hôte — tu ne peux pas le modifier."}
            </p>
          )}

          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-between rounded-[var(--radius-ui)] border border-line bg-white px-3 py-2.5 shadow-sm">
              <span className="text-ink-soft">
                {role === "host"
                  ? isEn
                    ? "You (host)"
                    : "Toi (hôte)"
                  : isEn
                    ? "Partner (host)"
                    : "L’autre (hôte)"}
              </span>
              <span className="font-semibold text-ink">
                {snapshot.hostReady ? (isEn ? "Ready" : "Prêt") : isEn ? "Waiting" : "En attente"}
              </span>
            </li>
            <li className="flex items-center justify-between rounded-[var(--radius-ui)] border border-line bg-white px-3 py-2.5 shadow-sm">
              <span className="text-ink-soft">
                {role === "guest"
                  ? isEn
                    ? "You (guest)"
                    : "Toi (invité)"
                  : isEn
                    ? "Partner (guest)"
                    : "L’autre (invité)"}
              </span>
              <span className="font-semibold text-ink">
                {!snapshot.guestJoined
                  ? isEn
                    ? "Not joined yet"
                    : "Pas encore là"
                  : snapshot.guestReady
                    ? isEn
                      ? "Ready"
                      : "Prêt"
                    : isEn
                      ? "Waiting"
                      : "En attente"}
              </span>
            </li>
          </ul>

          {!youReady && (role === "guest" || snapshot.guestJoined) && (
            <button
              type="button"
              onClick={markReady}
              className="btn-primary w-full"
              disabled={busy || (role === "host" && !snapshot.guestJoined)}
            >
              {busy ? "…" : isEn ? "I am ready" : "Je suis prêt·e"}
            </button>
          )}

          {youReady && !partnerReady && (
            <div className="rounded-[var(--radius-ui)] border border-coral/20 bg-foam px-4 py-4 text-center shadow-sm">
              <div className="mx-auto h-8 w-8 animate-pulse rounded-full bg-coral/35" />
              <p className="mt-3 text-sm font-semibold text-ink">
                {isEn ? "Waiting for partner..." : "En attente de l’autre…"}
              </p>
              <p className="mt-1 text-xs text-ink-soft">
                {isEn
                  ? "Keep this screen open. Voting starts as soon as the other person is ready."
                  : "Garde cet écran ouvert. Dès que l’autre est prêt·e, le vote démarre."}
              </p>
            </div>
          )}

          {role === "host" && !snapshot.guestJoined && (
            <div className="rounded-[var(--radius-ui)] border border-line bg-foam px-4 py-4 text-center shadow-sm">
              <p className="text-sm font-semibold text-ink">
                {isEn ? "Waiting for partner to join..." : "En attente que l’autre rejoigne…"}
              </p>
              <p className="mt-1 text-xs text-ink-soft">
                {isEn ? "Share code " : "Envoie le code "}
                <span className="font-bold text-ink">{snapshot.id}</span>{" "}
                {isEn
                  ? "or link. This page updates automatically."
                  : "ou le lien. L’écran se met à jour tout seul."}
              </p>
            </div>
          )}
        </div>
      )}

      {duoPhase === "swipe" && current && (
        <VoteCard
          current={current}
          index={index}
          total={deck.length}
          progress={progress}
          fly={fly}
          onVote={voteDuo}
          privateLabel={isEn ? "partner cannot see your choices" : "l’autre ne voit pas tes choix"}
          lang={lang}
        />
      )}

      {duoPhase === "waiting" && (
        <div className="animate-rise space-y-4 rounded-[var(--radius-ui)] border border-coral/20 bg-white py-8 text-center shadow-sm">
          <div className="mx-auto h-10 w-10 animate-pulse rounded-full bg-coral/40" />
          <h2 className="text-xl font-bold text-ink">{isEn ? "Votes sent" : "Votes envoyés"}</h2>
          <p className="mx-auto max-w-xs text-sm text-ink-soft">
            {isEn
              ? "Waiting for the other person to finish... FlipOn will cross your yes votes. Keep this screen open."
              : "En attente que l’autre finisse… FlipOn croisera vos oui. Garde cet écran ouvert."}
          </p>
        </div>
      )}

      {duoPhase === "match" && (
        <MatchView
          matched={matched}
          subtitle={
            isEn
              ? `Intersection of your private votes · ${vibeLabel(constraints.vibe)} setup.`
              : `Intersection de vos votes privés · cadre ${vibeLabel(constraints.vibe)}.`
          }
          onReset={resetAll}
          lang={lang}
        />
      )}

      {busy && duoPhase === "lobby" && !snapshot && (
        <p className="text-center text-sm text-ink-soft">{isEn ? "Connecting..." : "Connexion…"}</p>
      )}
    </div>
  );
}
