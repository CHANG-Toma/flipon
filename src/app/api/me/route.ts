import { NextResponse } from "next/server";
import { resolveDbUser } from "@/lib/auth";
import { corsPreflight, withCors } from "@/lib/cors";
import { hasDatabase } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function OPTIONS() {
  return corsPreflight();
}

export async function POST(req: Request) {
  if (!hasDatabase()) {
    return withCors(
      NextResponse.json({ error: "Base de données non configurée." }, { status: 503 }),
    );
  }

  const user = await resolveDbUser(req);
  if (!user) {
    return withCors(
      NextResponse.json({ error: "Non authentifié." }, { status: 401 }),
    );
  }

  return withCors(
    NextResponse.json({
      id: user.id,
      clerkId: user.clerkId,
      email: user.email,
      displayName: user.displayName,
    }),
  );
}

export async function GET(req: Request) {
  return POST(req);
}
