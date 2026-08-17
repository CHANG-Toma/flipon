"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
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
  const titleId = useId();
  const [view, setView] = useState<AccountView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [appModalOpen, setAppModalOpen] = useState(false);

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

  useEffect(() => {
    if (!appModalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAppModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [appModalOpen]);

  const dateLabel = formatDate(view?.expiresAt ?? null, lang);
  const isTrial = view?.source === "trial";
  const isPaid = view?.source === "paid";
  const active = Boolean(view?.isPremium);

  const planTitle = !view
    ? "…"
    : isTrial
      ? isEn
        ? "FlipOn — 7-day trial"
        : "FlipOn — essai 7 jours"
      : isPaid
        ? isEn
          ? "FlipOn monthly"
          : "FlipOn mensuel"
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
          ? "Subscribe to keep using FlipOn."
          : "Abonne-toi pour continuer.";

  return (
    <div className="start-form">
      <h1 className="start-form-title">{isEn ? "My subscription" : "Mon abonnement"}</h1>
      <p className="start-form-support">{isEn ? "Your subscription" : "Votre abonnement"}</p>

      <div className="account-sub-card">
        <p className="account-sub-title">{planTitle}</p>
        <p className="account-sub-meta">{error ?? planSub}</p>
      </div>

      {active ? (
        <button
          type="button"
          className="start-form-submit"
          onClick={() => setAppModalOpen(true)}
        >
          {isEn ? "Manage your subscription" : "Gérez votre abonnement"}
        </button>
      ) : (
        <button
          type="button"
          className="start-form-submit"
          onClick={() => setAppModalOpen(true)}
        >
          {isEn ? "Subscribe" : "S’abonner"}
        </button>
      )}

      {appModalOpen ? (
        <div
          className="account-app-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <button
            type="button"
            className="account-app-modal-backdrop"
            aria-label={isEn ? "Close" : "Fermer"}
            onClick={() => setAppModalOpen(false)}
          />
          <div className="account-app-modal-card">
            <p className="account-app-modal-kicker">FlipOn</p>
            <h2 id={titleId} className="account-app-modal-title">
              {isEn ? "Open the mobile app" : "Ouvre l’application mobile"}
            </h2>
            <p className="account-app-modal-text">
              {isEn
                ? "Subscriptions are managed in the FlipOn app — subscribe, restore, or cancel from there."
                : "L’abonnement se gère dans l’app FlipOn — pour t’abonner, restaurer ou annuler, ouvre l’application."}
            </p>
            <Link href={withLang("/download", lang)} className="start-form-submit">
              {isEn ? "Get the app" : "Télécharger l’app"}
            </Link>
            <button
              type="button"
              className="start-form-outline"
              onClick={() => setAppModalOpen(false)}
            >
              {isEn ? "Close" : "Fermer"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
