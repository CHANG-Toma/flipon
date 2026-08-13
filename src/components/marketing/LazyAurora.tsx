"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const Aurora = dynamic(() => import("@/components/react-bits/Aurora"), {
  ssr: false,
});

/** Aurora WebGL : desktop only, pause hors écran, skip reduced-motion / save-data. */
export function LazyAurora({
  colorStops = ["#ff4d00", "#ff8a3d", "#1a0a06"],
}: {
  colorStops?: string[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean };
    };
    if (reduce || mobile || nav.connection?.saveData) return;

    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => setActive(Boolean(entry?.isIntersecting)),
      { rootMargin: "60px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="landing-aurora pointer-events-none absolute inset-0" aria-hidden>
      {active ? (
        <Aurora colorStops={colorStops} amplitude={0.85} blend={0.55} speed={0.55} />
      ) : null}
    </div>
  );
}
