import { NextRequest, NextResponse } from "next/server";
import { SessionStatus } from "@prisma/client";
import { corsPreflight, withCors } from "@/lib/cors";
import { setReady, toPublicSnapshot, type DuoRole } from "@/lib/duo-rooms";
import { persistSessionStatus } from "@/lib/session-persist";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function OPTIONS() {
  return corsPreflight();
}

export async function POST(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  let body: { role?: DuoRole };
  try {
    body = await req.json();
  } catch {
    return withCors(NextResponse.json({ error: "JSON invalide" }, { status: 400 }));
  }

  if (body.role !== "host" && body.role !== "guest") {
    return withCors(NextResponse.json({ error: "role invalide" }, { status: 400 }));
  }

  const room = await setReady(id, body.role);
  if (!room) {
    return withCors(
      NextResponse.json(
        { error: "Session introuvable ou invité manquant" },
        { status: 404 },
      ),
    );
  }

  try {
    if (room.hostReady && room.guestReady) {
      await persistSessionStatus(room.id, SessionStatus.VOTING);
    }
  } catch {
    /* ignore */
  }

  return withCors(NextResponse.json(toPublicSnapshot(room, body.role)));
}
