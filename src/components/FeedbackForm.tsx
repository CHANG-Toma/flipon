"use client";

import { FormEvent, useId, useState } from "react";

export function FeedbackForm() {
  const baseId = useId();
  const [clear, setClear] = useState("");
  const [friction, setFriction] = useState("");
  const [withWho, setWithWho] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clear, friction, withWho, email }),
      });
      const text = await res.text();
      let data: { error?: string; ok?: boolean } = {};
      if (text.trim()) {
        try {
          data = JSON.parse(text) as { error?: string; ok?: boolean };
        } catch {
          throw new Error(
            res.ok
              ? "Réponse serveur invalide"
              : `Erreur ${res.status} — redeploy le site avec le code feedback.`,
          );
        }
      }
      if (!res.ok) {
        throw new Error(data.error ?? `Envoi impossible (${res.status})`);
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <p
        className="animate-rise rounded-[var(--radius-ui)] border border-coral/25 bg-sky px-4 py-3 text-center text-sm font-medium text-coral-deep"
        role="status"
      >
        Merci — ton retour est parti.
      </p>
    );
  }

  const fieldClass =
    "mt-1.5 w-full rounded-[var(--radius-ui)] border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink-soft/50 focus:border-coral";

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[var(--radius-ui)] border border-line bg-white px-4 py-4 text-left"
    >
      <p className="text-center text-sm font-semibold text-ink">
        2 minutes pour nous aider ?
      </p>
      <p className="mt-1 text-center text-xs leading-relaxed text-ink-soft">
        Ton avis part directement par e-mail.
      </p>

      <label className="mt-4 block text-xs font-semibold text-ink" htmlFor={`${baseId}-clear`}>
        Ce qui était clair
      </label>
      <textarea
        id={`${baseId}-clear`}
        value={clear}
        onChange={(e) => setClear(e.target.value)}
        rows={2}
        className={fieldClass}
        placeholder="Ex. le vote, le duo…"
      />

      <label className="mt-3 block text-xs font-semibold text-ink" htmlFor={`${baseId}-friction`}>
        Ce qui t’a freiné
      </label>
      <textarea
        id={`${baseId}-friction`}
        value={friction}
        onChange={(e) => setFriction(e.target.value)}
        rows={2}
        className={fieldClass}
        placeholder="Ex. je ne savais pas quoi choisir…"
      />

      <label className="mt-3 block text-xs font-semibold text-ink" htmlFor={`${baseId}-who`}>
        Tu l’utiliserais avec qui ?
      </label>
      <input
        id={`${baseId}-who`}
        value={withWho}
        onChange={(e) => setWithWho(e.target.value)}
        className={fieldClass}
        placeholder="Potes, couple, colloc…"
      />

      <label className="mt-3 block text-xs font-semibold text-ink" htmlFor={`${baseId}-email`}>
        Ton e-mail (optionnel)
      </label>
      <input
        id={`${baseId}-email`}
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={fieldClass}
        placeholder="pour qu’on te réponde"
      />

      {error && (
        <p className="mt-3 text-sm font-medium text-coral" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="btn-primary mt-4 w-full"
        disabled={busy}
      >
        {busy ? "Envoi…" : "Envoyer mon retour"}
      </button>
    </form>
  );
}
