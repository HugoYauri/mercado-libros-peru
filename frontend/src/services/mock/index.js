import seeds from "../../../../shared/seeds/demo.json";
import {
  consultarCatalogo,
  perfilPublico,
} from "../../../../shared/contracts/domain.js";
const sessionKey = "tablon-demo-session-v1";
const favoriteKey = (userId) => `tablon-demo-favoritos-v1:${userId}`;
const unavailable = () => {
  throw new Error("Esta operación se implementará en la siguiente etapa.");
};
function session() {
  try {
    return (
      seeds.usuarios.find((u) => u.id === sessionStorage.getItem(sessionKey)) ??
      null
    );
  } catch {
    return null;
  }
}
function favoriteIds(userId) {
  try {
    const raw = localStorage.getItem(favoriteKey(userId));
    if (raw) return JSON.parse(raw);
  } catch {
    /* Sin persistencia local se usan semillas. */
  }
  return seeds.favoritos
    .filter((f) => f.usuarioId === userId)
    .map((f) => f.avisoId);
}
export const mockServices = {
  getSession: session,
  async loginDemo(id) {
    const user = seeds.usuarios.find((u) => u.id === id);
    if (!user) throw new Error("Selecciona una cuenta de demostración.");
    sessionStorage.setItem(sessionKey, user.id);
    return user;
  },
  async logout() {
    sessionStorage.removeItem(sessionKey);
  },
  async getCatalogo(filtros) {
    return consultarCatalogo(seeds.avisos, filtros);
  },
  async getMetadata() {
    return { categorias: seeds.categorias, cursos: seeds.cursos };
  },
  async getAviso(id) {
    const a = seeds.avisos.find(
      (a) => a.id === id && ["PUBLICADO", "VENDIDO"].includes(a.estado),
    );
    if (!a) throw new Error("Aviso no disponible.");
    return a;
  },
  async getUsuario(id) {
    const u = seeds.usuarios.find((u) => u.id === id);
    if (!u) throw new Error("Usuario no disponible.");
    return perfilPublico(u);
  },
  async getFavoritos(userId) {
    return seeds.avisos.filter(
      (a) =>
        favoriteIds(userId).includes(a.id) &&
        ["PUBLICADO", "VENDIDO"].includes(a.estado),
    );
  },
  async toggleFavorito(userId, avisoId) {
    if (session()?.id !== userId)
      throw new Error("Inicia sesión de demostración.");
    const ids = favoriteIds(userId);
    const saved = !ids.includes(avisoId);
    const next = saved ? [...ids, avisoId] : ids.filter((id) => id !== avisoId);
    localStorage.setItem(favoriteKey(userId), JSON.stringify(next));
    return { saved };
  },
  async getMisPublicaciones(userId) {
    return seeds.avisos.filter((a) => a.vendedorId === userId);
  },
  async getOfertas(userId, tipo) {
    return seeds.ofertas.filter((o) =>
      tipo === "enviadas"
        ? o.compradorId === userId
        : seeds.avisos.find((a) => a.id === o.avisoId)?.vendedorId === userId,
    );
  },
  async getOferta(userId, id) {
    const o = seeds.ofertas.find((o) => o.id === id);
    if (
      !o ||
      (o.compradorId !== userId &&
        seeds.avisos.find((a) => a.id === o.avisoId)?.vendedorId !== userId)
    )
      throw new Error("No tienes acceso a esta oferta.");
    return o;
  },
  async getAcuerdos(userId) {
    return seeds.acuerdos.filter((a) =>
      [a.compradorId, a.vendedorId].includes(userId),
    );
  },
  async getAcuerdo(userId, id) {
    const a = seeds.acuerdos.find(
      (a) => a.id === id && [a.compradorId, a.vendedorId].includes(userId),
    );
    if (!a) throw new Error("No tienes acceso a este acuerdo.");
    return a;
  },
  registrar: unavailable,
  recuperarContrasena: unavailable,
  publicar: unavailable,
  enviarOferta: unavailable,
};
