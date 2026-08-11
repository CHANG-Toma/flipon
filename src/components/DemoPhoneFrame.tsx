import type { ReactNode } from "react";

/** Cadre téléphone pour la démo interactive /test */
export function DemoPhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="demo-shell mx-auto w-full max-w-[400px]">
      <div className="demo-shell-body">
        <div className="demo-shell-notch" aria-hidden />
        <div className="demo-shell-screen">{children}</div>
      </div>
    </div>
  );
}
