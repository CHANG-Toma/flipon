import { Suspense } from "react";
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
            Solo ou à deux sur deux téléphones. Votes privés, une idée en
            commun. Sur la vraie app, chacun ouvre FlipOn directement.
          </p>
        </header>

        <Suspense
          fallback={
            <div className="mx-auto h-40 w-full max-w-md animate-pulse rounded-[var(--radius-ui)] bg-foam" />
          }
        >
          <FlipDemo />
        </Suspense>
      </div>
    </main>
  );
}
