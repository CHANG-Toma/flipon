import type { Metadata } from "next";
import { JoinBridge } from "@/components/JoinBridge";

type Props = {
  params: Promise<{ code: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const normalized = code.trim().toUpperCase();
  return {
    title: `Rejoindre ${normalized}`,
    description: "Rejoins une session FlipOn depuis ton navigateur ou l’application.",
    alternates: { canonical: `/join/${normalized}` },
    robots: { index: false, follow: false },
  };
}

export default async function JoinPage({ params }: Props) {
  const { code } = await params;
  const normalized = code.trim().toUpperCase().replace(/^FLIP-/, "");

  return (
    <main className="safe-bottom min-h-[70vh] bg-[radial-gradient(ellipse_120%_60%_at_50%_-10%,color-mix(in_srgb,var(--coral)_7%,white),transparent_60%)] pb-10 pt-5 sm:pb-16 sm:pt-8">
      <div className="page-gutter mx-auto max-w-5xl">
        <JoinBridge code={normalized || "????"} />
      </div>
    </main>
  );
}
