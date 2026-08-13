import { MarketingPhoneShot } from "@/components/marketing/MarketingPhoneShot";
import { PHONE_SHOTS, type PhoneShot } from "@/components/marketing/phone-shots";
import type { Lang } from "@/lib/i18n";

type Variant = "hero" | "section";

type Props = {
  lang?: Lang;
  /** hero = 2 phones · section = 3 phones */
  variant?: Variant;
  className?: string;
  /** LCP: only the first hero on the page */
  priority?: boolean;
};

function PhoneSlot({
  tilt,
  zIndex,
  shot,
  alt,
  priority,
  sizes,
}: {
  tilt: "back" | "front" | "center";
  zIndex: number;
  shot: PhoneShot;
  alt: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <figure
      className={`phone-showcase-slot phone-showcase-slot--${tilt}`}
      style={{ zIndex }}
    >
      <MarketingPhoneShot
        shot={shot}
        alt={alt}
        priority={priority}
        sizes={sizes}
      />
    </figure>
  );
}

export function AppPhoneShowcase({
  lang = "fr",
  variant = "hero",
  className = "",
  priority = false,
}: Props) {
  const isEn = lang === "en";

  if (variant === "hero") {
    return (
      <div
        className={["phone-showcase phone-showcase--hero", className]
          .filter(Boolean)
          .join(" ")}
        role="group"
        aria-label={
          isEn
            ? "FlipOn on iPhone: new session and activity history"
            : "FlipOn sur iPhone : nouvelle session et historique"
        }
      >
        <PhoneSlot
          tilt="front"
          zIndex={2}
          shot={PHONE_SHOTS.sessionPortrait}
          alt={
            isEn
              ? "iPhone showing FlipOn home: start a private-vote session"
              : "iPhone affichant l’accueil FlipOn : lancer une session à vote privé"
          }
          priority={priority}
          sizes="(max-width: 479px) 70vw, (max-width: 1023px) 42vw, 252px"
        />
        <PhoneSlot
          tilt="back"
          zIndex={1}
          shot={PHONE_SHOTS.historyLeft}
          alt={
            isEn
              ? "iPhone showing FlipOn history of validated group activities"
              : "iPhone affichant l’historique FlipOn des activités validées"
          }
          sizes="(max-width: 479px) 0px, (max-width: 1023px) 38vw, 232px"
        />
      </div>
    );
  }

  return (
    <div
      className={["phone-showcase phone-showcase--section", className]
        .filter(Boolean)
        .join(" ")}
      role="group"
      aria-label={
        isEn
          ? "FlipOn on iPhone: join, new session, and nearby"
          : "FlipOn sur iPhone : rejoindre, nouvelle session, autour de toi"
      }
    >
      <PhoneSlot
        tilt="back"
        zIndex={1}
        shot={PHONE_SHOTS.joinPortrait}
        alt={
          isEn
            ? "iPhone showing FlipOn: join a session with a 4-letter code"
            : "iPhone affichant FlipOn : rejoindre une session avec un code à 4 lettres"
        }
        sizes="(max-width: 767px) 70vw, 220px"
      />
      <PhoneSlot
        tilt="center"
        zIndex={1}
        shot={PHONE_SHOTS.sessionPortrait}
        alt={
          isEn
            ? "iPhone showing FlipOn: new session, private vote, shared plan"
            : "iPhone affichant FlipOn : nouvelle session, vote privé, plan commun"
        }
        sizes="(max-width: 767px) 70vw, 240px"
      />
      <PhoneSlot
        tilt="front"
        zIndex={1}
        shot={PHONE_SHOTS.nearbyPortrait}
        alt={
          isEn
            ? "iPhone showing FlipOn nearby activities around your position"
            : "iPhone affichant FlipOn : activités autour de toi"
        }
        sizes="(max-width: 767px) 70vw, 220px"
      />
    </div>
  );
}
