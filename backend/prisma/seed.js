import "dotenv/config";
import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";
import seeds from "../../shared/seeds/demo.json" with { type: "json" };
import { getPrisma } from "../src/config/prisma.js";

if (!process.env.DATABASE_URL)
  throw new Error(
    "Configura DATABASE_URL para cargar semillas en una base de desarrollo.",
  );
if (process.env.NODE_ENV === "production")
  throw new Error("Las semillas de ejemplo no se cargan en producción.");
const db = getPrisma();
const hash = async () => {
  const salt = randomBytes(16).toString("hex");
  const key = await promisify(scrypt)(randomBytes(32), salt, 64);
  return `scrypt:${salt}:${key.toString("hex")}`;
};
try {
  const usuarios = await Promise.all(
    seeds.usuarios.map(async (u) => ({ ...u, contrasenaHash: await hash() })),
  );
  await db.$transaction(async (tx) => {
    for (const c of seeds.categorias)
      await tx.categoria.upsert({ where: { id: c.id }, create: c, update: c });
    for (const c of seeds.cursos)
      await tx.curso.upsert({ where: { id: c.id }, create: c, update: c });
    for (const u of usuarios) {
      const { contrasenaHash, ...perfil } = u;
      await tx.usuario.upsert({
        where: { id: u.id },
        create: u,
        update: perfil,
      });
    }
    for (const a of seeds.avisos) {
      const { fotografias, ...data } = a;
      await tx.aviso.upsert({
        where: { id: a.id },
        create: data,
        update: data,
      });
      for (const f of fotografias)
        await tx.fotografia.upsert({
          where: { id: f.id },
          create: f,
          update: f,
        });
    }
    for (const f of seeds.favoritos)
      await tx.favorito.upsert({
        where: {
          usuarioId_avisoId: { usuarioId: f.usuarioId, avisoId: f.avisoId },
        },
        create: f,
        update: {},
      });
    for (const o of seeds.ofertas) {
      const { movimientos, ...data } = o;
      await tx.oferta.upsert({
        where: { id: o.id },
        create: data,
        update: data,
      });
      for (const m of movimientos)
        await tx.movimientoOferta.upsert({
          where: { id: m.id },
          create: m,
          update: {},
        });
    }
    for (const a of seeds.acuerdos) {
      const { cambios, ...data } = a;
      await tx.acuerdo.upsert({
        where: { id: a.id },
        create: data,
        update: data,
      });
      for (const c of cambios)
        await tx.cambioAcuerdo.upsert({
          where: { id: c.id },
          create: c,
          update: {},
        });
    }
  });
  console.log(
    "Semillas de ejemplo cargadas. Las cuentas no tienen contraseñas de acceso conocidas.",
  );
} finally {
  await db.$disconnect();
}
