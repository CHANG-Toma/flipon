/**
 * Deck Premium : lieux OSM + Gemini (ou templates POI) → fallback catalogue.
 * Jamais de lat/lng stockés — uniquement ville + météo dérivées.
 */
import {
  buildDeck,
  type Constraints,
  type ContextHint,
  type Plan,
} from "@/data/plans";
import { fetchNearbyPois, type NearbyPoi } from "@/lib/ai/nearby-pois";
import {
  normalizeAiDeck,
  plansFromPois,
} from "@/lib/ai/parse-plans";

export type DeckSource = "ai" | "pois" | "catalogue";

export type PremiumDeckResult = {
  plans: Plan[];
  source: DeckSource;
  poiCount: number;
};

/** Anti-répétition mémoire process (derniers titres générés). */
const recentTitles: string[] = [];
const RECENT_MAX = 48;

function rememberTitles(plans: Plan[]) {
  for (const p of plans) {
    const key = p.title.trim().toLowerCase();
    if (!key) continue;
    recentTitles.push(key);
  }
  while (recentTitles.length > RECENT_MAX) recentTitles.shift();
}

function shuffleInPlace<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr;
}

function geminiModel(): string {
  return process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash-lite";
}

const ANGLE_HINTS = [
  "angle découverte / flânerie",
  "angle challenge / jeu",
  "angle food / dégustation",
  "angle culture / photo",
  "angle sport léger / marche",
  "angle cosy / discussion",
  "angle surprise / improvisation",
  "angle DIY / création",
];

function buildPrompt(
  constraints: Constraints,
  context: ContextHint,
  pois: NearbyPoi[],
  seed: string,
): string {
  const shuffledPois = shuffleInPlace([...pois]).slice(0, 18);
  const poiLines =
    shuffledPois.length > 0
      ? shuffledPois
          .map((p, i) => `${i + 1}. ${p.name} (${p.category})`)
          .join("\n")
      : "(aucun lieu OSM trouvé — invente des activités réalistes et faisables dans cette ville, sans inventer d’adresses célèbres fausses)";

  const avoid =
    recentTitles.length > 0
      ? recentTitles
          .slice(-24)
          .map((t) => `- ${t}`)
          .join("\n")
      : "(aucune)";

  const angles = shuffleInPlace([...ANGLE_HINTS]).slice(0, 4).join(", ");

  return `Tu es FlipOn. Génère EXACTEMENT 6 idées d'activités pour un vote entre potes / couple / groupe.
Seed de variété (change ton tirage): ${seed}

Ville / quartier: ${context.cityLabel || "inconnu"}
Moment: ${context.moment}
Météo: ${context.weather}${
    typeof context.temperatureC === "number"
      ? ` (${context.temperatureC}°C)`
      : ""
  }

Cadre utilisateur (OBLIGATOIRE):
- durée: ${constraints.duration}
- budget: ${constraints.budget}
- énergie: ${constraints.energy}
- lieu: ${constraints.place}
- ambiance: ${constraints.vibe}

Lieux RÉELS disponibles autour (à privilégier, en les mélangeant):
${poiLines}

À ÉVITER (titres trop proches / déjà proposés récemment):
${avoid}

Angles à couvrir dans le deck (varie fortement): ${angles}

Règles de variété:
- Les 6 idées doivent être clairement DIFFÉRENTES (lieux, formats, rythme). Max 1 idée café/resto pure.
- N’utilise pas deux fois le même lieu comme fil conducteur.
- Alterne catégories (sortie, culture, food, jeu, cosy, sport léger…).
- Titres non génériques (“Pause café” interdit) : sois précis et local.

Règles cadre:
- Respecte budget, durée, énergie, dedans/dehors.
- Météo rude / nuit → favorise dedans sauf si lieu=dehors imposé.

Chaque idée JSON:
- title, blurb (1 phrase), steps (3–5 actions courtes),
- roadmap: tableau de 4 à 6 étapes feuille de route avec:
  { "phase": "Avant"|"Sur place"|"Après", "title": "...", "detail": "1–2 phrases concrètes", "minutes": number optionnel }
- durationMin, budgetMax (€), energy, place, category, vibes

Réponds UNIQUEMENT en JSON valide: {"plans":[...]} — pas de markdown.`;
}

async function callGemini(
  constraints: Constraints,
  context: ContextHint,
  pois: NearbyPoi[],
  seed: string,
): Promise<Plan[]> {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) return [];

  const model = geminiModel();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: buildPrompt(constraints, context, pois, seed) }],
          },
        ],
        generationConfig: {
          temperature: 1.05,
          topP: 0.95,
          maxOutputTokens: 8192,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!res.ok) {
      return [];
    }

    const data = (await res.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
      }>;
    };
    const text = data.candidates?.[0]?.content?.parts
      ?.map((p) => p.text || "")
      .join("")
      .trim();
    if (!text) return [];

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) return [];
      parsed = JSON.parse(match[0]);
    }
    return normalizeAiDeck(parsed, constraints);
  } finally {
    clearTimeout(timer);
  }
}

async function callGroq(
  constraints: Constraints,
  context: ContextHint,
  pois: NearbyPoi[],
  seed: string,
): Promise<Plan[]> {
  const key = process.env.GROQ_API_KEY?.trim();
  if (!key) return [];

  const model =
    process.env.GROQ_MODEL?.trim() || "llama-3.1-8b-instant";

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        temperature: 1.0,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "Tu génères des idées FlipOn variées. Réponds uniquement en JSON {\"plans\":[...]}",
          },
          {
            role: "user",
            content: buildPrompt(constraints, context, pois, seed),
          },
        ],
      }),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = data.choices?.[0]?.message?.content?.trim();
    if (!text) return [];
    return normalizeAiDeck(JSON.parse(text), constraints);
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Génère un deck Premium localisé.
 * Ordre: Gemini → Groq → templates POI → catalogue filtré.
 */
export async function generatePremiumDeck(
  constraints: Constraints,
  context: ContextHint,
): Promise<PremiumDeckResult> {
  const seed = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

  let pois: NearbyPoi[] = [];
  if (context.cityLabel) {
    try {
      pois = shuffleInPlace(await fetchNearbyPois(context.cityLabel));
    } catch {
      pois = [];
    }
  }

  try {
    const gemini = await callGemini(constraints, context, pois, seed);
    if (gemini.length >= 3) {
      rememberTitles(gemini);
      return { plans: gemini.slice(0, 6), source: "ai", poiCount: pois.length };
    }
  } catch {
    /* fallback */
  }

  try {
    const groq = await callGroq(constraints, context, pois, seed);
    if (groq.length >= 3) {
      rememberTitles(groq);
      return { plans: groq.slice(0, 6), source: "ai", poiCount: pois.length };
    }
  } catch {
    /* fallback */
  }

  if (pois.length >= 3) {
    const fromPois = plansFromPois(
      shuffleInPlace([...pois]),
      constraints,
      context.cityLabel || "ta ville",
    );
    if (fromPois.length >= 3) {
      rememberTitles(fromPois);
      return {
        plans: fromPois.slice(0, 6),
        source: "pois",
        poiCount: pois.length,
      };
    }
  }

  return {
    plans: buildDeck(constraints, context),
    source: "catalogue",
    poiCount: pois.length,
  };
}
