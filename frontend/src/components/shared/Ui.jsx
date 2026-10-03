import { Link } from "react-router-dom";
import { LABELS } from "../../../../shared/contracts/domain.js";
export function Badge({ estado }) {
  return (
    <span className={`badge state-${estado?.toLowerCase()}`}>
      {LABELS[estado] || estado}
    </span>
  );
}
export function EmptyState({
  title = "Todavía no hay datos",
  text,
  to = "/catalogo",
  action = "Explorar catálogo",
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon" aria-hidden="true">
        ▤
      </span>
      <h2>{title}</h2>
      <p>{text}</p>
      <Link className="button" to={to}>
        {action}
      </Link>
    </div>
  );
}
export function LoadState({ loading, error }) {
  if (error)
    return (
      <div className="notice error" role="alert">
        {error}
      </div>
    );
  if (loading)
    return (
      <p className="notice" role="status">
        Cargando datos…
      </p>
    );
  return null;
}
export function StageNotice({ children }) {
  return (
    <div className="notice info">
      {children ||
        "Pantalla inicial con datos ficticios. Las acciones de esta historia todavía no están implementadas."}
    </div>
  );
}
export function PhotoPlaceholder({ title, compact = false }) {
  return (
    <div
      className={`photo-placeholder ${compact ? "compact" : ""}`}
      role="img"
      aria-label={`Fotografía pendiente: ${title}`}
    >
      <span aria-hidden="true">▤</span>
      <small>Fotografía de ejemplo pendiente</small>
    </div>
  );
}
