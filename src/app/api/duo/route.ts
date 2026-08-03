import { NextRequest, NextResponse } from "next/server";
import { normalizeConstraints } from "@/data/plans";
import {
  createRoom,
  hasDurableStore,
  toPublicSnapshot,
} from "@/lib/duo-rooms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (process.env.VERCEL && !hasDurableStore()) {
    return NextResponse.json(
      {
        error:
          "Redis non configuré. Connecte la base Redis au projet flipon (REDIS_URL), puis redéploie.",
      },
      { status: 503 },
    );
  }

  let body: { constraints?: Parameters<typeof normalizeConstraints>[0] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  if (!body.constraints) {
    return NextResponse.json({ error: "constraints requis" }, { status: 400 });
  }

  const room = await createRoom(normalizeConstraints(body.constraints));
  return NextResponse.json({
    role: "host" as const,
    room: toPublicSnapshot(room, "host"),
  });
}
