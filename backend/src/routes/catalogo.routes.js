import { Router } from "express";
import { z } from "zod";
import { catalogoController as c } from "../controllers/catalogo.controller.js";
import { validateQuery } from "../middleware/validate.js";
import { PRODUCTO_ESTADOS } from "../models/estados.js";
const price = z.preprocess(
  (v) => (v === "" ? undefined : v),
  z.coerce.number().finite().min(0).max(999999).optional(),
);
const query = z
  .object({
    q: z.string().max(120).default(""),
    categoriaId: z.string().max(80).default(""),
    cursoId: z.string().max(80).default(""),
    condicion: z.enum(["", ...PRODUCTO_ESTADOS]).default(""),
    min: price,
    max: price,
    orden: z
      .enum(["recientes", "precio-asc", "precio-desc"])
      .default("recientes"),
    page: z.coerce.number().int().min(1).max(100000).default(1),
    limit: z.coerce.number().int().min(1).max(24).default(6),
  })
  .refine((v) => v.min === undefined || v.max === undefined || v.min <= v.max, {
    path: ["max"],
    message: "El máximo debe ser mayor o igual al mínimo.",
  });
const router = Router();
router.get("/avisos", validateQuery(query), c.list);
router.get("/avisos/:id", c.detail);
router.get("/metadata", c.metadata);
router.get("/usuarios/:id", c.publicUser);
export default router;
