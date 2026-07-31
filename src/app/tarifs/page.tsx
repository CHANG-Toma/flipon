import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tarifs",
  description:
    "FlipOn gratuit pour le flux duo de base. FlipOn Boost : idées plus précises grâce à l’IA, selon le lieu, la météo et le moment.",
};

const freeFeatures = [
  "Cadre rapide (temps, budget, énergie, lieu)",
  "Vote privé à deux",
  "Une idée validée par les deux",
  "Catalogue d’activités FlipOn",
  "Un abo = deux personnes",
];

const boostFeatures = [
  "Tout le plan gratuit",
  "Idées boostées à l’IA, plus spécifiques",
  "Selon votre lieu actuel",
  "Selon la météo du moment",
  "Selon l’heure / le jour",
  "Moins de propositions génériques, plus de plans concrets",
];

export default function TarifsPage() {
  return (
    <main className="safe-bottom min-h-[100dvh] pb-12 pt-6 sm:pb-20 sm:pt-10">
      <div className="page-gutter mx-auto max-w-5xl">
        <header className="mx-auto max-w-xl animate-rise text-center sm:text-left">
          <p className="text-sm font-semibold text-coral">Tarifs</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-4xl">
            Simple. Un abo pour deux.
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-soft sm:text-base">
            Commence gratuit. Passe à Boost quand tu veux des idées calées sur
            le vrai contexte — pas juste une liste générique.
          </p>
        </header>

        <div className="mt-8 grid gap-4 sm:mt-12 sm:gap-5 lg:grid-cols-2">
          {/* Gratuit */}
          <section className="surface flex flex-col p-5 sm:p-6">
            <div>
              <h2 className="text-lg font-bold text-ink sm:text-xl">Basique</h2>
              <p className="mt-1 text-sm text-ink-soft">
                Le vrai FlipOn — cadre, vote, une idée.
              </p>
              <p className="mt-5 flex items-baseline gap-1">
                <span className="font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight text-ink">
                  0 €
                </span>
                <span className="text-sm text-ink-soft">/ mois</span>
              </p>
            </div>

            <ul className="mt-6 flex-1 space-y-3">
              {freeFeatures.map((f) => (
                <li key={f} className="flex gap-2.5 text-sm leading-snug text-ink">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foam text-[11px] font-bold text-ink-soft"
                    aria-hidden
                  >
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <Link href="/test" className="btn-secondary mt-8 w-full">
              Essayer gratuitement
            </Link>
          </section>

          {/* Boost IA */}
          <section className="relative flex flex-col overflow-hidden rounded-[var(--radius-ui)] border border-coral/30 bg-gradient-to-b from-sky to-petal p-5 shadow-[var(--shadow-soft)] sm:p-6">
            <p className="absolute right-4 top-4 rounded-md bg-coral px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              IA
            </p>
            <div>
              <h2 className="text-lg font-bold text-ink sm:text-xl">
                Boost
              </h2>
              <p className="mt-1 text-sm text-ink-soft">
                Des activités plus précises, adaptées au moment.
              </p>
              <p className="mt-5 flex items-baseline gap-1">
                <span className="font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight text-ink">
                  6 €
                </span>
                <span className="text-sm text-ink-soft">/ mois · couple</span>
              </p>
            </div>

            <ul className="mt-6 flex-1 space-y-3">
              {boostFeatures.map((f) => (
                <li key={f} className="flex gap-2.5 text-sm leading-snug text-ink">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-coral/15 text-[11px] font-bold text-coral-deep"
                    aria-hidden
                  >
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-8 space-y-2">
              <Link href="/test" className="btn-primary w-full">
                Voir le flux (démo)
              </Link>
              <p className="text-center text-xs text-ink-soft">
                Paiement bientôt — la démo actuelle est le plan Basique.
              </p>
            </div>
          </section>
        </div>

        <section className="mx-auto mt-10 max-w-2xl sm:mt-14">
          <h2 className="text-lg font-bold text-ink sm:text-xl">
            Ce que Boost change vraiment
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft sm:text-[15px]">
            Basique tire dans un catalogue FlipOn selon ton cadre. Boost
            compose une idée plus fine : pluie + 40 min + près de chez vous →
            pas le même plan qu’un samedi ensoleillé en centre-ville.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              {
                t: "Lieu",
                d: "Autour de vous, pas une idée hors sol.",
              },
              {
                t: "Météo",
                d: "Dedans / dehors selon le ciel réel.",
              },
              {
                t: "Moment",
                d: "Soirée semaine ≠ dimanche après-midi.",
              },
            ].map((item) => (
              <div key={item.t} className="border-t border-line pt-3">
                <h3 className="text-sm font-bold text-ink">{item.t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                  {item.d}
                </p>
              </div>
            ))}
          </div>
        </section>

        <p className="mx-auto mt-10 max-w-xl text-center text-xs leading-relaxed text-ink-soft sm:mt-12">
          Un seul abonnement pour les deux comptes. Annulable quand tu veux.
          Pas de frais cachés.
        </p>
      </div>
    </main>
  );
}
