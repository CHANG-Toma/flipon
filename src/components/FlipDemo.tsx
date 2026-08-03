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
    <ol className="mb-6 flex items-start gap-1 sm:mb-8 sm:items-center sm:gap-2" aria-label="Étapes">
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
  columns = 2,
  disabled = false,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
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
              {opt.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function placeLabel(p: Plan["place"]): string {
  return p === "dedans" ? "Dedans" : "Dehors";
}

function energyLabel(e: Energy): string {
  switch (e) {
    case "basse":
      return "Tranquille";
    case "haute":
      return "Dynamique";
    default:
      return "Normal";
  }
}

function MetaTags({ plan }: { plan: Plan }) {
  const vibeHint =
    plan.vibes.length === 1
      ? vibeLabel(plan.vibes[0])
      : plan.vibes.includes("date") && plan.vibes.length <= 2
        ? "idéal à deux"
        : null;

  const tags = [
    `~${plan.durationMin} min`,
    plan.budgetMax === 0 ? "Gratuit" : `≤ ${plan.budgetMax} €`,
    placeLabel(plan.place),
    energyLabel(plan.energy),
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
  readOnly = false,
  showCount = true,
}: {
  constraints: Constraints;
  setConstraints: (fn: (c: Constraints) => Constraints) => void;
  readOnly?: boolean;
  showCount?: boolean;
}) {
  const matchCount = countMatchingPlans(constraints);

  return (
    <div className="space-y-4">
      <div className="surface space-y-4 p-4 sm:space-y-5 sm:p-5">
        <ChoiceGroup
          label="Ambiance"
          options={vibeOptions}
          value={constraints.vibe}
          onChange={(vibe) => setConstraints((c) => ({ ...c, vibe }))}
          columns={4}
          disabled={readOnly}
        />
        <p className="-mt-2 text-xs leading-relaxed text-ink-soft">
          {constraints.vibe === "date"
            ? "Idées plus calmes / à deux — pas un feed de rencontres."
            : constraints.vibe === "groupe"
              ? "Plans qui marchent à plusieurs autour d’une table ou dehors."
              : constraints.vibe === "potes"
                ? "Sorties et défis simples entre amis."
                : "On mélange toutes les ambiances."}
        </p>
        <ChoiceGroup
          label="Durée"
          options={durationOptions}
          value={constraints.duration}
          onChange={(duration) => setConstraints((c) => ({ ...c, duration }))}
          columns={4}
          disabled={readOnly}
        />
        <ChoiceGroup
          label="Budget"
          options={budgetOptions}
          value={constraints.budget}
          onChange={(budget) => setConstraints((c) => ({ ...c, budget }))}
          columns={4}
          disabled={readOnly}
        />
        <ChoiceGroup
          label="Énergie"
          options={energyOptions}
          value={constraints.energy}
          onChange={(energy) => setConstraints((c) => ({ ...c, energy }))}
          columns={3}
          disabled={readOnly}
        />
        <ChoiceGroup
          label="Lieu"
          options={placeOptions}
          value={constraints.place}
          onChange={(place) => setConstraints((c) => ({ ...c, place }))}
          columns={3}
          disabled={readOnly}
        />
      </div>

      {showCount && !readOnly && (
        <p className="text-center text-sm text-ink-soft" aria-live="polite">
          {matchCount === 0
            ? "Aucun plan avec ce cadre — élargis un critère."
            : matchCount <= 6
              ? `${matchCount} idée${matchCount > 1 ? "s" : ""} à voter · ${vibeLabel(constraints.vibe)}`
              : `Jusqu’à 6 idées à voter · ${matchCount} collent · ${vibeLabel(constraints.vibe)}`}
        </p>
      )}
    </div>
  );
}

function ConstraintsSummary({ constraints }: { constraints: Constraints }) {
  const bits = [
    vibeLabel(constraints.vibe),
    durationOptions.find((o) => o.value === constraints.duration)?.label,
    budgetOptions.find((o) => o.value === constraints.budget)?.label,
    energyOptions.find((o) => o.value === constraints.energy)?.label,
    placeOptions.find((o) => o.value === constraints.place)?.label,
  ];
  return (
    <p className="surface px-4 py-3 text-sm leading-relaxed text-ink-soft">
      <span className="font-semibold text-ink">Cadre</span>
      {" · "}
      {bits.join(" · ")}
    </p>
  );
}

function RealAppNote() {
  return (
    <p className="rounded-[var(--radius-ui)] border border-line bg-foam px-3.5 py-3 text-xs leading-relaxed text-ink-soft">
      <span className="font-semibold text-ink">Démo :</span> vous partagez un
      lien ou un code. Sur la vraie application, les deux devront ouvrir FlipOn
      directement (duo lié) — pas besoin de lien.
    </p>
  );
}

function VoteCard({
  current,
  index,
  total,
  progress,
  fly,
  onVote,
  privateLabel,
}: {
  current: Plan;
  index: number;
  total: number;
  progress: number;
  fly: "left" | "right" | null;
  onVote: (yes: boolean) => void;
  privateLabel?: string;
}) {
  return (
    <div className="animate-rise space-y-4 pb-2">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
          Ça vous dit ?
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          Idée {index + 1} sur {total}
          {privateLabel ? (
            <>
              <span className="hidden sm:inline">{` · ${privateLabel}`}</span>
              <span className="mt-0.5 block text-xs sm:hidden">{privateLabel}</span>
            </>
          ) : null}
        </p>
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
          "surface min-h-[240px] p-4 transition-all duration-200 sm:min-h-[280px] sm:p-5",
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
        <MetaTags plan={current} />
      </div>

      <div className="vote-dock">
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={() => onVote(false)}
            className="btn-secondary w-full"
            disabled={!!fly}
          >
            Passer
          </button>
          <button
            type="button"
            onClick={() => onVote(true)}
            className="btn-primary w-full"
            disabled={!!fly}
          >
            Oui
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
}: {
  matched: Plan | null;
  subtitle: string;
  onReset: () => void;
}) {
  return (
    <div className="animate-rise space-y-5">
      <div>
        <p className="text-sm font-semibold text-coral">C’est bon</p>
        <h2 className="mt-1 text-xl font-bold tracking-tight text-ink sm:text-2xl">
          Votre idée
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
          <MetaTags plan={matched} />
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
          Aucune idée retenue cette fois. Élargis le cadre ou dis oui à au moins
          une proposition, puis réessaie.
        </p>
      )}

      <button type="button" onClick={onReset} className="btn-secondary w-full">
        Recommencer
      </button>
    </div>
  );
}

export function FlipDemo() {
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
        if (!res.ok) throw new Error(data.error ?? "Impossible de rejoindre");
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
          setError(e instanceof Error ? e.message : "Erreur");
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
      setError("Aucun plan pour ce cadre — élargis un critère.");
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
      if (!res.ok) throw new Error(data.error ?? "Création impossible");
      setRole("host");
      persistRole(data.room.id, "host");
      setJoinBootstrapped(true);
      setRoomId(data.room.id);
      setSnapshot(data.room);
      setDeck(data.room.deck);
      setDuoPhase("lobby");
      router.replace(`/test?room=${data.room.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusy(false);
    }
  }

  async function joinWithCode() {
    const code = joinCode.trim().toUpperCase();
    if (code.length < 4) {
      setError("Entre le code à 4 caractères");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/duo/${code}/join`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Code invalide");
      setRole("guest");
      persistRole(data.room.id, "guest");
      setRoomId(data.room.id);
      setSnapshot(data.room);
      setConstraints(data.room.constraints);
      setDuoPhase("lobby");
      setJoinBootstrapped(true);
      router.replace(`/test?room=${data.room.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
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
      if (!res.ok) throw new Error(data.error ?? "Impossible");
      setSnapshot(data);
      if (data.bothReady) {
        setDeck(data.deck);
        setIndex(0);
        setLiked([]);
        setDuoPhase("swipe");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
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
      if (!res.ok) throw new Error(data.error ?? "Envoi impossible");
      setSnapshot(data);
      if (data.bothVoted) {
        setMatched(data.match);
        setDuoPhase("match");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
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
      setError("Copie impossible — sélectionne le lien à la main");
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
        <div>
          <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
            Comment vous testez ?
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
            Solo pour tester vite, ou avec quelqu’un d’autre sur 2 téléphones.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setMode("solo");
            setSoloStep("constraints");
          }}
          className="surface w-full p-4 text-left transition-colors hover:border-coral/40 active:scale-[0.99] sm:p-5"
        >
          <p className="font-bold text-ink">Solo</p>
          <p className="mt-1 text-sm text-ink-soft">
            Tu votes seul·e pour voir le flux.
          </p>
        </button>

        <button
          type="button"
          onClick={() => {
            setMode("duo");
            setDuoPhase("constraints");
            setRole(null);
            setRoomId(null);
          }}
          className="surface w-full p-4 text-left transition-colors hover:border-coral/40 active:scale-[0.99] sm:p-5"
        >
          <p className="font-bold text-ink">Avec quelqu’un · 2 téléphones</p>
          <p className="mt-1 text-sm text-ink-soft">
            Tu crées la session, l’autre rejoint avec le code. Chacun vote en
            privé, puis une idée commune.
          </p>
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
          labels={STEPS_SOLO.map((s) => s.label)}
          currentIndex={stepIndex}
        />

        {soloStep === "constraints" && (
          <div className="animate-rise space-y-5 sm:space-y-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                Qu’est-ce qui est jouable ?
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                Ambiance d’abord, puis le cadre. Les idées suivent tes choix —
                pas une liste générique.
              </p>
            </div>
            <ConstraintsForm
              constraints={constraints}
              setConstraints={setConstraints}
            />
            {error && (
              <p className="text-sm font-medium text-coral" role="alert">
                {error}
              </p>
            )}
            <button
              type="button"
              onClick={startSoloSwipe}
              className="btn-primary w-full"
              disabled={countMatchingPlans(constraints) === 0}
            >
              Voir des idées
            </button>
            <button
              type="button"
              onClick={resetAll}
              className="btn-secondary w-full"
            >
              Retour
            </button>
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
            privateLabel={`Cadre ${vibeLabel(constraints.vibe)}`}
          />
        )}

        {soloStep === "swipe" && !current && (
          <div className="animate-rise space-y-4">
            <p className="text-sm text-ink-soft">
              Plus d’idées dans ce deck. Recadre ou recommence.
            </p>
            <button type="button" onClick={resetAll} className="btn-secondary w-full">
              Recommencer
            </button>
          </div>
        )}

        {soloStep === "match" && (
          <MatchView
            matched={matched}
            subtitle={`En solo (${vibeLabel(constraints.vibe)}) : ta première idée « oui ». À plusieurs, ce serait le croisement de vos votes.`}
            onReset={resetAll}
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
        labels={["Cadre", "Duo", "Vote", "Idée"]}
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
              Créer ou rejoindre
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
              Un téléphone fixe le cadre et crée la session. L’autre rejoint
              avec le code.
            </p>
          </div>

          <RealAppNote />

          <ConstraintsForm
            constraints={constraints}
            setConstraints={setConstraints}
          />

          <button
            type="button"
            onClick={createDuoSession}
            className="btn-primary w-full"
            disabled={busy || countMatchingPlans(constraints) === 0}
          >
            {busy ? "Création…" : "Créer la session"}
          </button>

          <div className="relative py-2 text-center text-xs font-medium text-ink-soft">
            <span className="bg-[var(--petal)] relative z-10 px-2">ou</span>
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
              aria-label="Code de session"
            />
            <button
              type="button"
              onClick={joinWithCode}
              className="btn-secondary w-full shrink-0 sm:w-auto sm:px-4"
              disabled={busy}
            >
              Rejoindre
            </button>
          </div>

          <button
            type="button"
            onClick={resetAll}
            className="w-full text-sm font-medium text-ink-soft hover:text-ink"
          >
            Retour
          </button>
        </div>
      )}

      {duoPhase === "lobby" && role && snapshot && (
        <div className="animate-rise space-y-4 sm:space-y-5">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
              {role === "host" ? "Invite l’autre" : "Tu as rejoint"}
            </h2>
            <p className="mt-1.5 text-sm text-ink-soft">
              {role === "host"
                ? "Envoie le code ou le lien. Ensuite vous validez tous les deux."
                : "Le cadre est déjà fixé. Dis que tu es prêt·e quand vous y êtes."}
            </p>
          </div>

          <RealAppNote />

          <ConstraintsSummary constraints={constraints} />

          <div className="surface p-4 text-center sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Code
            </p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-[0.2em] text-ink sm:text-4xl sm:tracking-[0.25em]">
              {snapshot.id}
            </p>
            {shareUrl && role === "host" && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(shareUrl)}`}
                  alt="QR code pour rejoindre la session"
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
                    {copied ? "Lien copié" : "Copier le lien"}
                  </button>
                  {"share" in navigator && (
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await navigator.share({
                            title: "FlipOn — rejoins la session",
                            text: `Code ${snapshot.id}`,
                            url: shareUrl,
                          });
                        } catch {
                          /* dismissed */
                        }
                      }}
                      className="btn-primary w-full"
                    >
                      Partager
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          {role === "guest" && (
            <p className="text-center text-xs text-ink-soft">
              Cadre fixé par l’hôte — tu ne peux pas le modifier.
            </p>
          )}

          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-between rounded-[var(--radius-ui)] border border-line bg-white px-3 py-2.5">
              <span className="text-ink-soft">
                {role === "host" ? "Toi (hôte)" : "L’autre (hôte)"}
              </span>
              <span className="font-semibold text-ink">
                {snapshot.hostReady ? "Prêt" : "En attente"}
              </span>
            </li>
            <li className="flex items-center justify-between rounded-[var(--radius-ui)] border border-line bg-white px-3 py-2.5">
              <span className="text-ink-soft">
                {role === "guest" ? "Toi (invité)" : "L’autre (invité)"}
              </span>
              <span className="font-semibold text-ink">
                {!snapshot.guestJoined
                  ? "Pas encore là"
                  : snapshot.guestReady
                    ? "Prêt"
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
              {busy ? "…" : "Je suis prêt·e"}
            </button>
          )}

          {youReady && !partnerReady && (
            <p className="text-center text-sm font-medium text-ink-soft">
              En attente de l’autre…
            </p>
          )}

          {role === "host" && !snapshot.guestJoined && (
            <p className="text-center text-sm font-medium text-ink-soft">
              En attente que l’autre rejoigne…
            </p>
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
          privateLabel="l’autre ne voit pas"
        />
      )}

      {duoPhase === "waiting" && (
        <div className="animate-rise space-y-4 py-8 text-center">
          <div className="mx-auto h-10 w-10 animate-pulse rounded-full bg-coral/40" />
          <h2 className="text-xl font-bold text-ink">Votes envoyés</h2>
          <p className="text-sm text-ink-soft">
            En attente que l’autre finisse… FlipOn croisera vos oui.
          </p>
        </div>
      )}

      {duoPhase === "match" && (
        <MatchView
          matched={matched}
          subtitle={`Intersection de vos votes privés · cadre ${vibeLabel(constraints.vibe)}.`}
          onReset={resetAll}
        />
      )}

      {busy && duoPhase === "lobby" && !snapshot && (
        <p className="text-center text-sm text-ink-soft">Connexion…</p>
      )}
    </div>
  );
}
