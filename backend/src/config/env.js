import "dotenv/config";
const dataSource = process.env.DATA_SOURCE || "seed";
if (!["seed", "prisma"].includes(dataSource))
  throw new Error("DATA_SOURCE debe ser seed o prisma.");
if (process.env.NODE_ENV === "production" && dataSource !== "prisma")
  throw new Error("Producción requiere DATA_SOURCE=prisma.");
if (dataSource === "prisma" && !process.env.DATABASE_URL)
  throw new Error("Falta DATABASE_URL para el adaptador Prisma.");
export const env = {
  port: Number(process.env.PORT || 3001),
  dataSource,
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
};
