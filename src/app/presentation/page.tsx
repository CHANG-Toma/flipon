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
    body: "Freemium + premium couple (~6 €/mois) — un abo pour deux comptes.",
  },
];

export default function PresentationPage() {
  return (
    <main className="min-h-[100svh] pb-20 pt-10">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <header className="max-w-xl animate-rise">
          <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            FlipOn en une page
          </h1>
          <p className="mt-2 text-base text-ink-soft">
            Couper le débat, pas remplir un catalogue.
          </p>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="surface sticky top-20 space-y-4 p-5">
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
            </div>
          </aside>

          <div className="space-y-4 lg:col-span-8">
            {sections.map((s) => (
              <article key={s.title} className="surface p-5">
                <h2 className="text-lg font-bold text-ink">{s.title}</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
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
