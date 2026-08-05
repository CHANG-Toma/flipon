"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Props = {
  code: string;
};

export function JoinBridge({ code }: Props) {
  const [triedApp, setTriedApp] = useState(false);
  const appLink = `fliponapp://join/${code}`;
  const webLink = `/test?room=${encodeURIComponent(code)}`;

  useEffect(() => {
    // Tente d’ouvrir l’app si installée, sans bloquer le fallback navigateur.
    const timer = window.setTimeout(() => {
      setTriedApp(true);
    }, 900);

    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = appLink;
    document.body.appendChild(iframe);

    return () => {
      window.clearTimeout(timer);
      iframe.remove();
    };
  }, [appLink]);

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-1 py-8 text-center sm:py-14">
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--coral)]">
          Invitation FlipOn
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--ink)]">
          Rejoindre la session
        </h1>
        <p className="text-[15px] leading-relaxed text-[var(--ink-soft)]">
          Tu as reçu une invitation. Ouvre FlipOn si tu l’as, sinon continue dans ton
          navigateur.
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--line)] bg-white px-5 py-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-soft)]">
          Code
        </p>
        <p className="mt-2 text-3xl font-extrabold tracking-[0.2em] text-[var(--ink)]">
          {code}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Link
          href={webLink}
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[var(--coral)] px-5 text-[15px] font-bold text-white transition hover:bg-[var(--coral-deep)]"
        >
          Continuer dans le navigateur
        </Link>
        <a
          href={appLink}
          className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[var(--line)] bg-white px-5 text-[15px] font-bold text-[var(--ink)]"
        >
          Ouvrir l’application
        </a>
      </div>

      <p className="text-sm leading-relaxed text-[var(--ink-soft)]">
        {triedApp
          ? "Pas d’app détectée ? Utilise le navigateur ci-dessus — tu votes directement sur FlipOn."
          : "Ouverture de l’app si elle est installée…"}
      </p>
    </div>
  );
}
