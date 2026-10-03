import { catalogoRepository } from "../repositories/catalogo.repository.js";
import { HttpError } from "../middleware/errors.js";
export const catalogoService = {
  list: (filtros) => catalogoRepository.list(filtros),
  metadata: () => catalogoRepository.metadata(),
  async detail(id) {
    const a = await catalogoRepository.find(id);
    // Borradores y pausados no se revelan a visitantes.
    if (!a || !["PUBLICADO", "VENDIDO"].includes(a.estado))
      throw new HttpError(404, "Aviso no disponible.", "NOT_FOUND");
    return a;
  },
  async publicUser(id) {
    const u = await catalogoRepository.publicUser(id);
    if (!u) throw new HttpError(404, "Usuario no disponible.", "NOT_FOUND");
    return u;
  },
};
