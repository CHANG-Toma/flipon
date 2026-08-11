import { NextRequest, NextResponse } from "next/server";
import { normalizeConstraints, normalizeContextHint } from "@/data/plans";
import { readDeviceKey, resolveDbUser } from "@/lib/auth";
import { corsPreflight, withCors } from "@/lib/cors";
import {
  createRoom,
  hasDurableStore,
  toPublicSnapshot,
} from "@/lib/duo-rooms";
import { persistSessionCreated } from "@/lib/session-persist";
import {
  getSubscriptionViewForClerkId,
  isDevPremiumAllowed,
} from "@/lib/subscription";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/** OSM + Gemini peuvent dépasser 10s */
export const maxDuration = 30;

export async function OPTIONS() {
  return corsPreflight();
}

export async function POST(req: NextRequest) {
  if (process.env.VERCEL && !hasDurableStore()) {
    return withCors(
      NextResponse.json(
        {
          error:
            "Le duo n’est pas disponible pour le moment. Réessaie plus tard.",
        },
        { status: 503 },
      ),
    );
  }

  let body: {
    constraints?: Parameters<typeof normalizeConstraints>[0];
    context?: Parameters<typeof normalizeContextHint>[0];
    type?: "DUO" | "GROUPE";
    partySize?: number;
  };
  try {
    body = await req.json();
  } catch {
    return withCors(NextResponse.json({ error: "JSON invalide" }, { status: 400 }));
  }

  if (!body.constraints) {
    return withCors(
      NextResponse.json({ error: "constraints requis" }, { status: 400 }),
    );
  }

  const user = await resolveDbUser(req);
  const deviceKey = readDeviceKey(req);
  const context = normalizeContextHint(body.context);

  let premiumDeck = false;
  if (context) {
    if (user) {
      const view = await getSubscriptionViewForClerkId(user.clerkId);
      premiumDeck = Boolean(view?.isPremium);
    }
    // Dev DX : contexte envoyé + clé IA / OSM sans abo factice
    if (
      !premiumDeck &&
      isDevPremiumAllowed() &&
      process.env.ALLOW_DEV_AI_DECK !== "0"
    ) {
      premiumDeck = true;
    }
  }

  const room = await createRoom(
    normalizeConstraints(body.constraints),
    context,
    { premiumDeck },
  );

  try {
    await persistSessionCreated({
      room,
      type: body.type,
      partySize: body.partySize,
      hostUserId: user?.id ?? null,
      hostDeviceKey: deviceKey,
    });
  } catch {
    /* Redis-only fallback if Postgres unreachable */
  }

  return withCors(
    NextResponse.json({
      role: "host" as const,
      room: toPublicSnapshot(room, "host"),
      deviceKey,
      deckSource: room.deckSource ?? "catalogue",
    }),
  );
}
