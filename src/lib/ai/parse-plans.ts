/**
 * Validation / normalisation d’un deck Plan issu de l’IA ou des POIs.
 */
import type {
  Constraints,
  Energy,
  Plan,
  PlanRoadmapStep,
  Vibe,
} from "@/data/plans";
import { budgetToMax, durationToMin } from "@/data/plans";

const ENERGIES: Energy[] = ["basse", "moyenne", "haute"];
const VIBES: Exclude<Vibe, "peu-importe">[] = ["potes", "groupe", "date"];
const PHASES = ["Avant", "Sur place", "Après"] as const;

function asString(v: unknown, max = 160): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}

function asSteps(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((s) => asString(s, 180))
    .filter(Boolean)
    .slice(0, 6);
}

function asRoadmap(v: unknown): PlanRoadmapStep[] {
  if (!Array.isArray(v)) return [];
  const out: PlanRoadmapStep[] = [];
  for (const item of v) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const title = asString(o.title, 80);
    const detail = asString(o.detail, 220);
    if (!title || !detail) continue;
    const phaseRaw = asString(o.phase, 24);
    const phase =
      PHASES.find((p) => p.toLowerCase() === phaseRaw.toLowerCase()) ||
      phaseRaw ||
      "Sur place";
    const minutes =
      typeof o.minutes === "number" && Number.isFinite(o.minutes)
        ? Math.min(180, Math.max(5, Math.round(o.minutes)))
        : undefined;
    out.push({ phase, title, detail, minutes });
    if (out.length >= 8) break;
  }
  return out;
}

function roadmapFromSteps(steps: string[], durationMin: number): PlanRoadmapStep[] {
  if (steps.length === 0) return [];
  const phases: Array<(typeof PHASES)[number]> = ["Avant", "Sur place", "Sur place", "Après"];
  const slice = Math.max(1, Math.floor(durationMin / Math.max(steps.length, 1)));
  return steps.map((s, i) => ({
    phase: phases[Math.min(i, phases.length - 1)]!,
    title: s.length > 48 ? `${s.slice(0, 45)}…` : s,
    detail: s,
    minutes: slice,
  }));
}

function asVibes(v: unknown, fallback: Constraints["vibe"]): Plan["vibes"] {
  const fromArr = Array.isArray(v)
    ? v.filter((x): x is Exclude<Vibe, "peu-importe"> =>
        VIBES.includes(x as Exclude<Vibe, "peu-importe">),
      )
    : [];
  if (fromArr.length) return fromArr.slice(0, 3);
  if (fallback && fallback !== "peu-importe") return [fallback];
  return ["potes"];
}

export function normalizeAiPlan(
  raw: unknown,
  index: number,
  constraints: Constraints,
): Plan | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const title = asString(o.title, 80);
  const blurb = asString(o.blurb, 220);
  let steps = asSteps(o.steps);
  let roadmap = asRoadmap(o.roadmap);
  if (!title || !blurb) return null;
  if (steps.length < 2 && roadmap.length < 2) return null;

  if (steps.length < 2 && roadmap.length >= 2) {
    steps = roadmap.map((r) => r.title);
  }
  if (roadmap.length < 2 && steps.length >= 2) {
    roadmap = roadmapFromSteps(steps, durationToMin(constraints.duration));
  }

  const place =
    o.place === "dedans" || o.place === "dehors"
      ? o.place
      : constraints.place === "dedans" || constraints.place === "dehors"
        ? constraints.place
        : "dehors";

  const energy = ENERGIES.includes(o.energy as Energy)
    ? (o.energy as Energy)
    : constraints.energy;

  const durationCap = durationToMin(constraints.duration);
  const durationMin =
    typeof o.durationMin === "number" && Number.isFinite(o.durationMin)
      ? Math.min(durationCap + 30, Math.max(20, Math.round(o.durationMin)))
      : Math.min(durationCap, 90);

  const budgetCap = budgetToMax(constraints.budget);
  const budgetMax =
    typeof o.budgetMax === "number" && Number.isFinite(o.budgetMax)
      ? Math.min(budgetCap === 999 ? 120 : budgetCap, Math.max(0, Math.round(o.budgetMax)))
      : Math.min(budgetCap === 999 ? 40 : budgetCap, 30);

  return {
    id: `ai-${index + 1}-${title
      .toLowerCase()
      .replace(/[^a-z0-9àâäéèêëïîôùûüç]+/gi, "-")
      .slice(0, 24)}`,
    title,
    blurb,
    steps,
    roadmap,
    durationMin,
    budgetMax,
    energy,
    place,
    category: asString(o.category, 40) || "local",
    vibes: asVibes(o.vibes, constraints.vibe),
  };
}

export function normalizeAiDeck(
  raw: unknown,
  constraints: Constraints,
): Plan[] {
  let list: unknown[] = [];
  if (Array.isArray(raw)) list = raw;
  else if (raw && typeof raw === "object") {
    const o = raw as Record<string, unknown>;
    if (Array.isArray(o.plans)) list = o.plans;
    else if (Array.isArray(o.ideas)) list = o.ideas;
  }

  const out: Plan[] = [];
  const seen = new Set<string>();
  for (const item of list) {
    const plan = normalizeAiPlan(item, out.length, constraints);
    if (!plan) continue;
    const key = plan.title.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(plan);
    if (out.length >= 6) break;
  }
  return out;
}

/** Filet sans IA : idées ancrées sur de vrais POIs, templates variés. */
export function plansFromPois(
  pois: { name: string; category: string }[],
  constraints: Constraints,
  cityLabel: string,
): Plan[] {
  const placeDefault =
    constraints.place === "dedans"
      ? "dedans"
      : constraints.place === "dehors"
        ? "dehors"
        : "dehors";

  const indoorCats = new Set([
    "café",
    "restaurant",
    "bar",
    "cinéma",
    "musée",
    "bibliothèque",
    "boulangerie",
  ]);

  type Tpl = {
    title: string;
    blurb: string;
    steps: string[];
    roadmap: PlanRoadmapStep[];
    category: string;
    place: Plan["place"];
  };

  const builders: Array<(p: { name: string; category: string }) => Tpl> = [
    (p) => ({
      title: `Escapade express : ${p.name}`,
      blurb: `Un vrai spot (${p.category}) près de ${cityLabel}, rythme court et concret.`,
      steps: [
        `Te rendre à ${p.name}`,
        "Poser les téléphones 25 min",
        "Choisir 1 moment à prolonger ou à refaire",
      ],
      roadmap: [
        {
          phase: "Avant",
          title: "Se mettre d’accord",
          detail: `Fixer un horaire et un budget pour ${p.name}.`,
          minutes: 10,
        },
        {
          phase: "Sur place",
          title: `Arrivée à ${p.name}`,
          detail: "Commander / entrer, téléphones en mode silencieux.",
          minutes: 15,
        },
        {
          phase: "Sur place",
          title: "Moment principal",
          detail: "Une seule activité ici : manger, regarder ou discuter sans scroll.",
          minutes: 30,
        },
        {
          phase: "Après",
          title: "Verdict express",
          detail: "Noter : à refaire / à éviter. Photo souvenir optionnelle.",
          minutes: 5,
        },
      ],
      category: p.category,
      place: indoorCats.has(p.category) ? "dedans" : "dehors",
    }),
    (p) => ({
      title: `Parcours départ ${p.name}`,
      blurb: `Utiliser ${p.name} comme point A pour une mini-exploration de quartier.`,
      steps: [
        `Point de départ : ${p.name}`,
        "Marcher 15–20 min en mode découverte",
        "Élire le moment préféré du trajet",
      ],
      roadmap: [
        {
          phase: "Avant",
          title: "Check météo & chaussures",
          detail: "Prévoir une couche + 1 règle : pas de réseaux pendant la marche.",
          minutes: 5,
        },
        {
          phase: "Sur place",
          title: `Départ ${p.name}`,
          detail: "Choisir une direction au hasard (pile ou face).",
          minutes: 10,
        },
        {
          phase: "Sur place",
          title: "Boucle découverte",
          detail: "S’arrêter 2 fois pour observer / goûter / photographier.",
          minutes: 40,
        },
        {
          phase: "Après",
          title: "Retour & classement",
          detail: "Classer 1 coup de cœur du parcours.",
          minutes: 10,
        },
      ],
      category: "sortie",
      place: "dehors",
    }),
    (p) => ({
      title: `Mission duo autour de ${p.name}`,
      blurb: `Petit challenge local ancré sur ${p.name}, puis conclusion claire.`,
      steps: [
        `Se retrouver à ${p.name}`,
        "Tirer une micro-mission (photo, question, goûter)",
        "Comparer les résultats en 5 min",
      ],
      roadmap: [
        {
          phase: "Avant",
          title: "Tirer la mission",
          detail: "3 options écrites, une seule tirée au sort.",
          minutes: 5,
        },
        {
          phase: "Sur place",
          title: `Base ${p.name}`,
          detail: "Lancer le chrono et exécuter la mission.",
          minutes: 35,
        },
        {
          phase: "Après",
          title: "Débrief",
          detail: "Qui a gagné / ce qu’on refait la prochaine fois.",
          minutes: 10,
        },
      ],
      category: "jeu",
      place: indoorCats.has(p.category) ? "dedans" : placeDefault,
    }),
    (p) => ({
      title: `Slow time à ${p.name}`,
      blurb: `Version cosy : ${p.name} comme bulle, zéro performance.`,
      steps: [
        `S’installer à ${p.name}`,
        "Une seule conversation ou activité partagée",
        "Partir avant d’être saturé",
      ],
      roadmap: [
        {
          phase: "Avant",
          title: "Intention",
          detail: "Choisir le sujet ou le silence assumé.",
          minutes: 5,
        },
        {
          phase: "Sur place",
          title: "Installation",
          detail: `À ${p.name}, trouver un coin confortable.`,
          minutes: 10,
        },
        {
          phase: "Sur place",
          title: "Temps partagé",
          detail: "Rester présent·e : pas de scroll, une boisson max si budget serré.",
          minutes: 40,
        },
        {
          phase: "Après",
          title: "Clôture douce",
          detail: "Noter l’humeur (1–5) et rentrer.",
          minutes: 5,
        },
      ],
      category: p.category,
      place: indoorCats.has(p.category) ? "dedans" : placeDefault,
    }),
  ];

  const out: Plan[] = [];
  const usedBuilders = new Set<number>();

  for (let i = 0; i < pois.length && out.length < 6; i++) {
    const p = pois[i]!;
    let builderIdx = i % builders.length;
    // Prefer unused template when possible
    for (let k = 0; k < builders.length; k++) {
      const candidate = (i + k) % builders.length;
      if (!usedBuilders.has(candidate)) {
        builderIdx = candidate;
        break;
      }
    }
    usedBuilders.add(builderIdx);
    const tpl = builders[builderIdx]!(p);
    if (constraints.place !== "peu-importe" && tpl.place !== constraints.place) {
      continue;
    }
    const plan = normalizeAiPlan(
      {
        ...tpl,
        durationMin: durationToMin(constraints.duration),
        budgetMax:
          budgetToMax(constraints.budget) === 999
            ? 25
            : budgetToMax(constraints.budget),
        energy: constraints.energy,
        vibes:
          constraints.vibe === "peu-importe"
            ? ["potes", "date"]
            : [constraints.vibe],
      },
      out.length,
      constraints,
    );
    if (plan) out.push({ ...plan, id: `poi-${out.length + 1}` });
  }
  return out;
}
