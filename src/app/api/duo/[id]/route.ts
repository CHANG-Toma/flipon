import { NextRequest, NextResponse } from "next/server";
import { corsPreflight, withCors } from "@/lib/cors";
import { getRoom, saveRoomIfMissing, toPublicSnapshot, type DuoRole } from "@/lib/duo-rooms";
import { loadRoomFromPostgres } from "@/lib/session-persist";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function OPTIONS() {
  return corsPreflight();
}

export async function GET(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const role = (req.nextUrl.searchParams.get("role") ?? "host") as DuoRole;
  if (role !== "host" && role !== "guest") {
    return withCors(NextResponse.json({ error: "role invalide" }, { status: 400 }));
  }

  let room = await getRoom(id);
  if (!room) {
    const fromPg = await loadRoomFromPostgres(id);
    if (fromPg) {
      await saveRoomIfMissing(fromPg);
      room = fromPg;
    }
  }

  if (!room) {
    return withCors(
      NextResponse.json({ error: "Session introuvable" }, { status: 404 }),
    );
  }

  return withCors(NextResponse.json(toPublicSnapshot(room, role)));
}
