import type { Metadata } from "next";
import {
  LEGAL_CONTACT_EMAIL,
  LegalDoc,
  LegalSection,
} from "@/components/LegalDoc";

export const metadata: Metadata = {
  title: "Conditions générales d’utilisation",
  description:
    "Règles d’usage de FlipOn : compte, sessions, votes, responsabilités.",
  alternates: { canonical: "/legal/cgu" },
  robots: { index: true, follow: true },
};

export default function CguPage() {
  return (
    <LegalDoc title="Conditions générales d’utilisation" updated="7 août 2026">
      <LegalSection title="1. Objet">
        <p>
          FlipOn aide un duo (ou un groupe, selon disponibilité) à choisir une
          activité par un vote privé, puis affiche une idée commune. Ce n’est
          pas une application de rencontres ni un service de réservation.
        </p>
      </LegalSection>

      <LegalSection title="2. Accès au service">
        <p>
          L’usage de l’application mobile suppose un compte (e-mail ou Google
          via Clerk). Un invité peut rejoindre une session via le site web sans
          télécharger l’app, dans les limites techniques du moment.
        </p>
        <p>
          L’offre <strong className="text-[var(--ink)]">Basique</strong> est
          gratuite et s’appuie sur un catalogue d’idées filtrées. Des offres
          payantes (ex. Premium) pourront être proposées séparément, avec leurs
          conditions.
        </p>
      </LegalSection>

      <LegalSection title="3. Comportement attendu">
        <ul className="list-disc space-y-1 pl-5">
          <li>Pas d’usage abusif (spam de rooms, contournement de sécurité).</li>
          <li>Pas de contenu illégal ou harcelant via le service.</li>
          <li>
            Tu es responsable des informations que tu fournis à l’inscription.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Votes et résultat">
        <p>
          Les votes sont privés : les autres participants ne voient pas tes
          choix individuels. Le résultat Basique est l’idée retenue (titre et
          description courte), pas un plan d’exécution détaillé.
        </p>
        <p>
          Les idées sont des suggestions. FlipOn ne garantit pas la
          disponibilité, les horaires, l’accessibilité, les tarifs ni la
          conformité d’un lieu. Vérifie toujours avant de te déplacer.
        </p>
      </LegalSection>

      <LegalSection title="5. Disponibilité">
        <p>
          Le service est fourni « en l’état ». Des interruptions (maintenance,
          panne hébergeur, quota) peuvent survenir. Nous cherchons à limiter
          leur impact, sans engagement de disponibilité 24/7 à ce stade.
        </p>
      </LegalSection>

      <LegalSection title="6. Résiliation">
        <p>
          Tu peux te déconnecter à tout moment et supprimer ton compte depuis
          Profil. FlipOn peut suspendre un compte en cas de non-respect des
          présentes CGU ou de risque pour la sécurité du service.
        </p>
      </LegalSection>

      <LegalSection title="7. Contact">
        <p>
          Questions :{" "}
          <a
            className="font-semibold text-[var(--coral)] underline"
            href={`mailto:${LEGAL_CONTACT_EMAIL}`}
          >
            {LEGAL_CONTACT_EMAIL}
          </a>
          . La{" "}
          <a
            className="font-semibold text-[var(--coral)] underline"
            href="/legal/confidentialite"
          >
            politique de confidentialité
          </a>{" "}
          complète le traitement des données.
        </p>
      </LegalSection>
    </LegalDoc>
  );
}
