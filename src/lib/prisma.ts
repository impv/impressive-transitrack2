import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

// TODO:本番環境ではSSL証明書の検証(rejectUnauthorized: true)を有効化し、
//       必要に応じて信頼できる証明書を導入すること
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 10000,
});

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error", "warn"],
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
