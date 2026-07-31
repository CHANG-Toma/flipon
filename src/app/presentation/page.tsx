import Link from "next/link";

const sections = [
  {
    title: "Le problème",
    body: "Les couples tombent dans la routine. Chercher une idée sur internet crée de la fatigue de décision, et la charge de « trouver un plan » tombe souvent sur une seule personne.",
  },
  {
    title: "La promesse",
    body: "Sortir du mode automatique à deux. FlipOn sort une activité que vous avez tous les deux validée, selon le temps, le budget, l’énergie et dedans / dehors.",
  },
  {
    title: "Comment ça marche",
    body: "Comptes liés → cadre rapide → vote privé → une idée avec des étapes → un petit check-in après.",
  },
  {
    title: "Ce que ce n’est pas",
    body: "Pas de quiz coquin, pas d’annuaire de restos, pas de réseau social, pas de thérapie.",
  },
  {
    title: "Pour qui",
    body: "Couples qui se disent « on devrait varier » et qui finissent encore sur le canapé. Ça ne marche qu’à deux.",
  },
  {
    title: "Modèle",
    body: "Freemium + Boost IA (~6 €/mois pour le couple) — idées plus précises selon lieu, météo, moment. Voir les tarifs.",
  },
];

export default function PresentationPage() {
  return (
    <main className="safe-bottom min-h-[100dvh] pb-12 pt-6 sm:pb-20 sm:pt-10">
      <div className="page-gutter mx-auto max-w-5xl">
        <header className="max-w-xl animate-rise">
          <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-4xl">
            FlipOn en une page
          </h1>
          <p className="mt-2 text-[15px] text-ink-soft sm:text-base">
            Couper le débat, pas remplir un catalogue.
          </p>
        </header>

        <div className="mt-8 grid gap-6 sm:mt-10 sm:gap-8 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="surface space-y-4 p-4 sm:sticky sm:top-20 sm:p-5">
              <p className="text-sm font-bold text-ink">En gros</p>
              <ul className="space-y-2 text-sm text-ink-soft">
                <li>
                  <span className="font-medium text-ink">Quiz</span> → parler
                </li>
                <li>
                  <span className="font-medium text-ink">Lieux</span> → listes
                </li>
                <li>
                  <span className="font-medium text-ink">FlipOn</span> → une idée
                  validée
                </li>
              </ul>
              <Link href="/test" className="btn-primary w-full">
                Essayer
              </Link>
              <Link
                href="/tarifs"
                className="block text-center text-sm font-medium text-coral hover:text-coral-deep"
              >
                Voir les tarifs
              </Link>
            </div>
          </aside>

          <div className="space-y-3 sm:space-y-4 lg:col-span-8">
            {sections.map((s) => (
              <article key={s.title} className="surface p-4 sm:p-5">
                <h2 className="text-base font-bold text-ink sm:text-lg">
                  {s.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft sm:text-[15px]">
                  {s.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
