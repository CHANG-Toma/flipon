import { MarketingPhoneShot } from "@/components/marketing/MarketingPhoneShot";
import { PHONE_SHOTS, type PhoneShot } from "@/components/marketing/phone-shots";
import type { Lang } from "@/lib/i18n";

type Variant = "hero" | "section";

type Props = {
  lang?: Lang;
  /** hero = 2 phones · section = 3 phones avec légendes */
  variant?: Variant;
  className?: string;
};

function PhoneSlot({
  tilt,
  zIndex,
  shot,
  alt,
  label,
  caption,
  priority,
  sizes,
}: {
  tilt: "back" | "front" | "center";
  zIndex: number;
  shot: PhoneShot;
  alt: string;
  label?: string;
  caption?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <figure
      className={`phone-showcase-slot phone-showcase-slot--${tilt}`}
      style={{ zIndex }}
    >
      {label ? (
        <figcaption className="phone-showcase-label">{label}</figcaption>
      ) : null}
      <MarketingPhoneShot
        shot={shot}
        alt={alt}
        priority={priority}
        sizes={sizes}
      />
      {caption ? <p className="phone-showcase-caption">{caption}</p> : null}
    </figure>
  );
}

export function AppPhoneShowcase({
  lang = "fr",
  variant = "hero",
  className = "",
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
          priority
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
        label={isEn ? "1. Join" : "1. Rejoindre"}
        caption={
          isEn
            ? "Enter a 4-letter code and jump into a friend’s session"
            : "Entre un code à 4 lettres et rejoins une session"
        }
        sizes="(max-width: 767px) 70vw, 220px"
      />
      <PhoneSlot
        tilt="center"
        zIndex={2}
        shot={PHONE_SHOTS.sessionPortrait}
        alt={
          isEn
            ? "iPhone showing FlipOn: new session, private vote, shared plan"
            : "iPhone affichant FlipOn : nouvelle session, vote privé, plan commun"
        }
        label={isEn ? "2. Start" : "2. Lancer"}
        caption={
          isEn
            ? "Private vote · one shared plan for the group"
            : "Vote privé · un plan commun pour le groupe"
        }
        sizes="(max-width: 767px) 70vw, 240px"
      />
      <PhoneSlot
        tilt="front"
        zIndex={3}
        shot={PHONE_SHOTS.nearbyPortrait}
        alt={
          isEn
            ? "iPhone showing FlipOn nearby activities around your position"
            : "iPhone affichant FlipOn : activités autour de toi"
        }
        label={isEn ? "3. Nearby" : "3. Autour"}
        caption={
          isEn
            ? "Premium context: place, weather, and nearby ideas"
            : "Contexte Premium : lieu, météo et idées près de toi"
        }
        sizes="(max-width: 767px) 70vw, 220px"
      />
    </div>
  );
}
