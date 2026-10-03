import { catalogoService } from "../services/catalogo.service.js";
export const catalogoController = {
  async list(req, res) {
    res.json(await catalogoService.list(req.validatedQuery));
  },
  async detail(req, res) {
    res.json(await catalogoService.detail(req.params.id));
  },
  async metadata(_req, res) {
    res.json(await catalogoService.metadata());
  },
  async publicUser(req, res) {
    res.json(await catalogoService.publicUser(req.params.id));
  },
};
