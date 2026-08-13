const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
export const MIN_PASSWORD_LENGTH = 8;

export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

// Permet de transformer une erreur de Clerk en un message plus lisible
export function humanClerkError(e: unknown, fallback: string): string {
  if (e && typeof e === "object") {
    if ("clerkError" in e && (e as { clerkError?: boolean }).clerkError) {
      const err = e as { longMessage?: string; message?: string };
      if (err.longMessage) return err.longMessage;
      if (err.message) return err.message;
    }
    if ("errors" in e) {
      const first = (e as { errors?: { message?: string; longMessage?: string }[] })
        .errors?.[0];
      if (first?.longMessage) return first.longMessage;
      if (first?.message) return first.message;
    }
    if ("longMessage" in e && typeof (e as { longMessage?: unknown }).longMessage === "string") {
      return (e as { longMessage: string }).longMessage;
    }
  }
  if (e instanceof Error && e.message) return e.message;
  return fallback;
}

// Permet de valider un email
export function validateEmail(raw: string, isEn: boolean): string | null {
  const email = normalizeEmail(raw);
  if (!email) return isEn ? "Email is required." : "L’e-mail est requis.";
  if (email.length > 254) {
    return isEn ? "Email is too long." : "L’e-mail est trop long.";
  }
  if (!EMAIL_RE.test(email)) {
    return isEn ? "Enter a valid email." : "Entre un e-mail valide.";
  }
  return null;
}
