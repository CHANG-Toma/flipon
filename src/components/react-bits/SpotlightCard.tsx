"use client";

import { useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
};

/** Spotlight CSS (variables) — pas de re-render à chaque mousemove. */
export default function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(255, 77, 0, 0.16)",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className={`landing-spot ${className}`.trim()}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
        el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
      }}
    >
      <div className="landing-spot-glow" style={{ ["--spot-color" as string]: spotlightColor }} />
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
