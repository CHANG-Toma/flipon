import type { Metadata } from "next";
import Link from "next/link";
import { StartAccountForm } from "@/components/StartAccountForm";
import { MarketingPhoneShot } from "@/components/marketing/MarketingPhoneShot";
import { PHONE_SHOTS } from "@/components/marketing/phone-shots";
import { getLang, withLang } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Commencer",
  description:
    "Créez votre compte FlipOn et essayez Premium gratuitement pendant 7 jours.",
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
          <div className="start-split-phones" aria-hidden>
            <MarketingPhoneShot
              shot={PHONE_SHOTS.sessionPortrait}
              alt=""
              priority
              sizes="(max-width: 1023px) 0px, 280px"
              className="start-split-phone start-split-phone--main"
            />
            <MarketingPhoneShot
              shot={PHONE_SHOTS.nearbyPortrait}
              alt=""
              sizes="(max-width: 1023px) 0px, 220px"
              className="start-split-phone start-split-phone--side"
            />
          </div>
          <div className="start-split-caption">
            <p className="start-split-heading">
              {isEn ? "One shared plan." : "Un plan commun."}
            </p>
            <p className="start-split-text">
              {isEn
                ? "FlipOn reads the moment — the group, the place, the time — and locks one activity everyone can do."
                : "FlipOn lit le moment — le groupe, le lieu, l’heure — et verrouille une activité que tout le monde peut faire."}
            </p>
            <Link href="#start-more" className="start-split-scroll">
              {isEn ? "Scroll to learn more" : "Faites défiler pour en savoir plus"}
            </Link>
          </div>
        </div>

        <div className="start-split-panel">
          <StartAccountForm lang={lang} mode={mode} />
        </div>
      </section>

      <section id="start-more" className="start-more page-gutter">
        <div className="start-more-inner">
          <p className="landing-kicker">
            {isEn ? "7-day trial" : "Essai 7 jours"}
          </p>
          <h2 className="landing-h2 mt-4 max-w-2xl">
            {isEn
              ? "Create an account, then decide together."
              : "Créez un compte, puis tranchez ensemble."}
          </h2>
          <ul className="start-more-points">
            {(isEn
              ? [
                  "Private vote, no social pressure",
                  "One result for the whole group",
                  "Ideas that fit where you are, any time of day",
                ]
              : [
                  "Vote privé, sans pression",
                  "Un seul résultat pour tout le groupe",
                  "Des idées qui collent au lieu, à n’importe quelle heure",
                ]
            ).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="start-more-note">
            {isEn ? (
              <>
                Have a 4-letter code?{" "}
                <Link href={withLang("/join", lang)}>Join a session</Link>
                {" · "}
                <Link href={withLang("/test", lang)}>Try the web demo</Link>
              </>
            ) : (
              <>
                Tu as un code à 4 lettres ?{" "}
                <Link href={withLang("/join", lang)}>Rejoindre une session</Link>
                {" · "}
                <Link href={withLang("/test", lang)}>Essayer la démo web</Link>
              </>
            )}
          </p>
        </div>
      </section>
    </main>
  );
}
