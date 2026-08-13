"use client";

import { FormEvent, useId, useState } from "react";
import { type Lang } from "@/lib/i18n";

export function WaitlistForm({ lang = "fr" }: { lang?: Lang }) {
  const isEn = lang === "en";
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const id = useId();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setDone(true);
  }

  if (done) {
    return (
      <p className="animate-rise rounded-[var(--radius-ui)] border border-coral/25 bg-sky px-4 py-3 text-sm font-medium text-coral-deep" role="status">
        {isEn
          ? "Thanks. We’ll email you as soon as it is ready."
          : "Merci, on t’écrit dès que c’est prêt."}
      </p>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full max-w-md flex-col gap-2 sm:flex-row sm:items-stretch"
    >
      <div className="flex-1">
        <label htmlFor={id} className="sr-only">
          {isEn ? "Email address" : "Adresse e-mail"}
        </label>
        <input
          id={id}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={isEn ? "you@email.com" : "ton@email.fr"}
          className="h-12 w-full rounded-full border border-line bg-white px-4 text-base text-ink outline-none transition placeholder:text-ink-soft/50 focus:border-coral sm:h-12 sm:text-[15px]"
        />
      </div>
      <button type="submit" className="btn-primary w-full shrink-0 rounded-full sm:w-auto sm:min-w-[9.5rem]">
        {isEn ? "Notify me" : "Me prévenir"}
      </button>
    </form>
  );
}
