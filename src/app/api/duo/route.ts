import { NextRequest, NextResponse } from "next/server";
import { normalizeConstraints } from "@/data/plans";
import { readDeviceKey, resolveDbUser } from "@/lib/auth";
import { corsPreflight, withCors } from "@/lib/cors";
import {
  createRoom,
  hasDurableStore,
  toPublicSnapshot,
} from "@/lib/duo-rooms";
import { persistSessionCreated } from "@/lib/session-persist";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
  const room = await createRoom(normalizeConstraints(body.constraints));

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
    }),
  );
}
