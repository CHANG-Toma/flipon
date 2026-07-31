import { Suspense } from "react";
import { FlipDemo } from "@/components/FlipDemo";

export default function TestPage() {
  return (
    <main className="safe-bottom min-h-[100dvh] pb-10 pt-5 sm:pb-20 sm:pt-8">
      <div className="page-gutter mx-auto max-w-5xl">
        <header className="mx-auto mb-6 max-w-md animate-rise text-left sm:mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
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
