import { NextResponse } from "next/server";
import { closeRoom } from "@/lib/duo-rooms";
import { corsPreflight, withCors } from "@/lib/cors";
import { persistSessionClosed } from "@/lib/session-persist";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function OPTIONS() {
  return corsPreflight();
}

export async function POST(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  await closeRoom(id);
  try {
    await persistSessionClosed(id);
  } catch {
    /* ignore */
  }
  return withCors(NextResponse.json({ ok: true }));
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  await closeRoom(id);
  try {
    await persistSessionClosed(id);
  } catch {
    /* ignore */
  }
  return withCors(NextResponse.json({ ok: true }));
}
