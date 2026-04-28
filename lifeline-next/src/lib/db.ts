import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaFailed: boolean | undefined;
};

function createPrismaClient(): PrismaClient {
  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  } catch {
    // Prisma 7 client engine may require adapter/accelerateUrl
    // Return a proxy that will trigger demo mode on any query
    globalForPrisma.prismaFailed = true;
    return new Proxy({} as PrismaClient, {
      get(_target, prop) {
        if (prop === "$queryRaw" || prop === "$executeRaw") {
          return () => Promise.reject(new Error("Prisma client not available"));
        }
        if (prop === "$connect" || prop === "$disconnect") {
          return () => Promise.resolve();
        }
        // Return a proxy for any model access that rejects queries
        return new Proxy({}, {
          get() {
            return () => Promise.reject(new Error("Prisma client not available - demo mode"));
          },
        });
      },
    });
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Demo mode: when DB isn't connected or Prisma fails to init, API routes return mock data.
 */
export async function isDemoMode(): Promise<boolean> {
  if (globalForPrisma.prismaFailed) return true;
  try {
    await prisma.$queryRaw`SELECT 1`;
    return false;
  } catch {
    return true;
  }
}
