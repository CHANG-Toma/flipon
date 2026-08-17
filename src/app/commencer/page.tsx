import type { Metadata } from "next";
import { StartAccountForm } from "@/components/StartAccountForm";
import { MarketingPhoneShot } from "@/components/marketing/MarketingPhoneShot";
import { PHONE_SHOTS } from "@/components/marketing/phone-shots";
import { getLang } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Commencer",
  description:
    "Créez votre compte FlipOn et essayez pendant 7 jours — vote privé, un plan commun.",
  alternates: { canonical: "/commencer" },
  openGraph: {
    title: "Essayez FlipOn pendant 7 jours",
    description:
      "Créez votre compte et lancez un plan commun — vote privé, une activité pour tout le groupe.",
    url: "/commencer",
  },
};

export default async function StartPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const lang = getLang(params);
  const isEn = lang === "en";
  const rawMode = Array.isArray(params?.mode) ? params?.mode[0] : params?.mode;
  const mode = rawMode === "login" ? "login" : "signup";

  return (
    <main data-nav-overlay className="start-page">
      <section className="start-split" aria-label={isEn ? "Get started" : "Commencer"}>
        <div className="start-split-visual">
          <div className="start-split-glow" aria-hidden />
          <div className="start-split-phones" aria-hidden>
            <MarketingPhoneShot
              shot={PHONE_SHOTS.nearbyPortrait}
              alt=""
              sizes="(max-width: 1023px) 0px, 240px"
              className="start-split-phone start-split-phone--side"
            />
            <MarketingPhoneShot
              shot={PHONE_SHOTS.sessionPortrait}
              alt=""
              priority
              sizes="(max-width: 1023px) 0px, 300px"
              className="start-split-phone start-split-phone--main"
            />
          </div>
          <div className="start-split-caption">
            <p className="start-split-kicker">FlipOn</p>
            <p className="start-split-heading">
              {isEn ? "One shared plan." : "Un plan commun."}
            </p>
            <p className="start-split-text">
              {isEn
                ? "FlipOn reads the moment — the group, the place, the time — and locks one activity everyone can do."
                : "FlipOn lit le moment — le groupe, le lieu, l’heure — et verrouille une activité que tout le monde peut faire."}
            </p>
          </div>
        </div>

        <div className="start-split-panel">
          <StartAccountForm lang={lang} mode={mode} />
        </div>
      </section>
    </main>
  );
}
