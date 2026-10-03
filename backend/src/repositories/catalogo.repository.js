import seeds from "../../../shared/seeds/demo.json" with { type: "json" };
import {
  consultarCatalogo,
  perfilPublico,
} from "../../../shared/contracts/domain.js";
import { env } from "../config/env.js";
import { getPrisma } from "../config/prisma.js";

function dto(a) {
  return {
    ...a,
    precioPedido: a.precioPedido.toString(),
    precioMinimo: a.precioMinimo?.toString() ?? null,
    publicadoEn: a.publicadoEn?.toISOString() ?? null,
    creadoEn: a.creadoEn.toISOString(),
    actualizadoEn: a.actualizadoEn.toISOString(),
  };
}
export const catalogoRepository = {
  async list(filtros) {
    if (env.dataSource === "seed")
      return consultarCatalogo(seeds.avisos, filtros);
    const { q, categoriaId, cursoId, condicion, min, max, orden, page, limit } =
      filtros;
    const where = {
      estado: "PUBLICADO",
      ...(q
        ? {
            OR: [
              { titulo: { contains: q, mode: "insensitive" } },
              { descripcion: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(categoriaId ? { categoriaId } : {}),
      ...(cursoId ? { cursoId } : {}),
      ...(condicion ? { condicion } : {}),
      ...(min !== undefined || max !== undefined
        ? {
            precioPedido: {
              ...(min !== undefined ? { gte: min } : {}),
              ...(max !== undefined ? { lte: max } : {}),
            },
          }
        : {}),
    };
    const db = getPrisma();
    const [items, total] = await db.$transaction([
      db.aviso.findMany({
        where,
        orderBy:
          orden === "precio-asc"
            ? [{ precioPedido: "asc" }, { id: "asc" }]
            : orden === "precio-desc"
              ? [{ precioPedido: "desc" }, { id: "asc" }]
              : [{ publicadoEn: "desc" }, { id: "asc" }],
        skip: (page - 1) * limit,
        take: limit,
        include: { fotografias: { orderBy: { orden: "asc" } } },
      }),
      db.aviso.count({ where }),
    ]);
    return {
      items: items.map(dto),
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  },
  async find(id) {
    if (env.dataSource === "seed")
      return seeds.avisos.find((a) => a.id === id) ?? null;
    const row = await getPrisma().aviso.findUnique({
      where: { id },
      include: { fotografias: { orderBy: { orden: "asc" } } },
    });
    return row ? dto(row) : null;
  },
  async metadata() {
    if (env.dataSource === "seed")
      return { categorias: seeds.categorias, cursos: seeds.cursos };
    const [categorias, cursos] = await Promise.all([
      getPrisma().categoria.findMany(),
      getPrisma().curso.findMany(),
    ]);
    return { categorias, cursos };
  },
  async publicUser(id) {
    if (env.dataSource === "seed") {
      const u = seeds.usuarios.find((u) => u.id === id);
      return u ? perfilPublico(u) : null;
    }
    const u = await getPrisma().usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nombres: true,
        apellidos: true,
        carrera: true,
        ciclo: true,
        creadoEn: true,
        estado: true,
      },
    });
    return u?.estado === "ACTIVO" ? perfilPublico(u) : null;
  },
};
