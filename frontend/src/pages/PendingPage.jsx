import { Link } from "react-router-dom";
import { StageNotice } from "../components/shared/Ui.jsx";
export function PendingPage({ title, text, fields = [] }) {
  return (
    <div className="page-container narrow">
      <h1>{title}</h1>
      <StageNotice>
        Ruta preparada. Esta función todavía no está implementada.
      </StageNotice>
      <section className="panel">
        <h2>Alcance de la próxima implementación</h2>
        <p>{text}</p>
        {fields.length > 0 && (
          <ul className="planned-fields">
            {fields.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        )}
        <Link to="/catalogo" className="button secondary">
          Volver al catálogo
        </Link>
      </section>
    </div>
  );
}
