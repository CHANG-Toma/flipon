import { NextResponse } from "next/server";
import { joinRoom, toPublicSnapshot } from "@/lib/duo-rooms";
import { corsPreflight, withCors } from "@/lib/cors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function OPTIONS() {
  return corsPreflight();
}

export async function POST(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const room = await joinRoom(id);
  if (!room) {
    return withCors(
      NextResponse.json({ error: "Session introuvable" }, { status: 404 }),
    );
  }

  return withCors(
    NextResponse.json({
      role: "guest" as const,
      room: toPublicSnapshot(room, "guest"),
    }),
  );
}
