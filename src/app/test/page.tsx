import { FlipDemo } from "@/components/FlipDemo";

export default function TestPage() {
  return (
    <main className="relative min-h-[100svh] overflow-hidden pt-24">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 10% 0%, rgba(31,111,106,0.12), transparent 55%), radial-gradient(ellipse 50% 40% at 100% 20%, rgba(232,71,42,0.1), transparent 50%), var(--sand-cool)",
        }}
      />
      <div className="texture-noise absolute inset-0" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-5 pb-20 sm:px-8 sm:pb-28">
        <header className="mb-12 max-w-2xl animate-rise">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-teal">
            Démo MVP
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-syne)] text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            Tester FlipOn
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            Version solo pour le MVP : vous jouez les deux rôles. Le flux réel
            lie deux comptes et croise les swipes en privé.
          </p>
        </header>

        <FlipDemo />
      </div>
    </main>
  );
}
