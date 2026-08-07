import Link from "next/link";
import type { ReactNode } from "react";

export const LEGAL_CONTACT_EMAIL = "contact@flipon.app";

type Props = {
  title: string;
  updated: string;
  children: ReactNode;
};

/**
 * Shell commun pages légales — lisible mobile, pas de marketing.
 */
export function LegalDoc({ title, updated, children }: Props) {
  return (
    <main className="safe-bottom min-h-[70vh] bg-[radial-gradient(ellipse_120%_60%_at_50%_-10%,color-mix(in_srgb,var(--coral)_7%,white),transparent_60%)] pb-12 pt-6 sm:pb-16 sm:pt-10">
      <article className="page-gutter mx-auto max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--coral)]">
          FlipOn · Légal
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--ink)]">
          {title}
        </h1>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">
          Dernière mise à jour : {updated}
        </p>

        <div
          className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950"
          role="note"
        >
          Brouillon produit — à finaliser avec ton statut juridique (raison
          sociale, SIRET, adresse) avant publication stores / mise en ligne
          commerciale. Contact provisoire :{" "}
          <a
            className="font-semibold underline underline-offset-2"
            href={`mailto:${LEGAL_CONTACT_EMAIL}`}
          >
            {LEGAL_CONTACT_EMAIL}
          </a>
          .
        </div>

        <div className="prose-legal mt-8 space-y-6 text-[15px] leading-relaxed text-[var(--ink)]">
          {children}
        </div>

        <nav
          className="mt-10 flex flex-wrap gap-x-4 gap-y-2 border-t border-[var(--line)] pt-6 text-sm font-semibold text-[var(--coral)]"
          aria-label="Autres documents légaux"
        >
          <Link href="/legal/confidentialite" className="hover:underline">
            Confidentialité
          </Link>
          <Link href="/legal/cgu" className="hover:underline">
            CGU
          </Link>
          <Link href="/legal/mentions" className="hover:underline">
            Mentions légales
          </Link>
          <Link href="/" className="text-[var(--ink-soft)] hover:underline">
            Accueil
          </Link>
        </nav>
      </article>
    </main>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-bold text-[var(--ink)]">{title}</h2>
      <div className="space-y-2 text-[var(--ink-soft)]">{children}</div>
    </section>
  );
}
