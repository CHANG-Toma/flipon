import type { Metadata } from "next";
import { TestModeSwitcher } from "@/components/TestModeSwitcher";
import { getLang } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Essayer",
  description:
    "Teste FlipOn en solo ou à deux téléphones : cadre (ambiance, temps, budget), vote privé, une idée commune.",
  alternates: { canonical: "/test" },
  openGraph: {
    title: "Essayer FlipOn",
    description:
      "Cadre → vote privé → une idée. Solo ou duo sur deux téléphones.",
    url: "/test",
  },
};

export default async function TestPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const lang = getLang(await searchParams);
  return (
    <main className="safe-bottom bg-[radial-gradient(ellipse_120%_60%_at_50%_-10%,color-mix(in_srgb,var(--coral)_7%,white),transparent_60%)] pb-12 pt-6 sm:pb-20 sm:pt-10">
      <div className="page-gutter mx-auto max-w-5xl">
        <TestModeSwitcher lang={lang} />
      </div>
    </main>
  );
}
