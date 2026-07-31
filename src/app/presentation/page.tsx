import Link from "next/link";

const sections = [
  {
    title: "Le problème",
    body: "Les couples tombent dans la routine. Chercher une idée sur internet crée de la fatigue de décision, et la charge de « trouver un plan » tombe souvent sur une seule personne. Le vrai concurrent, ce n’est pas une autre app — c’est le « on verra ».",
  },
  {
    title: "La promesse FlipOn",
    body: "Casser la routine à deux — un plan, maintenant. En moins d’une minute, FlipOn délivre une seule activité acceptée par les deux, selon le temps, le budget, l’énergie et le souhait maison / dehors.",
  },
  {
    title: "Comment ça marche",
    body: "Comptes liés → contraintes rapides → swipe privé sur 5–8 options → un match avec étapes concrètes → check-in le lendemain (fait / reporté / meh) pour améliorer les prochaines suggestions.",
  },
  {
    title: "Ce que FlipOn n’est pas",
    body: "Pas une app de quiz coquin. Pas un annuaire de restos. Pas un réseau social couple. Pas de thérapie. Le succès se mesure aux plans réalisés hors habitudes — pas au temps passé dans l’app.",
  },
  {
    title: "Pour qui",
    body: "Couples 25–45 ans, urbains et péri-urbains, qui se disent « on devrait sortir plus » et finissent sur le canapé. Adoption duo obligatoire : la valeur est nulle en solo.",
  },
  {
    title: "Modèle",
    body: "Freemium : 3 plans / semaine gratuits. Premium couple à 5,99 €/mois ou 49 €/an — un abonnement pour deux comptes. Jamais de double facturation.",
  },
];

export default function PresentationPage() {
  return (
    <main className="section-wash min-h-[100svh] pt-24">
      <div className="mx-auto max-w-6xl px-5 pb-20 sm:px-8 sm:pb-28">
        <header className="max-w-3xl animate-rise">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-teal">
            Présentation
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-syne)] text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            FlipOn en une page
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            L’interrupteur anti-routine du couple : une mécanique de décision
            partagée, pas un catalogue d’idées.
          </p>
        </header>

        <div className="mt-16 grid gap-0 lg:grid-cols-12">
          <aside className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-28 space-y-6 border-l border-ink/15 pl-6">
              <p className="font-[family-name:var(--font-syne)] text-sm font-bold uppercase tracking-[0.12em] text-ink-soft">
                Différenciation
              </p>
              <ul className="space-y-4 text-[15px] text-ink">
                <li>
                  <span className="font-semibold text-coral">Quiz couple</span>
                  <br />
                  <span className="text-ink-soft">Parler / pimenter</span>
                </li>
                <li>
                  <span className="font-semibold text-coral">Lieux de date</span>
                  <br />
                  <span className="text-ink-soft">Liste / carte</span>
                </li>
                <li>
                  <span className="font-semibold text-teal">FlipOn</span>
                  <br />
                  <span className="text-ink-soft">1 décision partagée → plan fait</span>
                </li>
              </ul>
              <Link
                href="/test"
                className="inline-flex h-11 items-center bg-ink px-5 text-sm font-semibold text-white transition-colors hover:bg-ink-soft"
              >
                Essayer le flux
              </Link>
            </div>
          </aside>

          <div className="space-y-12 lg:col-span-8">
            {sections.map((s, i) => (
              <article
                key={s.title}
                className="animate-rise border-t border-ink/12 pt-8"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <h2 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-ink">
                  {s.title}
                </h2>
                <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-ink-soft">
                  {s.body}
                </p>
              </article>
            ))}

            <div className="border border-ink/10 bg-white/80 p-8">
              <h2 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-ink">
                Message clé
              </h2>
              <p className="mt-3 font-[family-name:var(--font-syne)] text-xl font-semibold leading-snug text-coral sm:text-2xl">
                Pas « 200 idées de date ».
                <br />
                Oui « Fini le on verra — matchez un plan ce soir ».
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/test"
                  className="inline-flex h-11 items-center bg-coral px-5 text-sm font-semibold text-white transition-colors hover:bg-coral-deep"
                >
                  Tester maintenant
                </Link>
                <Link
                  href="/"
                  className="inline-flex h-11 items-center border border-ink/20 px-5 text-sm font-semibold text-ink transition-colors hover:bg-foam"
                >
                  Retour accueil
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
