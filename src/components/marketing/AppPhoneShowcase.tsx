"use client";

import type { ReactNode } from "react";
import { MarketingPhoneFrame } from "@/components/marketing/MarketingPhoneFrame";
import {
  PreviewResultScreen,
  PreviewSetupScreen,
  PreviewVoteScreen,
} from "@/components/marketing/AppPreviewScreens";
import type { Lang } from "@/lib/i18n";

type Variant = "hero" | "section";

type Props = {
  lang?: Lang;
  /** hero = 2 phones (vote + result) · section = 3 phones avec légendes */
  variant?: Variant;
  className?: string;
};

function PhoneSlot({
  tilt,
  zIndex,
  children,
  label,
  caption,
}: {
  tilt: "back" | "front" | "center";
  zIndex: number;
  children: ReactNode;
  label?: string;
  caption?: string;
}) {
  return (
    <figure
      className={`phone-showcase-slot phone-showcase-slot--${tilt}`}
      style={{ zIndex }}
    >
      {label ? (
        <figcaption className="phone-showcase-label">{label}</figcaption>
      ) : null}
      <MarketingPhoneFrame>{children}</MarketingPhoneFrame>
      {caption ? (
        <p className="phone-showcase-caption">{caption}</p>
      ) : null}
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
            ? "FlipOn app previews: vote and shared result"
            : "Aperçus FlipOn : vote et résultat commun"
        }
      >
        <PhoneSlot tilt="back" zIndex={1}>
          <PreviewVoteScreen lang={lang} />
        </PhoneSlot>
        <PhoneSlot tilt="front" zIndex={2}>
          <PreviewResultScreen lang={lang} />
        </PhoneSlot>
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
        label={isEn ? "1. Setup" : "1. Cadre"}
        caption={
          isEn
            ? "Filters + Premium context (place, weather, time)"
            : "Filtres + contexte Premium (lieu, météo, moment)"
        }
      >
        <PreviewSetupScreen lang={lang} />
      </PhoneSlot>
      <PhoneSlot
        tilt="center"
        zIndex={2}
        label={isEn ? "2. Vote" : "2. Vote"}
        caption={
          isEn
            ? "Private yes/no on real activities"
            : "Oui / passer en privé sur de vraies idées"
        }
      >
        <PreviewVoteScreen lang={lang} />
      </PhoneSlot>
      <PhoneSlot
        tilt="front"
        zIndex={3}
        label={isEn ? "3. Go" : "3. Go"}
        caption={
          isEn
            ? "One shared plan + step-by-step roadmap"
            : "Un plan commun + feuille de route étape par étape"
        }
      >
        <PreviewResultScreen lang={lang} />
      </PhoneSlot>
    </div>
  );
}
