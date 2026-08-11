/** Types partagés client / API pour les sessions duo (sans store serveur). */

import type { Constraints, Plan } from "@/data/plans";

export type DuoRole = "host" | "guest";

export type DeckSource = "ai" | "pois" | "catalogue";

export type DuoPublicSnapshot = {
  id: string;
  constraints: Constraints;
  deck: Plan[];
  deckSource?: DeckSource;
  guestJoined: boolean;
  hostReady: boolean;
  guestReady: boolean;
  bothReady: boolean;
  youVoted: boolean;
  partnerVoted: boolean;
  bothVoted: boolean;
  match: Plan | null;
};
