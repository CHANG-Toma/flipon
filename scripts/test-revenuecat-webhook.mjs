/**
 * Simule un event RevenueCat (achat / expiration) vers le webhook local.
 *
 * Usage (serveur Next lancé) :
 *   npm run test:rc-webhook -- user_xxx
 *   npm run test:rc-webhook -- user_xxx EXPIRATION
 */
const clerkId = process.argv[2]?.trim();
const eventType = (process.argv[3]?.trim() || "INITIAL_PURCHASE").toUpperCase();
const secret = process.env.REVENUECAT_WEBHOOK_SECRET?.trim();
const base = (process.env.TEST_WEBHOOK_URL || "http://127.0.0.1:3000").replace(/\/$/, "");

if (!clerkId || !clerkId.startsWith("user_")) {
  console.error("Usage: npm run test:rc-webhook -- user_<clerkId> [INITIAL_PURCHASE|EXPIRATION|CANCELLATION]");
  process.exit(1);
}

if (!secret || secret.length < 16) {
  console.error("REVENUECAT_WEBHOOK_SECRET manquant ou trop court (min. 16).");
  process.exit(1);
}

const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

const body = {
  api_version: "1.0",
  event: {
    type: eventType,
    id: `test_${Date.now()}`,
    app_user_id: clerkId,
    store: "APP_STORE",
    expiration_at_ms: eventType === "EXPIRATION" ? Date.now() - 1000 : expiresAt.getTime(),
    entitlement_ids: ["Flipon Pro"],
    entitlements: {
      "Flipon Pro": {
        expires_date: expiresAt.toISOString(),
        product_identifier: "monthly",
      },
    },
  },
};

const res = await fetch(`${base}/api/billing/webhook`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${secret}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});

const text = await res.text();
console.log(res.status, text);
if (!res.ok) process.exit(1);
