import { NextRequest, NextResponse } from "next/server";
import { setReady, toPublicSnapshot, type DuoRole } from "@/lib/duo-rooms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  let body: { role?: DuoRole };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  if (body.role !== "host" && body.role !== "guest") {
    return NextResponse.json({ error: "role invalide" }, { status: 400 });
  }

  const room = setReady(id, body.role);
  if (!room) {
    return NextResponse.json(
      { error: "Session introuvable ou invité manquant" },
      { status: 404 },
    );
  }

  return NextResponse.json(toPublicSnapshot(room, body.role));
}
