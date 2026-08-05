import { NextResponse } from "next/server";
import { readDeviceKey, resolveDbUser } from "@/lib/auth";
import { corsPreflight, withCors } from "@/lib/cors";
import { joinRoom, toPublicSnapshot } from "@/lib/duo-rooms";
import { persistGuestJoined } from "@/lib/session-persist";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function OPTIONS() {
  return corsPreflight();
}

export async function POST(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const room = await joinRoom(id);
  if (!room) {
    return withCors(
      NextResponse.json({ error: "Session introuvable" }, { status: 404 }),
    );
  }

  const user = await resolveDbUser(req);
  const deviceKey = readDeviceKey(req);
  try {
    await persistGuestJoined({
      sessionId: room.id,
      deviceKey,
      userId: user?.id ?? null,
    });
  } catch {
    /* ignore */
  }

  return withCors(
    NextResponse.json({
      role: "guest" as const,
      room: toPublicSnapshot(room, "guest"),
      deviceKey,
    }),
  );
}
