"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const BlurText = dynamic(() => import("@/components/react-bits/BlurText"), {
  ssr: false,
});

/** Titres : texte net d’abord, animation optionnelle au scroll (discret). */
export function AnimatedHeading({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    if (mq.matches) return;

    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "80px 0px", threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {visible && !reduceMotion ? (
        <BlurText
          text={text}
          delay={30}
          animateBy="words"
          direction="bottom"
          className={className}
          stepDuration={0.22}
        />
      ) : (
        <h2 className={className}>{text}</h2>
      )}
    </div>
  );
}
