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
  title: "FlipOn — Une activité validée par tout le groupe",
  description:
    "Cadre, vote privé, une idée : FlipOn sort l’activité où tout le monde a dit oui — potes, couple, colloc.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <main>
      <LandingHero />

      <section className="content-auto border-b border-line bg-petal page-gutter py-8 sm:py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-base font-bold text-ink sm:text-lg">
              Cadre → vote privé → idée commune.
            </p>
            <p className="mt-1 text-sm text-ink-soft">
              Le vrai flux FlipOn, en 30 secondes. Sans compte.
            </p>
          </div>
          <Link href="/test" prefetch className="btn-primary w-full shrink-0 sm:w-auto">
            Essayer maintenant
          </Link>
        </div>
      </section>

      <section className="content-auto page-gutter py-12 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-lg">
            <h2 className="sr-only">
              FlipOn sert à trancher une activité en groupe.
            </h2>
            <AnimatedHeading
              text="Le frein, c’est pas le manque d’idées."
              className="text-xl font-bold tracking-tight text-ink sm:text-3xl"
            />
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft sm:text-lg">
              C’est quand personne n’ose choisir. FlipOn enlève la pression :
              chacun répond de son côté, sans influencer l’autre.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-3 sm:gap-4">
            {[
              {
                t: "1. Cadre",
                d: "Ce soir : temps, budget, ambiance.",
              },
              {
                t: "2. Vote",
                d: "Oui ou passer — l’autre ne voit pas.",
              },
              {
                t: "3. Go",
                d: "Une idée + les prochaines étapes.",
              },
            ].map((item) => (
              <div key={item.t} className="surface p-4 sm:p-5">
                <h3 className="font-bold text-ink">{item.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {item.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="content-auto border-y border-line page-gutter py-10 sm:py-14">
        <div className="mx-auto max-w-xl">
          <AnimatedHeading
            text="Pas une app de rencontres. Un outil pour décider."
            className="text-xl font-bold text-ink sm:text-2xl"
          />
          <p className="mt-2 text-[15px] leading-relaxed text-ink-soft sm:text-base">
            Potes, couple, colloc ou soirée : même usage. « Date » filtre juste
            le type d’idées — rien à voir avec des profils.
          </p>
        </div>
      </section>

      <section
        id="waitlist"
        className="content-auto scroll-mt-20 page-gutter py-12 sm:py-20"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-sm">
            <AnimatedHeading
              text="On construit encore."
              className="text-xl font-bold text-ink sm:text-2xl"
            />
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Laisse ton mail si tu veux qu’on te prévienne — ou un retour après
              la démo. Pas de newsletter toutes les semaines.
            </p>
          </div>
          <WaitlistForm />
        </div>
      </section>

      <footer className="safe-bottom border-t border-line page-gutter py-5 text-sm text-ink-soft">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <p className="font-bold text-ink">
            Flip<span className="text-coral">On</span>
          </p>
          <p>France · 2026</p>
        </div>
      </footer>
    </main>
  );
}
