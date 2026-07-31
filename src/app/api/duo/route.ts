import { NextRequest, NextResponse } from "next/server";
import type { Constraints } from "@/data/plans";
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
          "Stockage duo manquant sur Vercel. Ajoute Upstash Redis / Vercel KV (KV_REST_API_URL + KV_REST_API_TOKEN), puis redéploie.",
      },
      { status: 503 },
    );
  }

  let body: { constraints?: Constraints };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  if (!body.constraints) {
    return NextResponse.json({ error: "constraints requis" }, { status: 400 });
  }

  const room = await createRoom(body.constraints);
  return NextResponse.json({
    role: "host" as const,
    room: toPublicSnapshot(room, "host"),
  });
}
