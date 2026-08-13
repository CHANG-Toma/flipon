"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { type Lang, withLang } from "@/lib/i18n";

type AccountView = {
  displayName: string | null;
  email: string | null;
  isPremium: boolean;
  expiresAt: string | null;
  source: "trial" | "paid" | "none";
};

function formatDate(iso: string | null, lang: Lang) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function PremiumAccountPanel({ lang = "fr" }: { lang?: Lang }) {
  const isEn = lang === "en";
  const [view, setView] = useState<AccountView | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/me", {
          method: "POST",
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("auth");
        }
        const data = (await res.json()) as AccountView & {
          subscriptionExpiresAt?: string | null;
        };
        if (!cancelled) {
          setView({
            ...data,
            expiresAt: data.expiresAt ?? data.subscriptionExpiresAt ?? null,
          });
        }
      } catch {
        if (!cancelled) {
          setError(
            isEn ? "Could not load your subscription." : "Impossible de charger l’abonnement.",
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isEn]);

  const dateLabel = formatDate(view?.expiresAt ?? null, lang);
  const isTrial = view?.source === "trial";
  const isPaid = view?.source === "paid";
  const active = Boolean(view?.isPremium);

  const planTitle = !view
    ? "…"
    : isTrial
      ? isEn
        ? "FlipOn Premium — 7-day trial"
        : "FlipOn Premium — essai 7 jours"
      : isPaid
        ? isEn
          ? "FlipOn Premium monthly"
          : "FlipOn Premium mensuel"
        : isEn
          ? "No active plan"
          : "Aucun abonnement actif";

  const planSub = !view
    ? ""
    : active && dateLabel
      ? isTrial
        ? isEn
          ? `Ends on ${dateLabel}`
          : `Se termine le ${dateLabel}`
        : isEn
          ? `Renews on ${dateLabel}`
          : `Se renouvelle le ${dateLabel}`
      : dateLabel
        ? isEn
          ? `Ended on ${dateLabel}`
          : `Terminé le ${dateLabel}`
        : isEn
          ? "Start Premium to keep going."
          : "Passe Premium pour continuer.";

  return (
    <div className="start-form">
      <h1 className="start-form-title">{isEn ? "My Premium" : "Mon Premium"}</h1>
      <p className="start-form-support">{isEn ? "Your subscription" : "Votre abonnement"}</p>

      <div className="account-sub-card">
        <p className="account-sub-title">{planTitle}</p>
        <p className="account-sub-meta">{error ?? planSub}</p>
      </div>

      {active ? (
        <>
          <Link href={withLang("/tarifs", lang)} className="start-form-submit">
            {isEn ? "Manage your subscription" : "Gérez votre abonnement"}
          </Link>
          <Link href={withLang("/test", lang)} className="start-form-outline">
            {isEn ? "Start a session" : "Lancer une session"}
          </Link>
        </>
      ) : (
        <Link href={withLang("/tarifs", lang)} className="start-form-submit">
          {isEn ? "Get Premium" : "Passer Premium"}
        </Link>
      )}
    </div>
  );
}
