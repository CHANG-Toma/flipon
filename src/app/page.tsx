import Link from "next/link";
import { WaitlistForm } from "@/components/WaitlistForm";

export default function HomePage() {
  return (
    <main>
      <section className="relative min-h-[100svh] overflow-hidden hero-atmosphere">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=2000&q=80"
          alt=""
          className="animate-drift absolute inset-0 h-full w-full object-cover opacity-35"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f2a36]/92 via-[#0f2a36]/75 to-[#1a4550]/55" aria-hidden />
        <div className="texture-noise absolute inset-0" aria-hidden />

        <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-5 pb-16 pt-28 sm:px-8 sm:pb-20 lg:justify-center lg:pb-24">
          <div className="max-w-2xl">
            <p className="animate-rise font-[family-name:var(--font-syne)] text-5xl font-extrabold tracking-tight text-white sm:text-7xl md:text-8xl">
              Flip<span className="text-coral">On</span>
            </p>
            <h1 className="animate-rise-delay-1 mt-5 max-w-xl font-[family-name:var(--font-syne)] text-2xl font-semibold leading-snug tracking-tight text-white sm:text-3xl md:text-4xl">
              Fini le « on verra » — matchez un plan ce soir.
            </h1>
            <p className="animate-rise-delay-2 mt-4 max-w-md text-base leading-relaxed text-white/80 sm:text-lg">
              Contraintes, swipe à deux, un seul plan. Moins d’une minute pour
              sortir de la routine.
            </p>

            <div className="animate-rise-delay-2 mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/test"
                className="inline-flex h-12 items-center justify-center bg-coral px-7 text-[15px] font-semibold text-white transition-colors hover:bg-coral-deep"
              >
                Tester FlipOn
              </Link>
              <Link
                href="/presentation"
                className="inline-flex h-12 items-center justify-center border border-white/35 px-7 text-[15px] font-semibold text-white transition-colors hover:bg-white/10"
              >
                Voir la présentation
              </Link>
            </div>
          </div>

          <div
            className="pointer-events-none absolute bottom-[18%] right-[6%] hidden w-[280px] lg:block xl:right-[10%] xl:w-[320px]"
            aria-hidden
          >
            <div className="animate-flip-pulse border border-white/20 bg-white/10 p-5 backdrop-blur-md">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
                Match duo
              </p>
              <p className="mt-3 font-[family-name:var(--font-syne)] text-2xl font-bold text-white">
                Sunset + glace
              </p>
              <p className="mt-2 text-sm text-white/70">
                60 min · 15 € · dehors
              </p>
              <div className="mt-5 h-1.5 w-full bg-white/15">
                <div className="h-full w-4/5 bg-coral" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-wash px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <h2 className="font-[family-name:var(--font-syne)] text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Une décision. Pas une liste.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              FlipOn ne vous noie pas sous 40 idées. Les deux partenaires
              swipent en privé — l’app sort le plan sur lequel vous êtes
              d’accord.
            </p>
          </div>

          <ol className="mt-14 grid gap-10 sm:grid-cols-3">
            {[
              {
                n: "01",
                t: "Contraintes",
                d: "Durée, budget, énergie, dedans ou dehors — en 20 secondes.",
              },
              {
                n: "02",
                t: "Swipe duo",
                d: "Chacun vote en privé sur quelques options. Zéro débat.",
              },
              {
                n: "03",
                t: "Le match",
                d: "Un seul plan, avec des étapes concrètes. Puis vous le faites.",
              },
            ].map((item) => (
              <li key={item.n} className="border-t border-ink/15 pt-6">
                <p className="font-[family-name:var(--font-syne)] text-sm font-bold text-coral">
                  {item.n}
                </p>
                <h3 className="mt-3 font-[family-name:var(--font-syne)] text-xl font-bold text-ink">
                  {item.t}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                  {item.d}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-ink px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <h2 className="font-[family-name:var(--font-syne)] text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Premiers couples testeurs
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/70">
              MVP en construction. Laissez votre email pour la waitlist — on
              lance d’abord en France.
            </p>
          </div>
          <WaitlistForm light />
        </div>
      </section>

      <footer className="border-t border-ink/10 bg-sand-cool px-5 py-8 text-sm text-ink-soft sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>
            <span className="font-[family-name:var(--font-syne)] font-bold text-ink">
              FlipOn
            </span>{" "}
            — casser la routine à deux.
          </p>
          <p>MVP · France · 2026</p>
        </div>
      </footer>
    </main>
  );
}
