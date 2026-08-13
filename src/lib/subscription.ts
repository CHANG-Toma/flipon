/**
 * Abonnement Premium (serveur)
 * ----------------------------
 * Source de vérité : table Prisma `Subscription` (webhook RevenueCat).
 * Essai web 7 jours au premier login, jusqu’au premier event RC.
 * Dev : `DEV_PREMIUM_CLERK_IDS` uniquement hors production (ou ALLOW_DEV_PREMIUM=1).
 */
import { createHash, timingSafeEqual } from "node:crypto";
import {
  SubscriptionPlan,
  SubscriptionStatus,
  type Subscription,
  type User,
} from "@prisma/client";
import { getAuthUserId, resolveDbUser } from "@/lib/auth";
import { getPrisma } from "@/lib/db";

export const PREMIUM_ENTITLEMENT_ID = "Flipon Pro";
export const WEB_TRIAL_STORE = "web_trial";
export const WEB_TRIAL_DAYS = 7;

function sourceFromSubscription(
  sub: Subscription | null | undefined,
  premium: boolean,
): SubscriptionSource {
  if (!premium) return "none";
  if (sub?.store === WEB_TRIAL_STORE) return "trial";
  return "paid";
}

/** Clerk user ids look like `user_2abc…`. */
const CLERK_USER_ID_RE = /^user_[a-zA-Z0-9_-]{8,128}$/;

export type FlipOnPlan = "basique" | "premium";

export type SubscriptionSource = "trial" | "paid" | "none";

export type SubscriptionView = {
  plan: FlipOnPlan;
  isPremium: boolean;
  status: SubscriptionStatus | null;
  expiresAt: string | null;
  store: string | null;
  source: SubscriptionSource;
};

let cachedDevPremiumIds: Set<string> | null = null;

function parseDevPremiumClerkIds(): Set<string> {
  if (cachedDevPremiumIds) return cachedDevPremiumIds;
  const raw = process.env.DEV_PREMIUM_CLERK_IDS?.trim() || "";
  cachedDevPremiumIds = new Set(
    raw
      .split(",")
      .map((id) => id.trim())
      .filter((id) => CLERK_USER_ID_RE.test(id)),
  );
  return cachedDevPremiumIds;
}

/** Override Premium serveur : jamais silencieux en prod sauf ALLOW_DEV_PREMIUM=1. */
export function isDevPremiumAllowed(): boolean {
  if (process.env.ALLOW_DEV_PREMIUM?.trim() === "1") return true;
  return process.env.NODE_ENV !== "production";
}

export function isDevPremiumClerkId(clerkId: string): boolean {
  if (!isDevPremiumAllowed()) return false;
  return parseDevPremiumClerkIds().has(clerkId);
}

export function isValidClerkUserId(id: string): boolean {
  return CLERK_USER_ID_RE.test(id);
}

export function isSubscriptionPremium(
  sub: Subscription | null | undefined,
): boolean {
  if (!sub) return false;
  if (sub.plan !== SubscriptionPlan.PREMIUM) return false;
  if (
    sub.status !== SubscriptionStatus.ACTIVE &&
    sub.status !== SubscriptionStatus.CANCELLED
  ) {
    return false;
  }
  // CANCELLED sans date de fin → ne pas garder Premium indéfiniment
  if (sub.status === SubscriptionStatus.CANCELLED && !sub.expiresAt) {
    return false;
  }
  if (sub.expiresAt && sub.expiresAt.getTime() <= Date.now()) return false;
  return true;
}

export function toSubscriptionView(
  sub: Subscription | null | undefined,
  forcePremium = false,
): SubscriptionView {
  if (forcePremium) {
    return {
      plan: "premium",
      isPremium: true,
      status: SubscriptionStatus.ACTIVE,
      expiresAt: null,
      store: "dev_override",
      source: "paid",
    };
  }
  const premium = isSubscriptionPremium(sub);
  return {
    plan: premium ? "premium" : "basique",
    isPremium: premium,
    status: sub?.status ?? null,
    expiresAt: sub?.expiresAt?.toISOString() ?? null,
    store: sub?.store ?? null,
    source: sourceFromSubscription(sub, premium),
  };
}

export async function getSubscriptionForUserId(userId: string) {
  const prisma = getPrisma();
  if (!prisma) return null;
  return prisma.subscription.findUnique({ where: { userId } });
}

/** Premier login web : Premium 7 jours, sans écraser un abo RevenueCat. */
export async function ensureWebTrial(userId: string) {
  const prisma = getPrisma();
  if (!prisma) return null;

  const existing = await prisma.subscription.findUnique({ where: { userId } });
  if (existing) return existing;

  const expiresAt = new Date(Date.now() + WEB_TRIAL_DAYS * 24 * 60 * 60 * 1000);
  return prisma.subscription.create({
    data: {
      userId,
      plan: SubscriptionPlan.PREMIUM,
      status: SubscriptionStatus.ACTIVE,
      store: WEB_TRIAL_STORE,
      expiresAt,
    },
  });
}

export async function getSubscriptionViewForClerkId(
  clerkId: string,
): Promise<SubscriptionView | null> {
  const prisma = getPrisma();
  if (!prisma) return null;

  if (isDevPremiumClerkId(clerkId)) {
    return toSubscriptionView(null, true);
  }

  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { subscription: true },
  });
  if (!user) return toSubscriptionView(null);
  return toSubscriptionView(user.subscription);
}

/**
 * Gate Premium pour les routes API sensibles.
 * 1 round-trip User+Subscription (sauf override DEV).
 */
export async function requirePremium(
  req: Request,
): Promise<
  | { ok: true; clerkId: string; user: User }
  | { ok: false; response: Response }
> {
  const clerkId = await getAuthUserId(req);
  if (!clerkId) {
    return {
      ok: false,
      response: Response.json({ error: "Non authentifié." }, { status: 401 }),
    };
  }

  const prisma = getPrisma();
  if (!prisma) {
    return {
      ok: false,
      response: Response.json(
        { error: "Base de données non configurée." },
        { status: 503 },
      ),
    };
  }

  if (isDevPremiumClerkId(clerkId)) {
    const user = await resolveDbUser(req);
    if (!user) {
      return {
        ok: false,
        response: Response.json({ error: "Non authentifié." }, { status: 401 }),
      };
    }
    return { ok: true, clerkId, user };
  }

  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: { subscription: true },
  });

  if (!user) {
    // Peut créer la ligne User si JWT valide mais pas encore sync
    const created = await resolveDbUser(req);
    if (!created) {
      return {
        ok: false,
        response: Response.json({ error: "Non authentifié." }, { status: 401 }),
      };
    }
    return {
      ok: false,
      response: Response.json(
        { error: "Abonnement Premium requis.", plan: "basique" },
        { status: 403 },
      ),
    };
  }

  if (!isSubscriptionPremium(user.subscription)) {
    return {
      ok: false,
      response: Response.json(
        { error: "Abonnement Premium requis.", plan: "basique" },
        { status: 403 },
      ),
    };
  }

  const { subscription: _sub, ...userOnly } = user;
  return { ok: true, clerkId, user: userOnly };
}

type RevenueCatEntitlement = {
  expires_date?: string | null;
  purchase_date?: string | null;
  product_identifier?: string | null;
};

type RevenueCatEventBody = {
  api_version?: string;
  event?: {
    type?: string;
    id?: string;
    app_user_id?: string;
    original_app_user_id?: string;
    store?: string;
    expiration_at_ms?: number | null;
    entitlement_ids?: string[] | null;
    entitlements?: Record<string, RevenueCatEntitlement> | null;
  };
};

const ACTIVE_EVENT_TYPES = new Set([
  "INITIAL_PURCHASE",
  "RENEWAL",
  "PRODUCT_CHANGE",
  "UNCANCELLATION",
  "NON_RENEWING_PURCHASE",
  "SUBSCRIPTION_EXTENDED",
  "TEMPORARY_ENTITLEMENT_GRANT",
]);

function hasPremiumEntitlement(event: NonNullable<RevenueCatEventBody["event"]>) {
  const ids = [PREMIUM_ENTITLEMENT_ID, "premium"];
  if (event.entitlement_ids?.some((id) => ids.includes(id))) return true;
  if (event.entitlements && ids.some((id) => id in event.entitlements)) {
    return true;
  }
  return false;
}

function resolveExpiresAt(
  event: NonNullable<RevenueCatEventBody["event"]>,
): Date | null {
  if (typeof event.expiration_at_ms === "number" && event.expiration_at_ms > 0) {
    return new Date(event.expiration_at_ms);
  }
  const ent =
    event.entitlements?.[PREMIUM_ENTITLEMENT_ID] ??
    event.entitlements?.premium;
  if (ent?.expires_date) {
    const d = new Date(ent.expires_date);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return null;
}

/**
 * Upsert Subscription depuis un event webhook RevenueCat.
 * `app_user_id` = Clerk userId (après Purchases.logIn).
 */
export async function applyRevenueCatWebhook(
  body: unknown,
): Promise<{ ok: true; clerkId: string } | { ok: false; error: string; soft?: boolean }> {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Event invalide.", soft: true };
  }

  const event = (body as RevenueCatEventBody).event;
  if (!event?.type || typeof event.app_user_id !== "string") {
    return { ok: false, error: "Event invalide.", soft: true };
  }

  const clerkId = event.app_user_id.trim();
  if (!clerkId || clerkId.startsWith("$RCAnonymousID:")) {
    return { ok: false, error: "app_user_id anonyme ignoré.", soft: true };
  }
  if (!isValidClerkUserId(clerkId)) {
    return { ok: false, error: "app_user_id invalide.", soft: true };
  }

  const prisma = getPrisma();
  if (!prisma) return { ok: false, error: "BDD non configurée." };

  const type = event.type.toUpperCase();
  const premiumRelated = hasPremiumEntitlement(event);
  const expiresAt = resolveExpiresAt(event);
  const store =
    typeof event.store === "string" ? event.store.toLowerCase().slice(0, 64) : null;

  let plan: SubscriptionPlan = SubscriptionPlan.BASIQUE;
  let status: SubscriptionStatus = SubscriptionStatus.EXPIRED;
  let shouldWrite = true;

  if (ACTIVE_EVENT_TYPES.has(type) && premiumRelated) {
    plan = SubscriptionPlan.PREMIUM;
    status = SubscriptionStatus.ACTIVE;
  } else if (type === "BILLING_ISSUE" && premiumRelated) {
    plan = SubscriptionPlan.PREMIUM;
    status = SubscriptionStatus.BILLING_ISSUE;
  } else if (type === "CANCELLATION" && premiumRelated) {
    if (expiresAt && expiresAt.getTime() > Date.now()) {
      plan = SubscriptionPlan.PREMIUM;
      status = SubscriptionStatus.CANCELLED;
    } else {
      plan = SubscriptionPlan.BASIQUE;
      status = SubscriptionStatus.EXPIRED;
    }
  } else if (type === "EXPIRATION" || type === "SUBSCRIPTION_PAUSED") {
    plan = SubscriptionPlan.BASIQUE;
    status = SubscriptionStatus.EXPIRED;
  } else if (type === "TRANSFER" && premiumRelated) {
    plan = SubscriptionPlan.PREMIUM;
    status = SubscriptionStatus.ACTIVE;
  } else {
    shouldWrite = false;
  }

  if (
    shouldWrite &&
    status === SubscriptionStatus.ACTIVE &&
    expiresAt &&
    expiresAt.getTime() <= Date.now()
  ) {
    plan = SubscriptionPlan.BASIQUE;
    status = SubscriptionStatus.EXPIRED;
  }

  if (!shouldWrite) {
    return { ok: true, clerkId };
  }

  const user = await prisma.user.upsert({
    where: { clerkId },
    create: { clerkId },
    update: {},
  });

  await prisma.subscription.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      plan,
      status,
      store,
      revenueCatAppUserId: clerkId,
      expiresAt,
    },
    update: {
      plan,
      status,
      store: store ?? undefined,
      revenueCatAppUserId: clerkId,
      expiresAt,
    },
  });

  return { ok: true, clerkId };
}

const MAX_WEBHOOK_BYTES = 64 * 1024;

export function assertWebhookBodySize(req: Request): boolean {
  const len = req.headers.get("content-length");
  if (!len) return true;
  const n = Number(len);
  return Number.isFinite(n) && n >= 0 && n <= MAX_WEBHOOK_BYTES;
}

export function verifyRevenueCatWebhookAuth(req: Request): boolean {
  const secret = process.env.REVENUECAT_WEBHOOK_SECRET?.trim();
  if (!secret || secret.length < 16) return false;

  const header = req.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ")
    ? header.slice(7).trim()
    : header.trim();
  if (!token) return false;

  const a = createHash("sha256").update(token).digest();
  const b = createHash("sha256").update(secret).digest();
  return timingSafeEqual(a, b);
}
