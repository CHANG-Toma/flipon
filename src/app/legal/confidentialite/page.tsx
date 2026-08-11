import type { Metadata } from "next";
import {
  LEGAL_CONTACT_EMAIL,
  LegalDoc,
  LegalSection,
} from "@/components/LegalDoc";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Comment FlipOn traite les données personnelles (compte, sessions, historique).",
  alternates: { canonical: "/legal/confidentialite" },
  robots: { index: true, follow: true },
};

export default function ConfidentialitePage() {
  return (
    <LegalDoc title="Politique de confidentialité" updated="7 août 2026">
      <LegalSection title="1. Qui est responsable ?">
        <p>
          Le responsable du traitement est FlipOn (éditeur — identité complète
          dans les{" "}
          <a className="font-semibold text-[var(--coral)] underline" href="/legal/mentions">
            mentions légales
          </a>
          ). Contact :{" "}
          <a
            className="font-semibold text-[var(--coral)] underline"
            href={`mailto:${LEGAL_CONTACT_EMAIL}`}
          >
            {LEGAL_CONTACT_EMAIL}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="2. Données collectées">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong className="text-[var(--ink)]">Compte</strong> : adresse
            e-mail, nom / prénom ou pseudo si fournis, identifiant Clerk.
          </li>
          <li>
            <strong className="text-[var(--ink)]">Sessions</strong> : cadre
            choisi (ambiance, durée, budget…), code de room, rôle (hôte /
            invité), résultat de match. Les votes individuels ne sont pas
            exposés aux autres participants.
          </li>
          <li>
            <strong className="text-[var(--ink)]">Historique</strong> : idées
            retenues et métadonnées de session liées à ton compte (si connecté).
          </li>
          <li>
            <strong className="text-[var(--ink)]">Technique</strong> : clé
            appareil (lien hôte/invité), journaux techniques limités pour
            sécurité et debug.
          </li>
        </ul>
        <p>
          FlipOn Basique (gratuit) n’utilise pas la géolocalisation ni la météo
          pour générer des idées. Ces traitements pourront s’appliquer
          uniquement à l’offre Premium, avec information préalable.
        </p>
      </LegalSection>

      <LegalSection title="3. Finalités et bases légales">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Fournir le service (compte, sessions, vote, résultat) — exécution
            du contrat / mesures précontractuelles.
          </li>
          <li>
            Sécurité, prévention des abus — intérêt légitime.
          </li>
          <li>
            Répondre aux demandes RGPD et obligations légales — obligation
            légale.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Sous-traitants">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong className="text-[var(--ink)]">Clerk</strong> — authentification
            (e-mail / Google).
          </li>
          <li>
            <strong className="text-[var(--ink)]">Hébergement</strong> — API /
            site (ex. Vercel) et base de données (Postgres chez l’hébergeur
            choisi, ex. o2switch en production).
          </li>
          <li>
            <strong className="text-[var(--ink)]">Redis</strong> — cache éphémère
            des rooms live (TTL court).
          </li>
        </ul>
        <p>
          Ces prestataires traitent des données pour notre compte, dans le
          cadre de contrats / DPA adaptés.
        </p>
      </LegalSection>

      <LegalSection title="5. Durées de conservation">
        <ul className="list-disc space-y-1 pl-5">
          <li>Compte : jusqu’à suppression du compte ou demande d’effacement.</li>
          <li>
            Rooms live (Redis) : durée courte (ordre de quelques heures à ~24
            h), puis expiration.
          </li>
          <li>
            Historique lié au compte : tant que le compte existe, sauf
            suppression.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Tes droits (RGPD)">
        <p>
          Tu peux demander l’accès, la rectification, l’effacement, la
          limitation, la portabilité (dans la mesure applicable) et t’opposer
          à certains traitements. Pour exercer ces droits :{" "}
          <a
            className="font-semibold text-[var(--coral)] underline"
            href={`mailto:${LEGAL_CONTACT_EMAIL}`}
          >
            {LEGAL_CONTACT_EMAIL}
          </a>
          .
        </p>
        <p>
          Depuis l’app : <strong className="text-[var(--ink)]">Profil →
          Supprimer mon compte</strong> (effacement via Clerk + données
          locales). Une purge complète côté base serveur peut compléter cette
          demande.
        </p>
        <p>
          Tu peux aussi introduire une réclamation auprès de la CNIL (
          <a
            className="underline"
            href="https://www.cnil.fr"
            rel="noopener noreferrer"
            target="_blank"
          >
            cnil.fr
          </a>
          ).
        </p>
      </LegalSection>

      <LegalSection title="7. Sécurité">
        <p>
          Communications HTTPS, authentification par jeton, votes non exposés
          aux autres clients. Aucune garantie absolue : signale tout incident
          suspect à {LEGAL_CONTACT_EMAIL}.
        </p>
      </LegalSection>
    </LegalDoc>
  );
}
