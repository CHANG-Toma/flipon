import { FlipDemo } from "@/components/FlipDemo";

export default function TestPage() {
  return (
    <main className="min-h-[100svh] pb-20 pt-8">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <header className="mx-auto mb-8 max-w-md animate-rise text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-ink">
            Essayer FlipOn
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Démo solo : tu votes pour les deux. Plus tard, chacun aura son
            côté.
          </p>
        </header>

        <FlipDemo />
      </div>
    </main>
  );
}
