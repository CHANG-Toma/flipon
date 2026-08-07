import type { Metadata } from "next";
import {
  LEGAL_CONTACT_EMAIL,
  LegalDoc,
  LegalSection,
} from "@/components/LegalDoc";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Éditeur, hébergement et contact FlipOn.",
  alternates: { canonical: "/legal/mentions" },
  robots: { index: true, follow: true },
};

export default function MentionsPage() {
  return (
    <LegalDoc title="Mentions légales" updated="7 août 2026">
      <LegalSection title="1. Éditeur">
        <p>
          <strong className="text-[var(--ink)]">À compléter avant mise en
          production commerciale :</strong>
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Raison sociale / nom de l’éditeur : [À compléter]</li>
          <li>Forme juridique : [À compléter]</li>
          <li>Siège social : [À compléter]</li>
          <li>SIRET / RCS : [À compléter]</li>
          <li>Directeur de la publication : [À compléter]</li>
        </ul>
        <p>
          Nom commercial du service : <strong className="text-[var(--ink)]">FlipOn</strong>.
        </p>
      </LegalSection>

      <LegalSection title="2. Contact">
        <p>
          E-mail :{" "}
          <a
            className="font-semibold text-[var(--coral)] underline"
            href={`mailto:${LEGAL_CONTACT_EMAIL}`}
          >
            {LEGAL_CONTACT_EMAIL}
          </a>{" "}
          (adresse provisoire — à remplacer par ton e-mail professionnel).
        </p>
      </LegalSection>

      <LegalSection title="3. Hébergement">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong className="text-[var(--ink)]">Site & API (souvent)</strong>{" "}
            : Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA —{" "}
            <a
              className="underline"
              href="https://vercel.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              vercel.com
            </a>
            .
          </li>
          <li>
            <strong className="text-[var(--ink)]">Base de données (cible
            prod)</strong> : o2switch (ou autre hébergeur Postgres que tu
            retenues) — coordonnées à renseigner ici une fois le choix figé.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Propriété intellectuelle">
        <p>
          Marques, textes, design et catalogue FlipOn sont protégés. Toute
          reproduction non autorisée est interdite, hors exceptions légales.
        </p>
      </LegalSection>

      <LegalSection title="5. Documents associés">
        <p>
          <a className="font-semibold text-[var(--coral)] underline" href="/legal/cgu">
            CGU
          </a>
          {" · "}
          <a
            className="font-semibold text-[var(--coral)] underline"
            href="/legal/confidentialite"
          >
            Politique de confidentialité
          </a>
          .
        </p>
      </LegalSection>
    </LegalDoc>
  );
}
