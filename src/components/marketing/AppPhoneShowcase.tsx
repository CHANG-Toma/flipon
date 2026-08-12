"use client";

import { MarketingPhoneShot } from "@/components/marketing/MarketingPhoneShot";
import type { Lang } from "@/lib/i18n";

type Variant = "hero" | "section";

type Props = {
  lang?: Lang;
  /** hero = 2 phones · section = 3 phones avec légendes */
  variant?: Variant;
  className?: string;
};

const SHOTS = {
  session: "/marketing/home-session.webp",
  join: "/marketing/home-join.webp",
  nearby: "/marketing/home-nearby.webp",
  history: "/marketing/history.webp",
} as const;

function PhoneSlot({
  tilt,
  zIndex,
  src,
  alt,
  label,
  caption,
  priority,
}: {
  tilt: "back" | "front" | "center";
  zIndex: number;
  src: string;
  alt: string;
  label?: string;
  caption?: string;
  priority?: boolean;
}) {
  return (
    <figure
      className={`phone-showcase-slot phone-showcase-slot--${tilt}`}
      style={{ zIndex }}
    >
      {label ? (
        <figcaption className="phone-showcase-label">{label}</figcaption>
      ) : null}
      <MarketingPhoneShot src={src} alt={alt} priority={priority} />
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
        aria-label={
          isEn
            ? "FlipOn app screenshots: home and history"
            : "Captures FlipOn : accueil et historique"
        }
      >
        <PhoneSlot
          tilt="back"
          zIndex={1}
          src={SHOTS.history}
          alt={isEn ? "FlipOn history screen" : "Écran historique FlipOn"}
        />
        <PhoneSlot
          tilt="front"
          zIndex={2}
          src={SHOTS.session}
          alt={
            isEn
              ? "FlipOn home — new session"
              : "Accueil FlipOn — nouvelle session"
          }
          priority
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
        src={SHOTS.join}
        alt={isEn ? "FlipOn — join with code" : "FlipOn — rejoindre avec un code"}
        label={isEn ? "1. Join" : "1. Rejoindre"}
        caption={
          isEn
            ? "Enter a 4-letter code and jump into a friend’s session"
            : "Entre un code à 4 lettres et rejoins une session"
        }
      />
      <PhoneSlot
        tilt="center"
        zIndex={2}
        src={SHOTS.session}
        alt={isEn ? "FlipOn — new session" : "FlipOn — nouvelle session"}
        label={isEn ? "2. Start" : "2. Lancer"}
        caption={
          isEn
            ? "Private vote · one shared plan for the group"
            : "Vote privé · un plan commun pour le groupe"
        }
      />
      <PhoneSlot
        tilt="front"
        zIndex={3}
        src={SHOTS.nearby}
        alt={isEn ? "FlipOn — around you" : "FlipOn — autour de toi"}
        label={isEn ? "3. Nearby" : "3. Autour"}
        caption={
          isEn
            ? "Premium context: place, weather, and nearby ideas"
            : "Contexte Premium : lieu, météo et idées près de toi"
        }
      />
    </div>
  );
}
