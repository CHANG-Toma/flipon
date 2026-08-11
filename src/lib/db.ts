import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as typeof globalThis & {
  __fliponPrisma?: PrismaClient;
};

// Permet de vérifier si la base de données est configurée
export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

// Permet de récupérer le singleton Prisma pour réutiliser la connexion en hot-reload Next.js.
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
