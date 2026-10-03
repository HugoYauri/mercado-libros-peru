import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.js";
let prisma;
export function getPrisma() {
  if (!process.env.DATABASE_URL) throw new Error("Falta DATABASE_URL.");
  prisma ??= new PrismaClient({
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL,
      max: 3,
    }),
  });
  return prisma;
}
