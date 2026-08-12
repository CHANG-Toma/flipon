/**
 * Validation / normalisation d'un deck Plan issu de l'IA ou des POIs.
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
  const durationMinVal =
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
    durationMin: durationMinVal,
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

/** Filet sans IA : idées ancrées sur de vrais POIs, adaptées à la catégorie. */
export function plansFromPois(
  pois: { name: string; category: string }[],
  constraints: Constraints,
  cityLabel: string,
): Plan[] {
  const placeDefault: Plan["place"] =
    constraints.place === "dedans"
      ? "dedans"
      : constraints.place === "dehors"
        ? "dehors"
        : "dehors";

  const indoorCats = new Set([
    "café", "restaurant", "bar", "cinéma", "musée", "bibliothèque", "boulangerie",
  ]);
  const foodCats = new Set(["café", "restaurant", "bar", "boulangerie"]);
  const cultureCats = new Set(["musée", "bibliothèque", "cinéma", "attraction"]);

  type Tpl = {
    title: string;
    blurb: string;
    steps: string[];
    roadmap: PlanRoadmapStep[];
    category: string;
    place: Plan["place"];
  };

  function tplForPoi(p: { name: string; category: string }): Tpl {
    if (foodCats.has(p.category)) {
      return {
        title: `Dégustation à ${p.name}`,
        blurb: `Goûter le meilleur de ${p.name} : commander un truc chacun, échanger et noter.`,
        steps: [`Arriver à ${p.name}`, "Commander chacun un truc différent", "Goûter les deux, noter sur 10"],
        roadmap: [
          { phase: "Avant", title: "Choisir le créneau", detail: `Se retrouver à ${p.name} à l'heure qui arrange.`, minutes: 5 },
          { phase: "Sur place", title: "Commander", detail: "Chacun choisit un truc différent — pas le même !", minutes: 10 },
          { phase: "Sur place", title: "Dégustation croisée", detail: "Échanger les assiettes / verres, goûter et noter sur 10.", minutes: 25 },
          { phase: "Après", title: "Verdict", detail: "Élire le gagnant. Photo du plat primé.", minutes: 5 },
        ],
        category: "food",
        place: "dedans",
      };
    }
    if (cultureCats.has(p.category)) {
      return {
        title: `Culture flash : ${p.name}`,
        blurb: `Visite rapide de ${p.name} avec un défi : chacun choisit son coup de cœur.`,
        steps: [`Entrer à ${p.name}`, "Se séparer 15 min, chacun explore", "Se retrouver : présenter son coup de cœur"],
        roadmap: [
          { phase: "Avant", title: "Vérifier horaires", detail: `Confirmer que ${p.name} est ouvert.`, minutes: 5 },
          { phase: "Sur place", title: "Exploration solo", detail: "Chacun son chemin pendant 15–20 min.", minutes: 20 },
          { phase: "Sur place", title: "Pitch coup de cœur", detail: "Se retrouver, chacun décrit sa trouvaille préférée.", minutes: 10 },
          { phase: "Après", title: "Débrief café", detail: "Café en sortant pour en reparler.", minutes: 15 },
        ],
        category: "culture",
        place: "dedans",
      };
    }
    if (p.category === "parc") {
      return {
        title: `Session plein air : ${p.name}`,
        blurb: `Profiter de ${p.name} avec une vraie activité — pas juste marcher.`,
        steps: [`Rendez-vous à ${p.name}`, "Choisir : pique-nique, frisbee ou jeu de cartes", "Timer 1h sans téléphone"],
        roadmap: [
          { phase: "Avant", title: "Préparer le matos", detail: "Couverture, snacks, jeu de cartes ou ballon.", minutes: 10 },
          { phase: "Sur place", title: "Installation", detail: `Trouver un coin tranquille dans ${p.name}.`, minutes: 10 },
          { phase: "Sur place", title: "Activité principale", detail: "Jouer, manger ou lire ensemble.", minutes: 45 },
          { phase: "Après", title: "Note de sortie", detail: "L'endroit vaut un retour ? Se donner une note.", minutes: 5 },
        ],
        category: "plein air",
        place: "dehors",
      };
    }
    if (p.category === "sport") {
      return {
        title: `Défi sportif : ${p.name}`,
        blurb: `Une séance à ${p.name} — on transpire un peu, on rigole beaucoup.`,
        steps: [`Se retrouver à ${p.name}`, "Choisir une activité dispo", "Mini-tournoi ou session libre"],
        roadmap: [
          { phase: "Avant", title: "Tenue de sport", detail: "Vérifier les horaires et emmener de quoi boire.", minutes: 5 },
          { phase: "Sur place", title: "Échauffement", detail: `Arriver à ${p.name}, s'échauffer 10 min.`, minutes: 15 },
          { phase: "Sur place", title: "Session", detail: "Jouer sérieusement pendant 30–45 min.", minutes: 40 },
          { phase: "Après", title: "Récup", detail: "Smoothie ou café, débriefer la performance.", minutes: 15 },
        ],
        category: "sport",
        place: "dedans",
      };
    }
    return {
      title: `Sortie ${p.category} : ${p.name}`,
      blurb: `Tester ${p.name} à ${cityLabel} — téléphones rangés, on profite vraiment.`,
      steps: [`Se retrouver à ${p.name}`, "Une seule activité : pas de multitâche", "Verdict en sortant"],
      roadmap: [
        { phase: "Avant", title: "Organisation", detail: `Confirmer l'heure et le budget pour ${p.name}.`, minutes: 5 },
        { phase: "Sur place", title: "Arrivée", detail: "S'installer, commander ou explorer.", minutes: 10 },
        { phase: "Sur place", title: "Moment principal", detail: "Se concentrer sur l'activité, profiter du lieu.", minutes: 35 },
        { phase: "Après", title: "Bilan express", detail: "On y retourne ? Oui / non / peut-être.", minutes: 5 },
      ],
      category: p.category,
      place: indoorCats.has(p.category) ? "dedans" : placeDefault,
    };
  }

  const out: Plan[] = [];

  for (let i = 0; i < pois.length && out.length < 6; i++) {
    const p = pois[i]!;
    const tpl = tplForPoi(p);
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
