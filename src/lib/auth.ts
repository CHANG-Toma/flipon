import { createClerkClient, verifyToken } from "@clerk/backend";
import { getPrisma } from "@/lib/db";

export function getClerkSecretKey() {
  return process.env.CLERK_SECRET_KEY?.trim() || "";
}

export function isClerkServerConfigured() {
  return Boolean(getClerkSecretKey());
}

export async function getAuthUserId(req: Request): Promise<string | null> {
  const secret = getClerkSecretKey();
  if (!secret) return null;

  const header = req.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token) return null;

  try {
    const payload = await verifyToken(token, { secretKey: secret });
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}

export async function upsertUserFromClerk(input: {
  clerkId: string;
  email?: string | null;
  displayName?: string | null;
}) {
  const prisma = getPrisma();
  if (!prisma) return null;

  return prisma.user.upsert({
    where: { clerkId: input.clerkId },
    create: {
      clerkId: input.clerkId,
      email: input.email ?? null,
      displayName: input.displayName ?? null,
    },
    update: {
      email: input.email ?? undefined,
      displayName: input.displayName ?? undefined,
    },
  });
}

export async function resolveDbUser(req: Request) {
  const clerkId = await getAuthUserId(req);
  if (!clerkId) return null;

  const prisma = getPrisma();
  if (!prisma) return null;

  const existing = await prisma.user.findUnique({ where: { clerkId } });
  if (existing) return existing;

  // Best-effort profile from Clerk if secret configured
  try {
    const client = createClerkClient({ secretKey: getClerkSecretKey() });
    const user = await client.users.getUser(clerkId);
    const email =
      user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
        ?.emailAddress ?? user.emailAddresses[0]?.emailAddress;
    const displayName =
      [user.firstName, user.lastName].filter(Boolean).join(" ") ||
      user.username ||
      null;
    return upsertUserFromClerk({ clerkId, email, displayName });
  } catch {
    return upsertUserFromClerk({ clerkId });
  }
}

export function readDeviceKey(req: Request) {
  const fromHeader = req.headers.get("x-flipon-device-key")?.trim();
  if (fromHeader && fromHeader.length >= 8 && fromHeader.length <= 64) {
    return fromHeader;
  }
  return `anon-${Date.now().toString(36)}`;
}
