export const AVISO_ESTADOS = ["BORRADOR", "PUBLICADO", "PAUSADO", "VENDIDO"];
export const PRODUCTO_ESTADOS = [
  "COMO_NUEVO",
  "MUY_BUEN_ESTADO",
  "BUEN_ESTADO",
  "CON_MARCAS",
];
export const OFERTA_ESTADOS = [
  "ENVIADA",
  "CONTRAOFERTADA",
  "ACEPTADA",
  "RECHAZADA",
  "RETIRADA",
  "VENCIDA",
];
export const ACUERDO_ESTADOS = [
  "PENDIENTE",
  "PROPUESTO",
  "ACORDADO",
  "ENTREGADO",
  "CANCELADO",
];
export const LABELS = {
  BORRADOR: "Borrador",
  PUBLICADO: "Publicado",
  PAUSADO: "Pausado",
  VENDIDO: "Vendido",
  COMO_NUEVO: "Como nuevo",
  MUY_BUEN_ESTADO: "Muy buen estado",
  BUEN_ESTADO: "Buen estado",
  CON_MARCAS: "Con marcas de uso",
  ENVIADA: "Enviada",
  CONTRAOFERTADA: "Contraofertada",
  ACEPTADA: "Aceptada",
  RECHAZADA: "Rechazada",
  RETIRADA: "Retirada",
  VENCIDA: "Vencida",
  PENDIENTE: "Pendiente",
  PROPUESTO: "Propuesto",
  ACORDADO: "Acordado",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};
export const dinero = (valor) =>
  new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(
    Number(valor),
  );
export const perfilPublico = ({
  id,
  nombres,
  apellidos,
  carrera,
  ciclo,
  creadoEn,
}) => ({ id, nombres, apellidos, carrera, ciclo, creadoEn });

// Adaptadores mock y API usan el mismo contrato y comportamiento de lectura.
export function consultarCatalogo(avisos, filtros = {}) {
  const {
    q = "",
    categoriaId = "",
    cursoId = "",
    condicion = "",
    min = "",
    max = "",
    orden = "recientes",
  } = filtros;
  const page = Math.max(1, Math.trunc(Number(filtros.page) || 1));
  const limit = Math.min(
    24,
    Math.max(1, Math.trunc(Number(filtros.limit) || 6)),
  );
  const texto = q.trim().toLocaleLowerCase("es-PE");
  const filtrados = avisos.filter(
    (a) =>
      a.estado === "PUBLICADO" &&
      (!texto ||
        `${a.titulo} ${a.descripcion}`
          .toLocaleLowerCase("es-PE")
          .includes(texto)) &&
      (!categoriaId || a.categoriaId === categoriaId) &&
      (!cursoId || a.cursoId === cursoId) &&
      (!condicion || a.condicion === condicion) &&
      (min === "" || Number(a.precioPedido) >= Number(min)) &&
      (max === "" || Number(a.precioPedido) <= Number(max)),
  );
  filtrados.sort((a, b) =>
    orden === "precio-asc"
      ? Number(a.precioPedido) - Number(b.precioPedido)
      : orden === "precio-desc"
        ? Number(b.precioPedido) - Number(a.precioPedido)
        : new Date(b.publicadoEn) - new Date(a.publicadoEn) ||
          a.id.localeCompare(b.id),
  );
  return {
    items: filtrados.slice((page - 1) * limit, page * limit),
    total: filtrados.length,
    page,
    limit,
    pages: Math.ceil(filtrados.length / limit),
  };
}
