"use client";

import { FormEvent, useId, useState } from "react";
import { type Lang } from "@/lib/i18n";

/**
 * Envoi direct navigateur → Web3Forms (évite le challenge Cloudflare
 * quand Vercel appelle l’API côté serveur).
 */
export function FeedbackForm({ lang = "fr" }: { lang?: Lang }) {
  const isEn = lang === "en";
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

    const accessKey =
      process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY?.trim() ||
      process.env.NEXT_PUBLIC_WEB3FORMS_KEY?.trim();

    if (!clear.trim() && !friction.trim() && !withWho.trim()) {
      setError(
        isEn
          ? "Please share at least one piece of feedback."
          : "Écris au moins un retour dans un des champs.",
      );
      setBusy(false);
      return;
    }

    if (!accessKey) {
      setError(
        isEn
          ? "Feedback is not configured. Add NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY on Vercel."
          : "Feedback non configuré. Ajoute NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY sur Vercel.",
      );
      setBusy(false);
      return;
    }

    const message = [
      isEn ? "FlipOn demo feedback (/test)" : "Retour démo FlipOn (/test)",
      "",
      `${isEn ? "What was clear" : "Ce qui était clair"}: ${clear.trim() || "-"}`,
      `${isEn ? "What blocked you" : "Ce qui a freiné"}: ${friction.trim() || "-"}`,
      `${isEn ? "I would use it with" : "Je l’utiliserais avec"}: ${withWho.trim() || "-"}`,
      `${isEn ? "Tester email" : "Email testeur"}: ${email.trim() || (isEn ? "not provided" : "non renseigné")}`,
    ].join("\n");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: isEn ? "FlipOn demo feedback" : "Retour démo FlipOn",
          from_name: "FlipOn Demo",
          name: withWho.trim() || "Testeur FlipOn",
          email: email.trim() || "noreply@flipon.app",
          message,
        }),
      });

      const text = await res.text();
      let data: { success?: boolean; message?: string } = {};
      if (text.trim()) {
        try {
          data = JSON.parse(text) as { success?: boolean; message?: string };
        } catch {
          throw new Error(
            isEn
              ? "Web3Forms returned a security page. Please try again in a moment."
              : "Web3Forms a renvoyé une page de sécurité. Réessaie dans un instant.",
          );
        }
      }

      if (!res.ok || !data.success) {
        throw new Error(data.message ?? (isEn ? "Submit failed" : "Envoi impossible"));
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : isEn ? "Error" : "Erreur");
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
        {isEn ? "Thanks. Your feedback was sent." : "Merci, ton retour est parti."}
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
        {isEn ? "2 minutes to help us?" : "2 minutes pour nous aider ?"}
      </p>
      <p className="mt-1 text-center text-xs leading-relaxed text-ink-soft">
        {isEn
          ? "Your feedback is sent directly by email."
          : "Ton avis part directement par e-mail."}
      </p>

      <label
        className="mt-4 block text-xs font-semibold text-ink"
        htmlFor={`${baseId}-clear`}
      >
        {isEn ? "What was clear" : "Ce qui était clair"}
      </label>
      <textarea
        id={`${baseId}-clear`}
        value={clear}
        onChange={(e) => setClear(e.target.value)}
        rows={2}
        className={fieldClass}
        placeholder={isEn ? "e.g. voting flow, duo mode..." : "Ex. le vote, le duo…"}
      />

      <label
        className="mt-3 block text-xs font-semibold text-ink"
        htmlFor={`${baseId}-friction`}
      >
        {isEn ? "What slowed you down" : "Ce qui t’a freiné"}
      </label>
      <textarea
        id={`${baseId}-friction`}
        value={friction}
        onChange={(e) => setFriction(e.target.value)}
        rows={2}
        className={fieldClass}
        placeholder={
          isEn
            ? "e.g. I did not know what to pick..."
            : "Ex. je ne savais pas quoi choisir…"
        }
      />

      <label
        className="mt-3 block text-xs font-semibold text-ink"
        htmlFor={`${baseId}-who`}
      >
        {isEn ? "Who would you use it with?" : "Tu l’utiliserais avec qui ?"}
      </label>
      <input
        id={`${baseId}-who`}
        value={withWho}
        onChange={(e) => setWithWho(e.target.value)}
        className={fieldClass}
        placeholder={isEn ? "Friends, partner, roommates..." : "Potes, couple, colloc…"}
      />

      <label
        className="mt-3 block text-xs font-semibold text-ink"
        htmlFor={`${baseId}-email`}
      >
        {isEn ? "Your email (optional)" : "Ton e-mail (optionnel)"}
      </label>
      <input
        id={`${baseId}-email`}
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={fieldClass}
        placeholder={isEn ? "if you want a reply" : "pour qu’on te réponde"}
      />

      {error && (
        <p className="mt-3 text-sm font-medium text-coral" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="btn-primary mt-4 w-full" disabled={busy}>
        {busy ? (isEn ? "Sending..." : "Envoi…") : isEn ? "Send feedback" : "Envoyer mon retour"}
      </button>
    </form>
  );
}
