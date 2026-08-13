"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useId, useState } from "react";
import { useAuth, useClerk, useSignIn, useSignUp } from "@clerk/nextjs";
import { PremiumAccountPanel } from "@/components/PremiumAccountPanel";
import {
  humanClerkError,
  MIN_PASSWORD_LENGTH,
  normalizeEmail,
  validateEmail,
} from "@/lib/clerk-web";
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

type Step = "email" | "password" | "verify";

function PasswordField({
  id,
  value,
  onChange,
  placeholder,
  autoComplete,
  showLabel,
  hideLabel,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoComplete: string;
  showLabel: string;
  hideLabel: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="start-form-password">
      <input
        id={id}
        type={visible ? "text" : "password"}
        required
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="start-form-input start-form-input--plain start-form-input--password"
      />
      <button
        type="button"
        className="start-form-eye"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? hideLabel : showLabel}
      >
        {visible ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M3 3l18 18M10.6 10.6A2 2 0 0 0 12 14a2 2 0 0 0 1.4-.6M9.9 5.1A10.6 10.6 0 0 1 12 5c5 0 9.3 3.1 11 7.5a11.7 11.7 0 0 1-4.1 4.8M6.1 6.1A11.6 11.6 0 0 0 1 12.5a11.7 11.7 0 0 0 6.2 5.2"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M2 12.5C3.7 8.1 8 5 12 5s8.3 3.1 10 7.5c-1.7 4.4-6 7.5-10 7.5S3.7 16.9 2 12.5Z"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <circle cx="12" cy="12.5" r="2.6" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        )}
      </button>
    </div>
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
  const emailId = useId();
  const passwordId = useId();
  const confirmId = useId();
  const codeId = useId();

  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const clerk = useClerk();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const clerkReady = authLoaded && clerk.loaded && Boolean(signIn) && Boolean(signUp);
  const afterAuth = withLang("/commencer", lang);

  async function goAfterAuth() {
    router.push(afterAuth);
  }

  async function onOAuth(strategy: "oauth_google" | "oauth_apple") {
    if (!signIn) return;
    try {
      setLoading(true);
      setError(null);
      const { error } = await signIn.sso({
        strategy,
        redirectCallbackUrl: "/sso-callback",
        redirectUrl: afterAuth,
      });
      if (error) {
        setError(
          humanClerkError(
            error,
            isEn ? "Could not continue with this provider." : "Impossible de continuer avec ce compte.",
          ),
        );
        setLoading(false);
      }
    } catch (e) {
      setError(
        humanClerkError(
          e,
          isEn ? "Could not continue with this provider." : "Impossible de continuer avec ce compte.",
        ),
      );
      setLoading(false);
    }
  }

  async function onEmailNext(e: FormEvent) {
    e.preventDefault();
    const emailErr = validateEmail(email, isEn);
    if (emailErr) {
      setError(emailErr);
      return;
    }
    setError(null);
    setStep("password");
  }

  async function onPasswordSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading || !clerkReady) return;

    const emailErr = validateEmail(email, isEn);
    if (emailErr) {
      setError(emailErr);
      return;
    }
    if (!password) {
      setError(isEn ? "Password is required." : "Le mot de passe est requis.");
      return;
    }

    const trimmed = normalizeEmail(email);

    if (!isLogin) {
      if (password.length < MIN_PASSWORD_LENGTH) {
        setError(
          isEn
            ? `Use at least ${MIN_PASSWORD_LENGTH} characters.`
            : `Au moins ${MIN_PASSWORD_LENGTH} caractères.`,
        );
        return;
      }
      if (password !== confirmPassword) {
        setError(isEn ? "Passwords don’t match." : "Les mots de passe ne correspondent pas.");
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);

      if (isLogin) {
        const clientSignIn = clerk.client?.signIn;
        if (!clientSignIn) return;
        let result = await clientSignIn.create({
          strategy: "password",
          identifier: trimmed,
          password,
        });
        if (result.status === "needs_first_factor") {
          result = await result.attemptFirstFactor({
            strategy: "password",
            password,
          });
        }
        if (result.status === "complete" && result.createdSessionId) {
          await clerk.setActive({ session: result.createdSessionId });
          await goAfterAuth();
          return;
        }
        setError(
          isEn
            ? "Could not sign in. Check your email and password."
            : "Connexion impossible. Vérifie l’e-mail et le mot de passe.",
        );
        return;
      }

      const clientSignUp = clerk.client?.signUp;
      if (!clientSignUp) return;
      await clientSignUp.create({ emailAddress: trimmed, password });
      await clientSignUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPassword("");
      setConfirmPassword("");
      setStep("verify");
    } catch (e) {
      setError(
        humanClerkError(
          e,
          isLogin
            ? isEn
              ? "Could not sign in. Check your email and password."
              : "Connexion impossible. Vérifie l’e-mail et le mot de passe."
            : isEn
              ? "Could not create the account."
              : "Impossible de créer le compte.",
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  async function onVerify(e: FormEvent) {
    e.preventDefault();
    const clientSignUp = clerk.client?.signUp;
    if (!clientSignUp) return;
    const trimmed = code.trim();
    if (!/^\d{4,8}$/.test(trimmed)) {
      setError(isEn ? "Enter the 6-digit code." : "Entre le code à 6 chiffres.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const result = await clientSignUp.attemptEmailAddressVerification({
        code: trimmed,
      });
      if (result.status === "complete" && result.createdSessionId) {
        await clerk.setActive({ session: result.createdSessionId });
        await goAfterAuth();
        return;
      }
      setError(isEn ? "Verification is not complete yet." : "La vérification n’est pas terminée.");
    } catch (e) {
      setError(
        humanClerkError(e, isEn ? "Invalid code." : "Code invalide."),
      );
    } finally {
      setLoading(false);
    }
  }

  if (authLoaded && isSignedIn) {
    return <PremiumAccountPanel lang={lang} />;
  }

  if (step === "verify") {
    return (
      <div className="start-form">
        <p className="start-form-kicker">{isEn ? "Confirm email" : "Confirme l’e-mail"}</p>
        <h1 className="start-form-title">
          {isEn ? "Enter the code we sent you." : "Entre le code reçu par e-mail."}
        </h1>
        <p className="start-form-support">{normalizeEmail(email)}</p>
        <form onSubmit={(e) => void onVerify(e)} className="mt-8 space-y-3">
          <label htmlFor={codeId} className="sr-only">
            {isEn ? "Verification code" : "Code de vérification"}
          </label>
          <input
            id={codeId}
            inputMode="numeric"
            autoComplete="one-time-code"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (error) setError(null);
            }}
            placeholder={isEn ? "6-digit code" : "Code à 6 chiffres"}
            className="start-form-input start-form-input--plain"
          />
          {error ? <p className="start-form-error">{error}</p> : null}
          <button type="submit" className="start-form-submit" disabled={loading}>
            {loading ? "…" : isEn ? "Validate" : "Valider"}
          </button>
        </form>
        <button
          type="button"
          className="start-form-text-btn"
          onClick={() => {
            setStep("password");
            setCode("");
            setError(null);
          }}
        >
          {isEn ? "Back" : "Retour"}
        </button>
      </div>
    );
  }

  if (step === "password") {
    return (
      <div className="start-form">
        <p className="start-form-kicker">
          {isLogin ? (isEn ? "Welcome back" : "Bon retour") : isEn ? "Create account" : "Créer le compte"}
        </p>
        <h1 className="start-form-title">
          {isLogin
            ? isEn
              ? "Enter your password."
              : "Entre ton mot de passe."
            : isEn
              ? "Choose a password."
              : "Choisis un mot de passe."}
        </h1>
        <p className="start-form-support">{normalizeEmail(email)}</p>
        <form onSubmit={(e) => void onPasswordSubmit(e)} className="mt-8 space-y-3">
          <label htmlFor={passwordId} className="sr-only">
            {isEn ? "Password" : "Mot de passe"}
          </label>
          <PasswordField
            id={passwordId}
            value={password}
            onChange={(value) => {
              setPassword(value);
              if (error) setError(null);
            }}
            autoComplete={isLogin ? "current-password" : "new-password"}
            placeholder={
              isLogin
                ? isEn
                  ? "Password"
                  : "Mot de passe"
                : isEn
                  ? `Password (${MIN_PASSWORD_LENGTH}+ characters)`
                  : `Mot de passe (${MIN_PASSWORD_LENGTH}+ caractères)`
            }
            showLabel={isEn ? "Show password" : "Afficher le mot de passe"}
            hideLabel={isEn ? "Hide password" : "Masquer le mot de passe"}
          />
          {!isLogin ? (
            <>
              <label htmlFor={confirmId} className="sr-only">
                {isEn ? "Confirm password" : "Confirmer le mot de passe"}
              </label>
              <PasswordField
                id={confirmId}
                value={confirmPassword}
                onChange={(value) => {
                  setConfirmPassword(value);
                  if (error) setError(null);
                }}
                autoComplete="new-password"
                placeholder={isEn ? "Confirm password" : "Confirmer le mot de passe"}
                showLabel={isEn ? "Show password" : "Afficher le mot de passe"}
                hideLabel={isEn ? "Hide password" : "Masquer le mot de passe"}
              />
            </>
          ) : null}
          {error ? <p className="start-form-error">{error}</p> : null}
          <button type="submit" className="start-form-submit" disabled={loading || !clerkReady}>
            {loading ? "…" : isLogin ? (isEn ? "Log in" : "Se connecter") : isEn ? "Create account" : "Créer le compte"}
          </button>
        </form>
        <button
          type="button"
          className="start-form-text-btn"
          onClick={() => {
            setStep("email");
            setPassword("");
            setConfirmPassword("");
            setError(null);
          }}
        >
          {isEn ? "Back" : "Retour"}
        </button>
      </div>
    );
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
            Try FlipOn <span className="start-form-accent">free for 7 days</span>
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
            ? "Same account as the FlipOn app."
            : "Le même compte que l’app FlipOn."
          : isEn
            ? "Create your FlipOn account — same login as the app."
            : "Créez votre compte FlipOn — le même que dans l’app."}
      </p>

      <form onSubmit={(e) => void onEmailNext(e)} className="mt-8 space-y-3">
        <label htmlFor={emailId} className="sr-only">
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
            id={emailId}
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Email"
            className="start-form-input"
          />
        </div>
        {error ? <p className="start-form-error">{error}</p> : null}
        <button type="submit" className="start-form-submit" disabled={loading}>
          {isEn ? "Next" : "Suivant"}
        </button>
      </form>
      <div id="clerk-captcha" className="mt-3" />

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
          disabled={loading || !clerkReady}
          onClick={() => void onOAuth("oauth_apple")}
          aria-label={isEn ? "Continue with Apple" : "Continuer avec Apple"}
        >
          <AppleMark />
        </button>
        <button
          type="button"
          className="start-form-social-btn"
          disabled={loading || !clerkReady}
          onClick={() => void onOAuth("oauth_google")}
          aria-label={isEn ? "Continue with Google" : "Continuer avec Google"}
        >
          <GoogleMark />
        </button>
      </div>

      <p className="start-form-switch">
        {isLogin ? (
          isEn ? (
            <>
              New here? <Link href={withLang("/commencer", lang)}>Create an account</Link>
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
