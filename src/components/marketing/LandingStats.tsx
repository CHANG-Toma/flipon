"use client";

import CountUp from "@/components/react-bits/CountUp";

type Stat = { to: number; suffix: string; label: string };

export function LandingStats({ stats }: { stats: Stat[] }) {
  return (
    <dl className="landing-stats mx-auto grid max-w-6xl grid-cols-2 gap-y-10 py-12 sm:grid-cols-4 sm:py-16">
      {stats.map((item) => (
        <div key={item.label} className="text-center sm:text-left">
          <dt
            className="font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight text-[#ff4d00] sm:text-5xl"
            aria-label={`${item.to}${item.suffix}`}
          >
            <CountUp to={item.to} suffix={item.suffix} />
          </dt>
          <dd className="mt-2 text-sm text-white/60 sm:text-[15px]">{item.label}</dd>
        </div>
      ))}
    </dl>
  );
}
