import { auth } from "@clerk/nextjs/server";
import { createClerkClient, verifyToken } from "@clerk/backend";
import { getPrisma } from "@/lib/db";

// Permet de récupérer la clé secrète de Clerk
export function getClerkSecretKey() {
  return process.env.CLERK_SECRET_KEY?.trim() || "";
}

// Permet de vérifier si le serveur Clerk est configuré
export function isClerkServerConfigured() {
  return Boolean(getClerkSecretKey());
}

// Permet de récupérer l'ID de l'utilisateur authentifié
export async function getAuthUserId(req: Request): Promise<string | null> {
  const secret = getClerkSecretKey();
  if (!secret) return null;

  const header = req.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (token) {
    try {
      const payload = await verifyToken(token, { secretKey: secret });
      return typeof payload.sub === "string" ? payload.sub : null;
    } catch {
      return null;
    }
  }

  try {
    const { userId } = await auth();
    return userId ?? null;
  } catch {
    return null;
  }
}

// Permet de mettre à jour ou créer un utilisateur depuis Clerk
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

// Permet de résoudre un utilisateur depuis la base de données
export async function resolveDbUser(req: Request) {
  const clerkId = await getAuthUserId(req);
  if (!clerkId) return null;

  const prisma = getPrisma();
  if (!prisma) return null;

  const existing = await prisma.user.findUnique({ where: { clerkId } });
  if (existing) return existing;

  // Tentative de récupération du profil depuis Clerk si la clé secrète est configurée
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

// Permet de lire la clé de l'appareil
export function readDeviceKey(req: Request) {
  const fromHeader = req.headers.get("x-flipon-device-key")?.trim();
  if (fromHeader && fromHeader.length >= 8 && fromHeader.length <= 64) {
    return fromHeader;
  }
  return `anon-${Date.now().toString(36)}`;
}
