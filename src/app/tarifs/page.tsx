import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tarifs",
  description:
    "FlipOn gratuit pour voter et trancher. Boost à 3,99 €/mois : idées calées sur ton lieu, la météo et le moment.",
  alternates: { canonical: "/tarifs" },
  openGraph: {
    title: "Tarifs FlipOn",
    description:
      "Basique 0 € · Boost 3,99 €/mois — des idées vraiment adaptées au moment.",
    url: "/tarifs",
  },
};

const BOOST_PRICE = "3,99";

const rows: {
  label: string;
  free: string;
  boost: string;
}[] = [
  {
    label: "Vote privé + idée commune",
    free: "Oui",
    boost: "Oui",
  },
  {
    label: "Source des idées",
    free: "Catalogue FlipOn",
    boost: "Idées générées pour vous",
  },
  {
    label: "Prise en compte du lieu",
    free: "Non",
    boost: "Autour de vous",
  },
  {
    label: "Météo du moment",
    free: "Non",
    boost: "Oui",
  },
  {
    label: "Heure / jour",
    free: "Cadre manuel",
    boost: "Adapté automatiquement",
  },
  {
    label: "Niveau de précision",
    free: "Bon pour démarrer",
    boost: "Plans concrets, moins génériques",
  },
];

export default function TarifsPage() {
  return (
    <main className="safe-bottom min-h-[100dvh] pb-12 pt-6 sm:pb-20 sm:pt-10">
      <div className="page-gutter mx-auto max-w-5xl">
        <header className="mx-auto max-w-xl animate-rise">
          <p className="text-sm font-semibold text-coral">Tarifs</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-4xl">
            Gratuit pour trancher.
            <br className="hidden sm:block" /> Boost quand tu veux mieux.
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-soft sm:text-base">
            Basique = le flux FlipOn. Boost = des idées calées sur{" "}
            <span className="text-ink">où</span> tu es,{" "}
            <span className="text-ink">le temps qu’il fait</span> et{" "}
            <span className="text-ink">quand</span> tu sors — sans te ruiner.
          </p>
        </header>

        <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-5 lg:grid-cols-2">
          <section className="surface flex flex-col p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Pour commencer
            </p>
            <h2 className="mt-1 text-lg font-bold text-ink sm:text-xl">
              Basique
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              Cadre → vote privé → une idée. Suffisant pour tester et trancher.
            </p>
            <p className="mt-5 flex items-baseline gap-1.5">
              <span className="font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight text-ink">
                0 €
              </span>
              <span className="text-sm text-ink-soft">/ mois</span>
            </p>
            <ul className="mt-6 flex-1 space-y-2.5 text-sm text-ink">
              <li>Vote privé, idée commune</li>
              <li>Ambiances potes / groupe / date</li>
              <li>Idées tirées du catalogue FlipOn</li>
            </ul>
            <Link href="/test" prefetch className="btn-secondary mt-8 w-full">
              Essayer gratuitement
            </Link>
          </section>

          <section className="relative flex flex-col rounded-[var(--radius-ui)] border-2 border-coral bg-petal p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-coral">
              Le plus populaire
            </p>
            <h2 className="mt-1 text-lg font-bold text-ink sm:text-xl">Boost</h2>
            <p className="mt-1 text-sm text-ink-soft">
              Moins d’idées « au hasard ». Plus de plans qui collent à ce soir.
            </p>
            <p className="mt-5 flex flex-wrap items-end gap-x-2 gap-y-1">
              <span className="font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight text-ink">
                {BOOST_PRICE} €
              </span>
              <span className="pb-1 text-sm text-ink-soft">/ mois</span>
            </p>
            <p className="mt-1 text-sm font-medium text-coral">
              Un petit prix, zéro engagement
            </p>
            <ul className="mt-6 flex-1 space-y-2.5 text-sm text-ink">
              <li>Tout Basique, inclus</li>
              <li>Idées adaptées à ton lieu</li>
              <li>Selon la météo et le moment</li>
              <li>Propositions plus concrètes, moins génériques</li>
            </ul>
            <div className="mt-8 space-y-2">
              <Link href="/test" prefetch className="btn-primary w-full">
                Voir le flux (démo)
              </Link>
              <p className="text-center text-xs text-ink-soft">
                Paiement bientôt — la démo actuelle tourne en Basique.
              </p>
            </div>
          </section>
        </div>

        <section className="mx-auto mt-12 max-w-3xl sm:mt-16">
          <h2 className="text-lg font-bold text-ink sm:text-xl">
            La différence, clairement
          </h2>
          <p className="mt-2 text-sm text-ink-soft sm:text-[15px]">
            Même mécanique de vote. Ce qui change, c’est d’où viennent les idées.
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[320px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th className="py-3 pr-3 font-semibold text-ink"> </th>
                  <th className="px-2 py-3 font-semibold text-ink">Basique</th>
                  <th className="px-2 py-3 font-semibold text-coral">Boost</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-b border-line/80">
                    <th
                      scope="row"
                      className="py-3.5 pr-3 align-top font-medium text-ink"
                    >
                      {row.label}
                    </th>
                    <td className="px-2 py-3.5 align-top text-ink-soft">
                      {row.free}
                    </td>
                    <td className="px-2 py-3.5 align-top font-medium text-ink">
                      {row.boost}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mx-auto mt-10 max-w-2xl border-t border-line pt-8 sm:mt-12">
          <h2 className="text-base font-bold text-ink sm:text-lg">
            En une phrase
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft sm:text-[15px]">
            <span className="text-ink">Basique</span> tire dans un catalogue
            selon ton cadre. <span className="text-ink">Boost</span> compose
            pour vous : pluie + 40 min + près de chez toi ≠ samedi ensoleillé en
            centre-ville.
          </p>
          <p className="mt-4 text-sm font-medium text-ink">
            {BOOST_PRICE} €/mois — assez bas pour dire oui sans réfléchir, pour
            arrêter le « on verra ».
          </p>
        </section>

        <p className="mx-auto mt-10 max-w-xl text-center text-xs leading-relaxed text-ink-soft sm:mt-12">
          Annulable à tout moment. Pas d’engagement. Pas de frais cachés.
        </p>
      </div>
    </main>
  );
}
