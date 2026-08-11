"use client";

import { FormEvent, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { type Lang, withLang } from "@/lib/i18n";

type Props = {
  lang?: Lang;
  /** default = carte standalone · compact = une ligne · inline = sans bordure */
  variant?: "default" | "compact" | "inline";
};

export function JoinSessionForm({ lang = "fr", variant = "default" }: Props) {
  const isEn = lang === "en";
  const router = useRouter();
  const inputId = useId();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const normalized = code.trim().toUpperCase().replace(/^FLIP-/, "");
    if (normalized.length < 4) {
      setError(
        isEn
          ? "Enter the 4-character code shown by the host."
          : "Entre le code à 4 caractères affiché par l’hôte.",
      );
      return;
    }
    setError(null);
    router.push(withLang(`/test?room=${encodeURIComponent(normalized)}`, lang));
  }

  const inputClass =
    variant === "compact"
      ? "min-h-12 w-full flex-1 rounded-[var(--radius-ui)] border border-line bg-white px-3 text-center text-lg font-bold tracking-[0.2em] text-ink outline-none focus:border-coral sm:text-base"
      : "min-h-12 w-full rounded-[var(--radius-ui)] border border-line bg-white px-3 text-center text-xl font-bold tracking-[0.2em] text-ink outline-none focus:border-coral sm:text-lg";

  const form = (
    <form
      onSubmit={onSubmit}
      className={
        variant === "compact"
          ? "flex flex-col gap-2 sm:flex-row sm:items-stretch"
          : "space-y-3"
      }
    >
      <div className={variant === "compact" ? "flex-1" : undefined}>
        <label
          htmlFor={inputId}
          className={variant === "compact" ? "sr-only" : "text-sm font-semibold text-ink"}
        >
          {isEn ? "Session code" : "Code de session"}
        </label>
        <input
          id={inputId}
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            if (error) setError(null);
          }}
          placeholder="ABCD"
          maxLength={6}
          inputMode="text"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={[inputClass, variant === "compact" ? "" : "mt-2"].join(" ")}
        />
      </div>
      <button
        type="submit"
        className={
          variant === "compact"
            ? "btn-primary w-full shrink-0 sm:w-auto sm:min-w-[9.5rem]"
            : "btn-primary w-full"
        }
      >
        {isEn ? "Join" : "Rejoindre"}
      </button>
      {error ? (
        <p
          id={`${inputId}-error`}
          className={
            variant === "compact"
              ? "text-sm font-medium text-coral sm:col-span-2"
              : "text-sm font-medium text-coral"
          }
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </form>
  );

  if (variant === "inline") {
    return (
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
          {isEn ? "Already invited?" : "Déjà invité·e ?"}
        </p>
        {form}
        <p className="text-xs leading-relaxed text-ink-soft">
          {isEn
            ? "4 letters · private votes · session created on the app or web"
            : "4 lettres · votes privés · session créée sur l’app ou le web"}
        </p>
      </div>
    );
  }

  if (variant === "compact") {
    return form;
  }

  return (
    <div className="surface bg-white p-5 shadow-sm sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-coral">
        {isEn ? "Join" : "Rejoindre"}
      </p>
      <h2 className="mt-2 text-lg font-bold tracking-tight text-ink sm:text-xl">
        {isEn ? "Enter the session code" : "Entrer le code de session"}
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
        {isEn
          ? "Someone already started a session? Enter their code to vote in the browser."
          : "Quelqu’un a déjà lancé une session ? Entre son code pour voter dans le navigateur."}
      </p>
      <div className="mt-4">{form}</div>
      <p className="mt-3 text-xs leading-relaxed text-ink-soft">
        {isEn
          ? "Works with sessions created in the FlipOn app or on this site."
          : "Fonctionne avec une session créée dans l’app FlipOn ou sur ce site."}
      </p>
    </div>
  );
}
