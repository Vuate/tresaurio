// lib/db.ts
// Prisma client singleton for Next.js (Prisma 7)

import { PrismaClient } from "@prisma/client";

import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Parse DATABASE_URL - handle Prisma Postgres URL format
function getConnectionString(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  // If it's a Prisma Postgres URL, extract the actual postgres URL
  if (url.includes("prisma+postgres") && url.includes("api_key=")) {
    try {
      const apiKey = url.split("api_key=")[1];
      const decoded = JSON.parse(Buffer.from(apiKey, "base64").toString());
      return decoded.databaseUrl;
    } catch {
      throw new Error("Failed to parse Prisma Postgres URL");
    }
  }

  // Standard postgres URL
  return url;
}

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: getConnectionString(),
});

// Create Prisma adapter
const adapter = new PrismaPg(pool);

// Create Prisma client with adapter
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
