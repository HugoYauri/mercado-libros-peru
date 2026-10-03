import { Link } from "react-router-dom";
import { useService } from "../../hooks/useService.js";
import { useSession } from "../../hooks/useSession.js";
import {
  Badge,
  EmptyState,
  LoadState,
  StageNotice,
} from "../../components/shared/Ui.jsx";
import { dinero } from "../../../../shared/contracts/domain.js";
export function PublicacionesPage() {
  const { user } = useSession();
  const { result, loading, error } = useService("getMisPublicaciones", [
    user.id,
  ]);
  return (
    <div className="page-container">
      <div className="section-heading">
        <h1>Mis publicaciones</h1>
        <Link className="button" to="/publicaciones/nueva">
          Nuevo aviso
        </Link>
      </div>
      <StageNotice />
      <LoadState loading={loading} error={error} />
      {result?.length === 0 && (
        <EmptyState
          title="Todavía no publicas avisos"
          text="La creación de publicaciones se implementará en HU-2."
          to="/publicaciones/nueva"
          action="Ver ruta de nuevo aviso"
        />
      )}
      <div className="record-list">
        {result?.map((a) => (
          <article className="record panel" key={a.id}>
            <div>
              <Badge estado={a.estado} />
              <h2>{a.titulo}</h2>
              <strong>{dinero(a.precioPedido)}</strong>
            </div>
            <Link to={`/publicaciones/${a.id}/editar`}>
              Ver ruta de edición →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
