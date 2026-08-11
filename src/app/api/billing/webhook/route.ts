import { NextResponse } from "next/server";
import {
  applyRevenueCatWebhook,
  assertWebhookBodySize,
  verifyRevenueCatWebhookAuth,
} from "@/lib/subscription";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Webhook RevenueCat → upsert Subscription.
 * Configurer Authorization: Bearer <REVENUECAT_WEBHOOK_SECRET> dans le dashboard RC.
 */
export async function POST(req: Request) {
  if (!verifyRevenueCatWebhookAuth(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!assertWebhookBodySize(req)) {
    return NextResponse.json({ error: "Payload trop volumineux." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide." }, { status: 400 });
  }

  const result = await applyRevenueCatWebhook(body);

  if (!result.ok) {
    if (result.soft) {
      return NextResponse.json({ ignored: true, reason: result.error });
    }
    return NextResponse.json({ error: result.error }, { status: 503 });
  }

  // Ne pas renvoyer clerkId (surface d’info inutile)
  return NextResponse.json({ ok: true });
}
