import { NextResponse } from "next/server";
import { closeRoom } from "@/lib/duo-rooms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  await closeRoom(id);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  await closeRoom(id);
  return NextResponse.json({ ok: true });
}
