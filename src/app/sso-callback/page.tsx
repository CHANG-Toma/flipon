import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SsoCallbackPage() {
  return (
    <main className="grid min-h-[70svh] place-items-center page-gutter">
      <p className="text-sm font-medium text-ink-soft">Connexion…</p>
      <AuthenticateWithRedirectCallback
        signInForceRedirectUrl="/commencer"
        signUpForceRedirectUrl="/commencer"
      />
    </main>
  );
}
