"use client";

import { FormEvent, useState } from "react";

export function WaitlistForm({ light = false }: { light?: boolean }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setDone(true);
  }

  if (done) {
    return (
      <p
        className={[
          "animate-rise text-base font-medium",
          light ? "text-white" : "text-teal",
        ].join(" ")}
      >
        Merci — on vous prévient dès que FlipOn ouvre.
      </p>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
    >
      <label className="sr-only" htmlFor="waitlist-email">
        Email
      </label>
      <input
        id="waitlist-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="votre@email.fr"
        className={[
          "h-12 flex-1 border px-4 text-[15px] outline-none transition focus:ring-2",
          light
            ? "border-white/25 bg-white/10 text-white placeholder:text-white/50 focus:ring-white/30"
            : "border-ink/15 bg-white text-ink placeholder:text-ink-soft/60 focus:ring-teal/30",
        ].join(" ")}
      />
      <button
        type="submit"
        className={[
          "h-12 px-6 text-[15px] font-semibold transition-colors",
          light
            ? "bg-coral text-white hover:bg-coral-deep"
            : "bg-ink text-white hover:bg-ink-soft",
        ].join(" ")}
      >
        Rejoindre la waitlist
      </button>
    </form>
  );
}
