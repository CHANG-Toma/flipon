import type { Lang } from "@/lib/i18n";

const dark = {
  bg: "#090B12",
  surface: "#101521",
  soft: "#161C2A",
  ink: "#F5F7FB",
  muted: "#9AA3B7",
  accent: "#FF6A2B",
  line: "#232B3D",
};

/** Écran vote — carte activité + Oui / Passer */
export function PreviewVoteScreen({ lang }: { lang: Lang }) {
  const isEn = lang === "en";
  return (
    <div className="preview-app" style={{ background: dark.bg, color: dark.ink }}>
      <p className="preview-kicker">{isEn ? "Vote" : "Vote"} · 2/6</p>
      <p className="preview-label">{isEn ? "Would you do this?" : "Ça vous dit ?"}</p>
      <div className="preview-card" style={{ background: dark.surface, borderColor: dark.line }}>
        <span className="preview-tag" style={{ color: dark.accent }}>
          {isEn ? "outdoor" : "plein air"}
        </span>
        <p className="preview-title">{isEn ? "Sunset walk + terrace" : "Balade coucher de soleil + terrasse"}</p>
        <p className="preview-blurb" style={{ color: dark.muted }}>
          {isEn ? "90 min outside, soft budget, calm energy." : "90 min dehors, budget soft, énergie calme."}
        </p>
        <div className="preview-meta">
          <span>~90 min</span>
          <span>≤ 20 €</span>
          <span>{isEn ? "outdoor" : "dehors"}</span>
        </div>
      </div>
      <div className="preview-actions">
        <span className="preview-btn-secondary" style={{ borderColor: dark.line, background: dark.soft }}>
          {isEn ? "Pass" : "Passer"}
        </span>
        <span className="preview-btn-primary" style={{ background: dark.accent }}>
          {isEn ? "Yes" : "Oui"}
        </span>
      </div>
      <p className="preview-hint" style={{ color: dark.muted }}>
        {isEn ? "Private vote — partner can't see" : "Vote privé — l'autre ne voit pas"}
      </p>
    </div>
  );
}

/** Écran cadre session + contexte Premium */
export function PreviewSetupScreen({ lang }: { lang: Lang }) {
  const isEn = lang === "en";
  return (
    <div className="preview-app" style={{ background: dark.bg, color: dark.ink }}>
      <p className="preview-kicker">{isEn ? "Step 1" : "Étape 1"}</p>
      <p className="preview-title-lg">{isEn ? "Your setup" : "Ton cadre"}</p>
      <div
        className="preview-context"
        style={{ background: dark.soft, borderColor: dark.accent }}
      >
        <p className="preview-context-title" style={{ color: dark.accent }}>
          {isEn ? "Premium context" : "Contexte Premium"}
        </p>
        <p className="preview-context-text" style={{ color: dark.muted }}>
          {isEn ? "Toulouse · Clear · Evening · favor outdoor" : "Toulouse · Ciel clair · Soir · plutôt dehors"}
        </p>
      </div>
      <div className="preview-chips">
        {(isEn
          ? ["1 h", "≤ 20 €", "Calm", "Friends"]
          : ["1 h", "≤ 20 €", "Tranquille", "Potes"]
        ).map((c) => (
          <span
            key={c}
            className="preview-chip"
            style={{ borderColor: dark.line, background: dark.surface, color: dark.muted }}
          >
            {c}
          </span>
        ))}
      </div>
      <span className="preview-btn-primary preview-btn-block" style={{ background: dark.accent }}>
        {isEn ? "Continue" : "Continuer"}
      </span>
    </div>
  );
}

/** Écran résultat + roadmap Premium */
export function PreviewResultScreen({ lang }: { lang: Lang }) {
  const isEn = lang === "en";
  const steps = isEn
    ? [
        { phase: "Before", title: "Meet at 7:40 pm", min: "5 min" },
        { phase: "On site", title: "Terrace + walk", min: "75 min" },
        { phase: "After", title: "Verdict over coffee", min: "15 min" },
      ]
    : [
        { phase: "Avant", title: "RDV 19h40", min: "5 min" },
        { phase: "Sur place", title: "Terrasse + balade", min: "75 min" },
        { phase: "Après", title: "Verdict autour d'un café", min: "15 min" },
      ];

  return (
    <div className="preview-app" style={{ background: dark.bg, color: dark.ink }}>
      <p className="preview-kicker">{isEn ? "Match!" : "Match !"}</p>
      <p className="preview-title-lg">{isEn ? "Sunset walk + terrace" : "Balade coucher de soleil + terrasse"}</p>
      <p className="preview-blurb" style={{ color: dark.muted }}>
        {isEn ? "Your shared plan for tonight." : "Votre plan commun pour ce soir."}
      </p>
      <div className="preview-roadmap" style={{ background: dark.surface, borderColor: dark.line }}>
        <p className="preview-roadmap-title">{isEn ? "Roadmap" : "Feuille de route"}</p>
        {steps.map((s) => (
          <div key={s.title} className="preview-roadmap-row">
            <span className="preview-roadmap-dot" style={{ background: dark.accent }} />
            <div>
              <p className="preview-roadmap-phase" style={{ color: dark.accent }}>
                {s.phase}
              </p>
              <p className="preview-roadmap-step">{s.title}</p>
            </div>
            <span className="preview-roadmap-min" style={{ color: dark.muted }}>
              {s.min}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
