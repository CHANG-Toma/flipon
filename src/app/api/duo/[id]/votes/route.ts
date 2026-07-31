import { NextRequest, NextResponse } from "next/server";
import { submitVotes, toPublicSnapshot, type DuoRole } from "@/lib/duo-rooms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  let body: { role?: DuoRole; likedIds?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  if (body.role !== "host" && body.role !== "guest") {
    return NextResponse.json({ error: "role invalide" }, { status: 400 });
  }
  if (!Array.isArray(body.likedIds)) {
    return NextResponse.json({ error: "likedIds requis" }, { status: 400 });
  }

  const room = submitVotes(id, body.role, body.likedIds);
  if (!room) {
    return NextResponse.json(
      { error: "Session introuvable ou vote trop tôt" },
      { status: 404 },
    );
  }

  return NextResponse.json(toPublicSnapshot(room, body.role));
}
