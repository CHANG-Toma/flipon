import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  /** Priorité LCP (hero uniquement) */
  priority?: boolean;
  className?: string;
};

/** Capture app réelle (WebP) — pas de mock DOM. */
export function MarketingPhoneShot({
  src,
  alt,
  priority = false,
  className = "",
}: Props) {
  return (
    <div
      className={["marketing-phone", "marketing-phone--shot", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="marketing-phone-shot-frame">
        <Image
          src={src}
          alt={alt}
          width={900}
          height={1946}
          sizes="(max-width: 1024px) 42vw, 260px"
          priority={priority}
          className="marketing-phone-shot-img"
        />
      </div>
    </div>
  );
}
