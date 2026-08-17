"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DemoPhoneFrame } from "@/components/DemoPhoneFrame";
import { FlipDemo } from "@/components/FlipDemo";
import type { Lang } from "@/lib/i18n";

function TestDemoInner({ lang }: { lang: Lang }) {
  const isEn = lang === "en";
  const searchParams = useSearchParams();
  const inRoom = Boolean(searchParams.get("room"));

  if (inRoom) {
    return (
      <section className="mx-auto max-w-md space-y-4">
        <div className="border-b border-line pb-4">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {isEn ? "Session in progress" : "Session en cours"}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            {isEn
              ? "Vote privately — results appear once everyone has voted."
              : "Vote en privé — les résultats apparaissent quand tout le monde a voté."}
          </p>
        </div>
        <FlipDemo lang={lang} />
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-md">
      <DemoPhoneFrame>
        <FlipDemo lang={lang} compact />
      </DemoPhoneFrame>
    </section>
  );
}

export function TestModeSwitcher({ lang }: { lang: Lang }) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md">
          <div className="h-[32rem] animate-pulse rounded-[var(--radius-ui)] bg-foam" />
        </div>
      }
    >
      <TestDemoInner lang={lang} />
    </Suspense>
  );
}
