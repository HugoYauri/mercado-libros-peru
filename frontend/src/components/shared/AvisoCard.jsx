import { Link } from "react-router-dom";
import { Badge, PhotoPlaceholder } from "./Ui.jsx";
import { dinero, LABELS } from "../../../../shared/contracts/domain.js";
export function AvisoCard({ aviso }) {
  return (
    <article className="aviso-card">
      <Link to={`/catalogo/${aviso.id}`}>
        <PhotoPlaceholder title={aviso.titulo} compact />
        <div className="aviso-content">
          <Badge estado={aviso.estado} />
          <h3>{aviso.titulo}</h3>
          <strong className="price">{dinero(aviso.precioPedido)}</strong>
          <p>{LABELS[aviso.condicion]}</p>
        </div>
      </Link>
    </article>
  );
}
