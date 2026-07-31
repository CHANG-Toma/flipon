"use client";

import { FormEvent, useId, useState } from "react";

export function WaitlistForm() {
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
        Merci — on t’écrit dès que c’est prêt.
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
          Adresse e-mail
        </label>
        <input
          id={id}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ton@email.fr"
          className="h-12 w-full rounded-[var(--radius-ui)] border border-line bg-white px-3.5 text-base text-ink outline-none transition placeholder:text-ink-soft/50 focus:border-coral sm:h-11 sm:text-[15px]"
        />
      </div>
      <button type="submit" className="btn-primary w-full shrink-0 sm:w-auto sm:min-w-[9.5rem]">
        Me prévenir
      </button>
    </form>
  );
}
