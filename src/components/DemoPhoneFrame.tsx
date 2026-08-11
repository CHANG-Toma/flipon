import type { ReactNode } from "react";

/** Cadre téléphone pour la démo interactive /test */
export function DemoPhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="demo-shell mx-auto w-full max-w-[400px]" role="region" aria-label="Aperçu mobile FlipOn">
      <span className="demo-shell-side demo-shell-side-left" aria-hidden />
      <span className="demo-shell-side demo-shell-side-right" aria-hidden />
      <div className="demo-shell-body">
        <div className="demo-shell-top" aria-hidden>
          <div className="demo-shell-notch" />
        </div>
        <div className="demo-shell-screen">
          <div className="demo-shell-status" aria-hidden>
            <span className="demo-shell-time">9:41</span>
            <div className="demo-shell-status-icons">
              <span className="demo-dot" />
              <span className="demo-bar demo-bar-1" />
              <span className="demo-bar demo-bar-2" />
              <span className="demo-bar demo-bar-3" />
              <span className="demo-battery">
                <span className="demo-battery-level" />
              </span>
            </div>
          </div>
          {children}
          <div className="demo-shell-home" aria-hidden />
        </div>
      </div>
    </div>
  );
}
