import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as typeof globalThis & {
  __fliponPrisma?: PrismaClient;
};

export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

/** Singleton Prisma — réutilise la connexion en hot-reload Next.js. */
export function getPrisma(): PrismaClient | null {
  if (!hasDatabase()) return null;
  if (!globalForPrisma.__fliponPrisma) {
    globalForPrisma.__fliponPrisma = new PrismaClient({
      log:
        process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
      // Évite les fuites de connexions en serverless / hot reload
      datasources: process.env.DATABASE_URL
        ? { db: { url: process.env.DATABASE_URL } }
        : undefined,
    });
  }
  return globalForPrisma.__fliponPrisma;
}
