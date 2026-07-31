import { NextResponse } from "next/server";
import { joinRoom, toPublicSnapshot } from "@/lib/duo-rooms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const room = joinRoom(id);
  if (!room) {
    return NextResponse.json({ error: "Session introuvable" }, { status: 404 });
  }

  return NextResponse.json({
    role: "guest" as const,
    room: toPublicSnapshot(room, "guest"),
  });
}
