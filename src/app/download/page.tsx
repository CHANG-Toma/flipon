import type { Metadata } from "next";
import Link from "next/link";
import { getLang, withLang } from "@/lib/i18n";

type BenefitType = "bell" | "rocket" | "shield";
type PlatformPoint = { icon: BenefitType; text: string };

export const metadata: Metadata = {
  title: "Télécharger",
  description:
    "Télécharge FlipOn sur iOS ou Android pour passer vos meilleurs moments en toute simplicité.",
  alternates: { canonical: "/download" },
  openGraph: {
    title: "Télécharger FlipOn",
    description: "Choisis iOS ou Android pour installer FlipOn.",
    url: "/download",
  },
};

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M16.71 12.65c.03 3.2 2.82 4.27 2.85 4.29-.02.08-.44 1.52-1.45 3.02-.87 1.29-1.77 2.57-3.19 2.6-1.4.03-1.85-.83-3.45-.83-1.6 0-2.1.8-3.42.86-1.37.05-2.41-1.37-3.28-2.65-1.78-2.57-3.14-7.25-1.31-10.43.9-1.57 2.52-2.57 4.27-2.6 1.34-.03 2.6.9 3.45.9.85 0 2.46-1.12 4.14-.95.7.03 2.66.28 3.92 2.12-.1.06-2.34 1.36-2.33 4.07ZM14.5 5.3c.73-.88 1.22-2.1 1.09-3.3-1.05.04-2.3.7-3.05 1.58-.68.79-1.27 2.04-1.11 3.24 1.17.09 2.34-.6 3.07-1.52Z" />
    </svg>
  );
}

function AndroidIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M7.54 6.35 6.1 3.86a.75.75 0 1 1 1.3-.75l1.5 2.59a10.2 10.2 0 0 1 6.2 0l1.5-2.6a.75.75 0 0 1 1.3.76l-1.44 2.48a7.9 7.9 0 0 1 3.79 6.74H3.75a7.9 7.9 0 0 1 3.79-6.73Zm2.46 2.4a.9.9 0 1 0 0 1.8.9.9 0 0 0 0-1.8Zm4 0a.9.9 0 1 0 0 1.8.9.9 0 0 0 0-1.8ZM5 13.9h1.6V19A2 2 0 0 0 8.6 21h.4v2a1 1 0 1 0 2 0v-2h2v2a1 1 0 1 0 2 0v-2h.4a2 2 0 0 0 2-2v-5.1H19a1 1 0 0 0 0-2H5a1 1 0 1 0 0 2Z" />
    </svg>
  );
}

function BenefitIcon({ type }: { type: BenefitType }) {
  if (type === "bell") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
        <path d="M12 4a4 4 0 0 0-4 4v1.8c0 .9-.3 1.8-.9 2.5L6 13.5h12l-1.1-1.2a3.8 3.8 0 0 1-.9-2.5V8a4 4 0 0 0-4-4Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 17a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "rocket") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
        <path d="M14.5 4.5c2.7.2 5.1 2.6 5.3 5.3-2.3.7-4.5 1.9-6.3 3.6L10.6 16l-2.6-2.6 2.6-2.9c1.7-1.8 3-4 3.9-6Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m8 16-2 2m4 0-2 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path d="m12 3 7 3v5c0 4.3-2.7 8.2-7 9.7C7.7 19.2 5 15.3 5 11V6l7-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m9.5 11.8 1.8 1.8 3.2-3.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlatformIcon({ name }: { name: "iOS" | "Android" }) {
  return name === "iOS" ? <AppleIcon /> : <AndroidIcon />;
}

function PlatformBadge({
  name,
  children,
}: {
  name: "iOS" | "Android";
  children: React.ReactNode;
}) {
  const style =
    name === "iOS"
      ? "border-[#0369a1]/25 bg-[#e0f2fe] text-[#0c4a6e]"
      : "border-[#166534]/25 bg-[#dcfce7] text-[#14532d]";
  return (
    <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${style}`}>
      {children}
    </span>
  );
}

export default async function DownloadPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const lang = getLang(await searchParams);
  const isEn = lang === "en";
  const platforms: Array<{
    name: "iOS" | "Android";
    icon: string;
    status: string;
    note: string;
    accent: string;
    cta: string;
    points: PlatformPoint[];
  }> = [
    {
      name: "iOS",
      icon: "iPhone",
      status: isEn ? "Coming soon" : "Bientôt disponible",
      note: isEn
        ? "iPhone (iOS 17+) · extra smooth experience for couples and groups."
        : "iPhone (iOS 17+) · expérience ultra fluide, pensée pour les moments à deux ou en groupe.",
      accent: "from-[#7dd3fc]/20 to-transparent",
      cta: isEn ? "Get on iPhone" : "Recevoir sur iPhone",
      points: isEn
        ? [
            { icon: "bell", text: "App Store launch alert" },
            { icon: "shield", text: "Guided onboarding in under a minute" },
            { icon: "rocket", text: "Priority access to iOS updates" },
          ]
        : [
            { icon: "bell", text: "Alerte dès la sortie sur l’App Store" },
            { icon: "shield", text: "Onboarding guidé en moins d’une minute" },
            { icon: "rocket", text: "Priorité sur les nouveautés iOS" },
          ],
    },
    {
      name: "Android",
      icon: "Android",
      status: isEn ? "Coming soon" : "Bientôt disponible",
      note: isEn
        ? "Android 10+ · fast and lightweight for quick group decisions."
        : "Android 10+ · rapide, léger, parfait pour lancer une décision en quelques secondes.",
      accent: "from-[#86efac]/20 to-transparent",
      cta: isEn ? "Get on Android" : "Recevoir sur Android",
      points: isEn
        ? [
            { icon: "bell", text: "Instant Play Store launch notification" },
            { icon: "rocket", text: "Fast and simple install" },
            { icon: "shield", text: "Wide Android compatibility" },
          ]
        : [
            { icon: "bell", text: "Notification immédiate ouverture Play Store" },
            { icon: "rocket", text: "Installation rapide et simple" },
            { icon: "shield", text: "Compatibilité large Android" },
          ],
    },
  ] as const;
  const waitlistHref = lang === "en" ? "/?lang=en#waitlist" : "/#waitlist";

  return (
    <main className="safe-bottom bg-[radial-gradient(ellipse_120%_65%_at_50%_-10%,color-mix(in_srgb,var(--coral)_8%,white),transparent_60%)] pb-12 pt-6 sm:pb-20 sm:pt-10">
      <div className="page-gutter mx-auto max-w-5xl">
        <header className="mx-auto max-w-2xl animate-rise text-center">
          <p className="premium-kicker">
            {isEn ? "Download" : "Téléchargement"}
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">
            {isEn ? "Choose your platform" : "Choisis ta plateforme"}
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-ink-soft sm:text-base">
            {isEn
              ? "FlipOn helps you enjoy your best moments with less friction. Download on iOS or Android."
              : "FlipOn t’aide à passer vos meilleurs moments en toute simplicité. Télécharge l’app sur iOS ou Android."}
          </p>
          <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-coral/25 bg-coral/10 px-3 py-1.5 text-xs font-semibold text-coral">
            <span className="h-1.5 w-1.5 rounded-full bg-coral" />
            {isEn ? "Mobile launch soon" : "Lancement mobile imminent"}
          </div>
        </header>

        <section className="mx-auto mt-8 grid max-w-4xl gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5">
          {platforms.map((platform) => (
            <article
              key={platform.name}
              className="premium-card relative flex flex-col p-5 transition-transform duration-200 hover:-translate-y-0.5 hover:border-coral/35 sm:p-6"
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${platform.accent} opacity-80`}
                aria-hidden
              />
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-coral/15 blur-2xl" />

              <div className="relative z-10">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                      {platform.icon}
                    </p>
                    <h2 className="mt-1 flex items-center gap-2 text-2xl font-bold tracking-tight text-ink">
                      <span
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-xl ${
                          platform.name === "iOS"
                            ? "bg-[#38bdf8]/20 text-[#0369a1]"
                            : "bg-[#22c55e]/20 text-[#166534]"
                        }`}
                      >
                        <PlatformIcon name={platform.name} />
                      </span>
                      {platform.name}
                    </h2>
                  </div>
                  <PlatformBadge name={platform.name}>
                    {platform.status}
                  </PlatformBadge>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  {platform.note}
                </p>

                <ul className="mt-4 space-y-1.5 text-xs text-ink-soft">
                  {platform.points.map((point) => (
                    <li key={point.text} className="flex items-center gap-2">
                      <span
                        className={
                          platform.name === "iOS" ? "text-[#7dd3fc]" : "text-[#86efac]"
                        }
                      >
                        <BenefitIcon type={point.icon} />
                      </span>
                      {point.text}
                    </li>
                  ))}
                </ul>

                <Link href={waitlistHref} className="btn-primary mt-6 w-full">
                  {platform.cta}
                </Link>
                <p className="mt-2 text-center text-xs text-ink-soft">
                  {isEn
                    ? "We will notify you as soon as stores open."
                    : "On te prévient dès l’ouverture des stores."}
                </p>
              </div>
            </article>
          ))}
        </section>

        <section className="premium-soft mx-auto mt-8 max-w-2xl p-5 text-center sm:mt-10 sm:p-6">
          <p className="text-sm leading-relaxed text-ink-soft">
            {isEn
              ? "Want to try now? The web version is already available."
              : "Tu veux tester maintenant ? La version web est déjà disponible."}
          </p>
          <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
            <Link
              href={withLang("/test", lang)}
              className="btn-secondary w-full sm:w-auto"
            >
              {isEn ? "Try web demo" : "Essayer la démo web"}
            </Link>
            <Link href={withLang("/tarifs", lang)} className="btn-primary w-full sm:w-auto">
              {isEn ? "Back to pricing" : "Retour aux tarifs"}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
