import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Afficher la barre d’accueil iOS en bas */
  showHomeIndicator?: boolean;
  className?: string;
};

/** Cadre iPhone marketing (aperçus statiques, pas interactif). */
export function MarketingPhoneFrame({
  children,
  showHomeIndicator = true,
  className = "",
}: Props) {
  return (
    <div
      className={["marketing-phone", className].filter(Boolean).join(" ")}
      aria-hidden
    >
      <div className="marketing-phone-body">
        <div className="marketing-phone-island" />
        <div className="marketing-phone-screen">
          <div className="marketing-phone-status">
            <span>9:41</span>
            <span className="marketing-phone-signal" aria-hidden />
          </div>
          {children}
          {showHomeIndicator ? <div className="marketing-phone-home" /> : null}
        </div>
      </div>
    </div>
  );
}
