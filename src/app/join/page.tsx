import type { Metadata } from "next";
import Link from "next/link";
import { JoinSessionForm } from "@/components/JoinSessionForm";
import { getLang, withLang } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Rejoindre une session",
  description:
    "Entre le code à 4 lettres pour rejoindre une session FlipOn déjà créée et voter dans le navigateur.",
  alternates: { canonical: "/join" },
  robots: { index: true, follow: true },
};

export default async function JoinLandingPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const lang = getLang(await searchParams);
  const isEn = lang === "en";

  return (
    <main className="safe-bottom min-h-[70vh] bg-[radial-gradient(ellipse_120%_60%_at_50%_-10%,color-mix(in_srgb,var(--coral)_7%,white),transparent_60%)] pb-10 pt-5 sm:pb-16 sm:pt-8">
      <div className="page-gutter mx-auto max-w-lg space-y-6">
        <header className="text-center sm:text-left">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-coral">
            FlipOn
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            {isEn ? "Join a session" : "Rejoindre une session"}
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
            {isEn
              ? "Enter the code shared by the person who created the session. You’ll vote privately in your browser."
              : "Entre le code partagé par la personne qui a créé la session. Tu votes en privé dans ton navigateur."}
          </p>
        </header>

        <JoinSessionForm lang={lang} />

        <div className="flex flex-col gap-2 text-center sm:flex-row sm:justify-between sm:text-left">
          <Link
            href={withLang("/test", lang)}
            className="text-sm font-medium text-ink-soft hover:text-ink"
          >
            {isEn ? "Create a new session instead" : "Créer une nouvelle session"}
          </Link>
          <Link
            href={withLang("/download", lang)}
            className="text-sm font-medium text-coral hover:text-coral-deep"
          >
            {isEn ? "Get the mobile app" : "Télécharger l’application"}
          </Link>
        </div>
      </div>
    </main>
  );
}
