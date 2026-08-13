import type { Lang } from "@/lib/i18n";

export type LandingCopy = {
  stats: { to: number; suffix: string; label: string }[];
  pains: { title: string; body: string }[];
  checks: string[];
  steps: { title: string; body: string }[];
  outcomes: { kicker: string; title: string; points: string[] }[];
  audiences: { title: string; body: string }[];
  startSteps: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
  pullQuote: { lineA: string; lineB: string };
};

export function getLandingCopy(lang: Lang): LandingCopy {
  if (lang === "en") {
    return {
      stats: [
        { to: 30, suffix: "s", label: "to set the frame" },
        { to: 2, suffix: " min", label: "to get a plan" },
        { to: 1, suffix: "", label: "shared activity" },
        { to: 0, suffix: "€", label: "to start" },
      ],
      pains: [
        {
          title: "Too many options",
          body: "The chat fills with “maybe this, maybe that”. Nobody locks a time.",
        },
        {
          title: "Social pressure",
          body: "Someone always yields. The plan becomes a compromise nobody wanted.",
        },
        {
          title: "The evening slips away",
          body: "You talk for 40 minutes. You stay in. Again.",
        },
      ],
      checks: [
        "Under 2 minutes",
        "Private vote, no social pressure",
        "One result for the whole group",
        "Works day or evening",
      ],
      steps: [
        {
          title: "Set the frame",
          body: "Mood, time, budget: 30 seconds and the group is aligned on the moment — not on 20 options.",
        },
        {
          title: "Vote in private",
          body: "Each person likes or skips. No one performs. No one gives in just to move on.",
        },
        {
          title: "One shared plan",
          body: "FlipOn returns the idea the group can actually do now. Then you go.",
        },
      ],
      outcomes: [
        {
          kicker: "Right now",
          title: "The debate stops",
          points: ["A clear frame", "Everyone on their phone", "No more “whatever you want”"],
        },
        {
          kicker: "Tonight",
          title: "You actually go out",
          points: ["A plan in a few taps", "One idea, not ten", "A time you can keep"],
        },
        {
          kicker: "This weekend",
          title: "A real date",
          points: ["Brunch, walk, or terrace", "Same flow, day or night", "Less friction in the group"],
        },
        {
          kicker: "After that",
          title: "A group reflex",
          points: ["A 4-letter code", "No endless thread", "You decide, then you leave"],
        },
      ],
      audiences: [
        {
          title: "Friends",
          body: "Stop the group-chat loop. One code, a private vote, a real plan.",
        },
        {
          title: "Couples",
          body: "No more “I don’t mind”. Each person votes, then you get one idea.",
        },
        {
          title: "Roommates",
          body: "A weeknight, a short window, a small budget: FlipOn still finds a match.",
        },
        {
          title: "Weekends",
          body: "Brunch, walk, terrace, or later out — same flow, day or evening.",
        },
      ],
      startSteps: [
        {
          title: "Try the demo",
          body: "See the full flow on the web, in under two minutes.",
        },
        {
          title: "Invite with a code",
          body: "Share 4 letters. The other phone joins the session.",
        },
        {
          title: "Vote, then go",
          body: "Private likes. One shared plan. The evening can start.",
        },
      ],
      faqs: [
        {
          q: "What is FlipOn?",
          a: "FlipOn helps a group pick one activity together. You set a frame, everyone votes in private, and you get one shared plan — instead of a 40-minute “what should we do?” thread.",
        },
        {
          q: "How does the private vote work?",
          a: "Each person likes or skips ideas on their own phone. Nobody sees the others’ votes live, so there is no social pressure. FlipOn then outputs the idea that works for the group.",
        },
        {
          q: "Is FlipOn free?",
          a: "Yes. Basic is free: catalog, filters, and private vote. Premium (optional) adds nearby context, weather, and AI ideas.",
        },
        {
          q: "Do we need to be in the same place?",
          a: "No. One person creates a session and shares a 4-letter code. The others join from their phone, wherever they are.",
        },
        {
          q: "Does it work for two people or a larger group?",
          a: "The core flow is built for a duo today (two phones). The same idea — private vote, one plan — is designed to extend to a small group.",
        },
      ],
      pullQuote: {
        lineA: "A plan doesn’t need to be perfect.",
        lineB: "It just needs to happen.",
      },
    };
  }

  return {
    stats: [
      { to: 30, suffix: " s", label: "pour poser le cadre" },
      { to: 2, suffix: " min", label: "pour un plan" },
      { to: 1, suffix: "", label: "activité commune" },
      { to: 0, suffix: " €", label: "pour commencer" },
    ],
    pains: [
      {
        title: "Trop d’options",
        body: "Le groupe se remplit de « peut-être ça, ou ça ». Personne ne verrouille un horaire.",
      },
      {
        title: "La pression sociale",
        body: "Quelqu’un cède toujours. Le plan devient un compromis que personne n’avait vraiment envie.",
      },
      {
        title: "La soirée file",
        body: "Vous parlez 40 minutes. Vous restez chez vous. Encore.",
      },
    ],
    checks: [
      "Moins de 2 minutes",
      "Vote privé, sans pression",
      "Un seul résultat pour tout le groupe",
      "Journée ou soirée",
    ],
    steps: [
      {
        title: "Pose le cadre",
        body: "Ambiance, durée, budget : 30 secondes et le groupe est d’accord sur le moment — pas sur 20 options.",
      },
      {
        title: "Vote en privé",
        body: "Chacun like ou passe. Personne ne joue un rôle. Personne ne cède juste pour avancer.",
      },
      {
        title: "Un plan commun",
        body: "FlipOn sort l’idée que le groupe est vraiment prêt à faire. Ensuite, vous y allez.",
      },
    ],
    outcomes: [
      {
        kicker: "Tout de suite",
        title: "Le débat s’arrête",
        points: ["Un cadre clair", "Chacun sur son téléphone", "Plus de « comme tu veux »"],
      },
      {
        kicker: "Ce soir",
        title: "Vous sortez vraiment",
        points: ["Un plan en quelques taps", "Une idée, pas dix", "Un horaire tenable"],
      },
      {
        kicker: "Ce week-end",
        title: "Un vrai rendez-vous",
        points: ["Brunch, balade ou terrasse", "Le même flux, jour ou soir", "Moins de friction dans le groupe"],
      },
      {
        kicker: "Ensuite",
        title: "Un réflexe de groupe",
        points: ["Un code à 4 lettres", "Plus de fil sans fin", "Vous tranchez, puis vous partez"],
      },
    ],
    audiences: [
      {
        title: "Potes",
        body: "Fini la boucle dans le groupe. Un code, un vote privé, un vrai plan.",
      },
      {
        title: "Couples",
        body: "Plus de « ça m’est égal ». Chacun vote, puis une seule idée sort.",
      },
      {
        title: "Colocs",
        body: "Un soir de semaine, peu de temps, petit budget : FlipOn trouve quand même un match.",
      },
      {
        title: "Week-end",
        body: "Brunch, balade, terrasse ou sortie plus tard : le même flux, jour ou soir.",
      },
    ],
    startSteps: [
      {
        title: "Lance la démo",
        body: "Vois le flux complet sur le web, en moins de deux minutes.",
      },
      {
        title: "Invite avec un code",
        body: "Partage 4 lettres. L’autre téléphone rejoint la session.",
      },
      {
        title: "Votez, puis sortez",
        body: "Likes privés. Un plan commun. La soirée peut commencer.",
      },
    ],
    faqs: [
      {
        q: "C’est quoi FlipOn ?",
        a: "FlipOn aide un groupe à choisir une activité ensemble. Vous posez un cadre, chacun vote en privé, et vous obtenez un plan commun — à la place d’un « on fait quoi ? » de 40 minutes.",
      },
      {
        q: "Comment marche le vote privé ?",
        a: "Chacun like ou passe les idées sur son téléphone. Personne ne voit les votes des autres en direct, donc pas de pression sociale. FlipOn sort ensuite l’idée qui passe pour le groupe.",
      },
      {
        q: "FlipOn est-il gratuit ?",
        a: "Oui. L’offre Basique est gratuite : catalogue, filtres et vote privé. Premium (en option) ajoute le contexte autour de vous, la météo et des idées IA.",
      },
      {
        q: "Faut-il être au même endroit ?",
        a: "Non. Une personne crée une session et partage un code à 4 lettres. Les autres rejoignent depuis leur téléphone, où qu’ils soient.",
      },
      {
        q: "Ça marche à deux ou en plus grand groupe ?",
        a: "Le flux actuel est conçu pour un duo (deux téléphones). La même idée — vote privé, un plan — est pensée pour s’étendre à un petit groupe.",
      },
    ],
    pullQuote: {
      lineA: "Un plan n’a pas besoin d’être parfait.",
      lineB: "Il doit juste avoir lieu.",
    },
  };
}
