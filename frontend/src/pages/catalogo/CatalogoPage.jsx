import { useSearchParams } from "react-router-dom";
import { useService } from "../../hooks/useService.js";
import { AvisoCard } from "../../components/shared/AvisoCard.jsx";
import { EmptyState, LoadState } from "../../components/shared/Ui.jsx";
import {
  LABELS,
  PRODUCTO_ESTADOS,
} from "../../../../shared/contracts/domain.js";
const filterLabels = {
  q: "Búsqueda",
  categoriaId: "Categoría",
  cursoId: "Curso",
  condicion: "Estado",
  min: "Mínimo S/",
  max: "Máximo S/",
};
export function CatalogoPage() {
  const [params, setParams] = useSearchParams();
  const filtros = Object.fromEntries(params);
  const { result, error, loading } = useService("getCatalogo", [filtros]);
  const metadata = useService("getMetadata");
  const set = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page");
    setParams(next);
  };
  const name = (key, value) =>
    key === "categoriaId"
      ? metadata.result?.categorias.find((c) => c.id === value)?.nombre || value
      : key === "cursoId"
        ? metadata.result?.cursos.find((c) => c.id === value)?.nombre || value
        : LABELS[value] || value;
  const active = Object.entries(filtros).filter(
    ([key, value]) => filterLabels[key] && value,
  );
  const invalidRange =
    filtros.min && filtros.max && Number(filtros.min) > Number(filtros.max);
  return (
    <div className="page-container">
      <div className="page-heading">
        <h1>Catálogo</h1>
        <p>Libros y materiales para tu próximo ciclo.</p>
      </div>
      <div className="catalog-layout">
        <aside className="filter-panel">
          <div className="section-heading">
            <h2>Filtros</h2>
            <button className="text-button" onClick={() => setParams({})}>
              Limpiar
            </button>
          </div>
          <label>
            Buscar en los avisos
            <input
              value={filtros.q || ""}
              maxLength={120}
              onChange={(e) => set("q", e.target.value)}
              placeholder="Título o descripción"
            />
          </label>
          <label>
            Categoría
            <select
              value={filtros.categoriaId || ""}
              onChange={(e) => set("categoriaId", e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {metadata.result?.categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </label>
          <label>
            Curso asociado
            <select
              value={filtros.cursoId || ""}
              onChange={(e) => set("cursoId", e.target.value)}
            >
              <option value="">Todos los cursos</option>
              {metadata.result?.cursos.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </label>
          <label>
            Estado del producto
            <select
              value={filtros.condicion || ""}
              onChange={(e) => set("condicion", e.target.value)}
            >
              <option value="">Cualquier estado</option>
              {PRODUCTO_ESTADOS.map((c) => (
                <option value={c} key={c}>
                  {LABELS[c]}
                </option>
              ))}
            </select>
          </label>
          <fieldset>
            <legend>Rango de precio</legend>
            <div className="price-inputs">
              <label>
                Mínimo S/
                <input
                  type="number"
                  min="0"
                  max="999999"
                  step="0.01"
                  value={filtros.min || ""}
                  onChange={(e) => set("min", e.target.value)}
                />
              </label>
              <label>
                Máximo S/
                <input
                  type="number"
                  min="0"
                  max="999999"
                  step="0.01"
                  value={filtros.max || ""}
                  onChange={(e) => set("max", e.target.value)}
                  aria-invalid={!!invalidRange}
                />
              </label>
            </div>
            {invalidRange && (
              <small className="field-error">
                El máximo debe ser mayor o igual al mínimo.
              </small>
            )}
          </fieldset>
          <LoadState error={metadata.error} />
        </aside>
        <section>
          <div className="active-filters">
            {active.map(([key, value]) => (
              <button
                className="chip"
                key={key}
                onClick={() => set(key, "")}
                aria-label={`Quitar ${filterLabels[key]} ${name(key, value)}`}
              >
                {filterLabels[key]}: {name(key, value)} ×
              </button>
            ))}
          </div>
          <div className="results-heading">
            <p aria-live="polite">
              {result ? (
                <>
                  <strong>{result.total}</strong> avisos encontrados
                </>
              ) : (
                "Consultando avisos…"
              )}
            </p>
            <label className="sort-label">
              Ordenar por
              <select
                value={filtros.orden || "recientes"}
                onChange={(e) => set("orden", e.target.value)}
              >
                <option value="recientes">Más recientes</option>
                <option value="precio-asc">Precio: menor a mayor</option>
                <option value="precio-desc">Precio: mayor a menor</option>
              </select>
            </label>
          </div>
          <LoadState loading={loading} error={error} />
          {result?.items.length === 0 ? (
            <EmptyState
              title="No encontramos avisos"
              text="Prueba otra búsqueda o elimina algunos filtros."
            />
          ) : (
            <div className="cards-grid">
              {result?.items.map((a) => (
                <AvisoCard key={a.id} aviso={a} />
              ))}
            </div>
          )}
          {result?.pages > 1 && (
            <nav className="pagination" aria-label="Páginas del catálogo">
              <button
                disabled={result.page <= 1}
                onClick={() => set("page", String(result.page - 1))}
              >
                ← Anterior
              </button>
              <span>
                Página {result.page} de {result.pages}
              </span>
              <button
                disabled={result.page >= result.pages}
                onClick={() => set("page", String(result.page + 1))}
              >
                Siguiente →
              </button>
            </nav>
          )}
        </section>
      </div>
    </div>
  );
}
