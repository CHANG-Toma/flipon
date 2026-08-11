import Link from "next/link";
import { getLang, withLang } from "@/lib/i18n";

export default async function PresentationPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const lang = getLang(await searchParams);
  const isEn = lang === "en";
  const cards = isEn
    ? [
        {
          title: "The blocker",
          body: "Too many options, nobody decides, and the plan never starts.",
        },
        {
          title: "The method",
          body: "Quick setup -> private vote -> one shared idea in minutes.",
        },
        {
          title: "Any moment",
          body: "Day or evening: brunch, walk, terrace, or later out. Same flow.",
        },
      ]
    : [
        {
          title: "Le blocage",
          body: "Trop d’options, personne ne tranche, et le plan ne démarre jamais.",
        },
        {
          title: "La méthode",
          body: "Cadre rapide → vote privé → une idée commune en quelques minutes.",
        },
        {
          title: "N’importe quel moment",
          body: "Journée ou soirée : brunch, balade, terrasse ou sortie plus tard. Même flux.",
        },
      ];

  return (
    <main className="safe-bottom bg-[radial-gradient(ellipse_120%_60%_at_50%_-10%,color-mix(in_srgb,var(--coral)_6%,white),transparent_60%)] pb-12 pt-6 sm:pb-20 sm:pt-10">
      <div className="page-gutter mx-auto max-w-4xl">
        <header className="mx-auto max-w-2xl animate-rise text-center">
          <p className="premium-kicker">
            {isEn ? "Overview" : "Présentation"}
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            {isEn
              ? "Decide together, then go."
              : "Trancher ensemble, puis y aller."}
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-ink-soft sm:text-base">
            {isEn
              ? "FlipOn helps a group pick one activity, any time of day."
              : "FlipOn aide un groupe à choisir une activité, à n’importe quel moment."}
          </p>

          <div className="mx-auto mt-6 flex max-w-sm flex-col gap-2.5 sm:flex-row sm:justify-center">
            <Link href={withLang("/test", lang)} className="btn-primary w-full">
              {isEn ? "Try the demo" : "Essayer la démo"}
            </Link>
          </div>
        </header>

        <section className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-3 sm:gap-4">
          {cards.map((item) => (
            <article key={item.title} className="premium-card p-4 sm:p-5">
              <p className="text-sm font-bold text-ink">{item.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft sm:text-[15px]">
                {item.body}
              </p>
            </article>
          ))}
        </section>

        <section className="premium-card mx-auto mt-8 max-w-2xl p-5 text-center sm:mt-10 sm:p-6">
          <p className="mt-2 text-[15px] leading-relaxed text-ink-soft sm:text-base">
            {isEn
              ? "FlipOn does not search for the perfect activity. It gives the one your group is ready to do now."
              : "FlipOn ne cherche pas la meilleure activité du monde. FlipOn sort celle que votre groupe est prêt à faire maintenant."}
          </p>
          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
            <Link href={withLang("/test", lang)} className="btn-primary w-full sm:w-auto">
              {isEn ? "Start demo" : "Lancer la démo"}
            </Link>
            <Link href={withLang("/tarifs", lang)} className="btn-secondary w-full sm:w-auto">
              {isEn ? "Basic and Premium" : "Basique et Premium"}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
