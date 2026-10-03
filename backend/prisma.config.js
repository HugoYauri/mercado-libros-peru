import "dotenv/config";
import { defineConfig } from "prisma/config";
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations", seed: "node prisma/seed.js" },
  // Vacío permite generate/validate sin una base. migrate necesita DIRECT_URL real.
  datasource: { url: process.env.DIRECT_URL || "" },
});
