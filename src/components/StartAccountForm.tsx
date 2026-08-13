"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useId, useState } from "react";
import { type Lang, withLang } from "@/lib/i18n";

function AppleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M16.71 12.65c.03 3.2 2.82 4.27 2.85 4.29-.02.08-.44 1.52-1.45 3.02-.87 1.29-1.77 2.57-3.19 2.6-1.4.03-1.85-.83-3.45-.83-1.6 0-2.1.8-3.42.86-1.37.05-2.41-1.37-3.28-2.65-1.78-2.57-3.14-7.25-1.31-10.43.9-1.57 2.52-2.57 4.27-2.6 1.34-.03 2.6.9 3.45.9.85 0 2.46-1.12 4.14-.95.7.03 2.66.28 3.92 2.12-.1.06-2.34 1.36-2.33 4.07ZM14.5 5.3c.73-.88 1.22-2.1 1.09-3.3-1.05.04-2.3.7-3.05 1.58-.68.79-1.27 2.04-1.11 3.24 1.17.09 2.34-.6 3.07-1.52Z" />
    </svg>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.74-.07-1.45-.19-2.13H12v4.03h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.24c1.9-1.75 2.98-4.33 2.98-7.42Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.9 6.62-2.35l-3.24-2.5c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.06v2.58A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.41 13.99A6 6 0 0 1 6.1 12c0-.69.12-1.36.31-1.99V7.43H3.06A10 10 0 0 0 2 12c0 1.61.39 3.13 1.06 4.57l3.35-2.58Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.96c1.47 0 2.78.5 3.82 1.5l2.86-2.86C16.95 2.97 14.7 2 12 2A10 10 0 0 0 3.06 7.43l3.35 2.58C7.2 7.72 9.4 5.96 12 5.96Z"
      />
    </svg>
  );
}

export function StartAccountForm({
  lang = "fr",
  mode = "signup",
}: {
  lang?: Lang;
  mode?: "signup" | "login";
}) {
  const isEn = lang === "en";
  const isLogin = mode === "login";
  const router = useRouter();
  const id = useId();
  const [email, setEmail] = useState("");

  function goToAccount(provider?: "apple" | "google") {
    const params = new URLSearchParams();
    params.set("from", "commencer");
    if (email.trim()) params.set("email", email.trim());
    if (provider) params.set("provider", provider);
    if (isLogin) params.set("mode", "login");
    if (lang === "en") params.set("lang", "en");
    router.push(`/download?${params.toString()}`);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    goToAccount();
  }

  return (
    <div className="start-form">
      <p className="start-form-kicker">
        {isLogin
          ? isEn
            ? "Welcome back"
            : "Bon retour"
          : isEn
            ? "Start now"
            : "Commencer maintenant"}
      </p>
      <h1 className="start-form-title">
        {isLogin ? (
          isEn ? (
            "Log in to FlipOn"
          ) : (
            "Connectez-vous à FlipOn"
          )
        ) : isEn ? (
          <>
            Try FlipOn{" "}
            <span className="start-form-accent">free for 7 days</span>
          </>
        ) : (
          <>
            Essayez FlipOn{" "}
            <span className="start-form-accent">gratuitement pendant 7 jours</span>
          </>
        )}
      </h1>
      <p className="start-form-support">
        {isLogin
          ? isEn
            ? "Enter your email to continue in the app."
            : "Entrez votre e-mail pour continuer dans l’app."
          : isEn
            ? "Create your FlipOn account — it’s free to start."
            : "Créez votre compte FlipOn, c’est gratuit."}
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-3">
        <label htmlFor={id} className="sr-only">
          {isEn ? "Email address" : "Adresse e-mail"}
        </label>
        <div className="start-form-field">
          <svg
            className="start-form-field-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <path
              d="M4 7.5 12 13l8-5.5"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              x="3.5"
              y="6"
              width="17"
              height="12"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.7"
            />
          </svg>
          <input
            id={id}
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="start-form-input"
          />
        </div>
        <button type="submit" className="start-form-submit">
          {isEn ? "Next" : "Suivant"}
        </button>
      </form>

      <p className="start-form-or">
        {isLogin
          ? isEn
            ? "Or continue with"
            : "Ou continuer avec"
          : isEn
            ? "Or sign up with"
            : "Ou s’inscrire avec"}
      </p>
      <div className="start-form-social">
        <button
          type="button"
          className="start-form-social-btn"
          onClick={() => goToAccount("apple")}
          aria-label={isEn ? "Continue with Apple" : "Continuer avec Apple"}
        >
          <AppleMark />
        </button>
        <button
          type="button"
          className="start-form-social-btn"
          onClick={() => goToAccount("google")}
          aria-label={isEn ? "Continue with Google" : "Continuer avec Google"}
        >
          <GoogleMark />
        </button>
      </div>

      <p className="start-form-switch">
        {isLogin ? (
          isEn ? (
            <>
              New here?{" "}
              <Link href={withLang("/commencer", lang)}>Create an account</Link>
            </>
          ) : (
            <>
              Pas encore de compte ?{" "}
              <Link href={withLang("/commencer", lang)}>Créer un compte</Link>
            </>
          )
        ) : isEn ? (
          <>
            Already have an account?{" "}
            <Link href={withLang("/commencer?mode=login", lang)}>Log in</Link>
          </>
        ) : (
          <>
            Vous avez déjà un compte ?{" "}
            <Link href={withLang("/commencer?mode=login", lang)}>Se connecter</Link>
          </>
        )}
      </p>
    </div>
  );
}
