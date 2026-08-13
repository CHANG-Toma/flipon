"use client";

import { useEffect, useRef } from "react";

type Props = {
  to: number;
  suffix?: string;
  duration?: number;
  className?: string;
};

/** Compteur au scroll — pas de WebGL, une passe, respect reduced-motion. */
export default function CountUp({
  to,
  suffix = "",
  duration = 1.05,
  className = "",
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      el.textContent = `${to}${suffix}`;
      return;
    }

    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / (duration * 1000));
          const eased = 1 - (1 - t) ** 3;
          el.textContent = `${Math.round(to * eased)}${suffix}`;
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, suffix, duration]);

  return (
    <span ref={ref} className={className} aria-hidden>
      0{suffix}
    </span>
  );
}
