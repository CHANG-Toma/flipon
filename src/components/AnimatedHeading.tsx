"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const BlurText = dynamic(() => import("@/components/react-bits/BlurText"), {
  ssr: false,
});

export function AnimatedHeading({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "120px 0px", threshold: 0.05 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {visible ? (
        <BlurText
          text={text}
          delay={50}
          animateBy="words"
          direction="bottom"
          className={className}
          stepDuration={0.3}
        />
      ) : (
        <h2 className={className}>{text}</h2>
      )}
    </div>
  );
}
