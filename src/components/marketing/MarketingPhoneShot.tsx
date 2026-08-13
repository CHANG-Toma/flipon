import Image from "next/image";
import type { PhoneShot } from "@/components/marketing/phone-shots";

type Props = {
  shot: PhoneShot;
  alt: string;
  /** Priorité LCP (hero uniquement) */
  priority?: boolean;
  sizes?: string;
  className?: string;
};

const DEFAULT_SIZES = "(max-width: 767px) 70vw, 240px";

/** Mockup iPhone réel (WebP). Pas de cadre DOM. */
export function MarketingPhoneShot({
  shot,
  alt,
  priority = false,
  sizes = DEFAULT_SIZES,
  className = "",
}: Props) {
  return (
    <div
      className={["marketing-phone", "marketing-phone--shot", className]
        .filter(Boolean)
        .join(" ")}
    >
      <Image
        src={shot.src}
        alt={alt}
        width={shot.width}
        height={shot.height}
        sizes={sizes}
        quality={75}
        priority={priority}
        fetchPriority={priority ? "high" : "low"}
        decoding="async"
        placeholder="blur"
        blurDataURL={shot.blurDataURL}
        className="marketing-phone-shot-img"
      />
    </div>
  );
}
