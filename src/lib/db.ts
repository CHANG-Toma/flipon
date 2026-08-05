import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as typeof globalThis & {
  __fliponPrisma?: PrismaClient;
};

export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function getPrisma(): PrismaClient | null {
  if (!hasDatabase()) return null;
  if (!globalForPrisma.__fliponPrisma) {
    globalForPrisma.__fliponPrisma = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }
  return globalForPrisma.__fliponPrisma;
}
