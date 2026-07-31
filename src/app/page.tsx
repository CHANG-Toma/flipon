import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { AnimatedHeading } from "@/components/AnimatedHeading";
import { LandingHero } from "@/components/LandingHero";

const WaitlistForm = dynamic(
  () =>
    import("@/components/WaitlistForm").then((m) => m.WaitlistForm),
  {
    loading: () => (
      <div className="h-12 w-full max-w-md animate-pulse rounded-[var(--radius-ui)] bg-line/60" />
    ),
  },
);

export const metadata: Metadata = {
  title: "FlipOn — Sortir de la routine à deux",
  description:
    "FlipOn, c’est une petite app pour couples qui en ont marre de toujours faire la même chose. Vous votez chacun de votre côté, et vous repartez avec une idée d’activité.",
};

export default function HomePage() {
  return (
    <main>
      <LandingHero />

      <section className="border-b border-line bg-petal px-5 py-10 sm:px-8 content-auto">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-lg font-bold text-ink">
              Teste le vrai flux en 30 secondes.
            </p>
            <p className="mt-1 text-sm text-ink-soft">
              Cadre → vote → une idée. Sans créer de compte.
            </p>
          </div>
          <Link href="/test" prefetch className="btn-primary shrink-0">
            Lancer la démo
          </Link>
        </div>
      </section>

      <section className="content-auto px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-lg">
            <h2 className="sr-only">Le problème, c’est pas le manque d’idées.</h2>
            <AnimatedHeading
              text="Le problème, c’est pas le manque d’idées."
              className="text-2xl font-bold tracking-tight text-ink sm:text-3xl"
            />
            <p className="mt-3 text-base leading-relaxed text-ink-soft sm:text-lg">
              C’est le moment où personne ne tranche. FlipOn coupe court :
              chacun dit oui ou non de son côté, et on garde celle qui passe
              pour les deux.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              {
                t: "Cadre",
                d: "Temps, budget, énergie, dedans ou dehors — en quelques taps.",
              },
              {
                t: "Vote",
                d: "Chacun de son côté. Plus de « comme tu veux ».",
              },
              {
                t: "Idée",
                d: "Une seule proposition, avec les prochaines étapes.",
              },
            ].map((item) => (
              <div key={item.t} className="surface p-5">
                <h3 className="font-bold text-ink">{item.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {item.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="content-auto border-y border-line bg-sky/50 px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-xl">
          <AnimatedHeading
            text="Pas une app de rencontres. Pas un coach de couple."
            className="text-2xl font-bold text-ink"
          />
          <p className="mt-2 text-base leading-relaxed text-ink-soft">
            Juste pour varier un peu quand vous tournez en boucle.
          </p>
        </div>
      </section>

      <section className="content-auto px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-sm">
            <AnimatedHeading
              text="On construit encore."
              className="text-2xl font-bold text-ink"
            />
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Laisse ton mail si tu veux qu’on te prévienne. Pas de newsletter
              toutes les semaines.
            </p>
          </div>
          <WaitlistForm />
        </div>
      </section>

      <footer className="border-t border-line px-5 py-5 text-sm text-ink-soft sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <p className="font-bold text-ink">
            Flip<span className="text-coral">On</span>
          </p>
          <p>France · 2026</p>
        </div>
      </footer>
    </main>
  );
}
