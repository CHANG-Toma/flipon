import { NextResponse } from "next/server";
import { resolveDbUser } from "@/lib/auth";
import { corsPreflight, withCors } from "@/lib/cors";
import { hasDatabase } from "@/lib/db";
import {
  ensureWebTrial,
  isDevPremiumClerkId,
  toSubscriptionView,
} from "@/lib/subscription";

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

  if (isDevPremiumClerkId(user.clerkId)) {
    const view = toSubscriptionView(null, true);
    return withCors(
      NextResponse.json({
        id: user.id,
        clerkId: user.clerkId,
        email: user.email,
        displayName: user.displayName,
        plan: view.plan,
        isPremium: view.isPremium,
        subscriptionStatus: view.status,
        subscriptionExpiresAt: view.expiresAt,
        store: view.store,
        source: view.source,
        expiresAt: view.expiresAt,
      }),
    );
  }

  const sub = await ensureWebTrial(user.id);
  const view = toSubscriptionView(sub);

  return withCors(
    NextResponse.json({
      id: user.id,
      clerkId: user.clerkId,
      email: user.email,
      displayName: user.displayName,
      plan: view.plan,
      isPremium: view.isPremium,
      subscriptionStatus: view.status,
      subscriptionExpiresAt: view.expiresAt,
      store: view.store,
      source: view.source,
      expiresAt: view.expiresAt,
    }),
  );
}

export async function GET(req: Request) {
  return POST(req);
}
