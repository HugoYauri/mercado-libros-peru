import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";
import catalogoRoutes from "./routes/catalogo.routes.js";
import { errorHandler, notFound } from "./middleware/errors.js";
const app = express();
app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: env.frontendOrigin }));
app.use(express.json({ limit: "64kb" }));
// Liveness de la API, no prueba conectividad con PostgreSQL.
app.get("/api/health", (_req, res) =>
  res.json({
    status: "ok",
    service: "mercado-libros-ulima",
    dataSource: env.dataSource,
    databaseVerified: false,
    scope: "read-only-scaffold",
  }),
);
app.use("/api", catalogoRoutes);
app.use(notFound);
app.use(errorHandler);
export default app;
