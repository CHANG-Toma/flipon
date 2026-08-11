import { NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth";
import { corsPreflight, withCors } from "@/lib/cors";
import { hasDatabase, getPrisma } from "@/lib/db";
import {
  isDevPremiumClerkId,
  toSubscriptionView,
} from "@/lib/subscription";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function OPTIONS() {
  return corsPreflight();
}

async function handle(req: Request) {
  if (!hasDatabase()) {
    return withCors(
      NextResponse.json({ error: "Base de données non configurée." }, { status: 503 }),
    );
  }

  const clerkId = await getAuthUserId(req);
  if (!clerkId) {
    return withCors(
      NextResponse.json({ error: "Non authentifié." }, { status: 401 }),
    );
  }

  if (isDevPremiumClerkId(clerkId)) {
    return withCors(NextResponse.json(toSubscriptionView(null, true)));
  }

  const prisma = getPrisma();
  if (!prisma) {
    return withCors(
      NextResponse.json({ error: "Base de données non configurée." }, { status: 503 }),
    );
  }

  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { subscription: true },
  });

  return withCors(NextResponse.json(toSubscriptionView(user?.subscription ?? null)));
}

export async function GET(req: Request) {
  return handle(req);
}

export async function POST(req: Request) {
  return handle(req);
}
