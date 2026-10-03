import { Link, useParams } from "react-router-dom";
import { useService } from "../../hooks/useService.js";
import { useSession } from "../../hooks/useSession.js";
import {
  Badge,
  EmptyState,
  LoadState,
  StageNotice,
} from "../../components/shared/Ui.jsx";
import { dinero } from "../../../../shared/contracts/domain.js";
export function OfertasPage({ tipo = "enviadas", detail = false }) {
  const { user } = useSession();
  const { ofertaId } = useParams();
  const { result, loading, error } = useService(
    detail ? "getOferta" : "getOfertas",
    [user.id, detail ? ofertaId : tipo],
  );
  const items = detail ? (result ? [result] : []) : result;
  return (
    <div className="page-container">
      <h1>{detail ? "Historial de negociación" : `Ofertas ${tipo}`}</h1>
      <div className="tabs">
        <Link to="/ofertas/enviadas">Enviadas</Link>
        <Link to="/ofertas/recibidas">Recibidas</Link>
      </div>
      <StageNotice />
      <LoadState loading={loading} error={error} />
      {items?.length === 0 && !loading && !error && (
        <EmptyState
          title="No tienes ofertas"
          text="El envío y las respuestas se implementarán en HU-4."
        />
      )}
      <div className="record-list">
        {items?.map((o) => (
          <article className="panel record" key={o.id}>
            <div>
              <Badge estado={o.estado} />
              <h2>Oferta · {o.avisoId}</h2>
              <p className="price">{dinero(o.montoActual)}</p>
              {detail && (
                <ol className="timeline">
                  {o.movimientos.map((m) => (
                    <li key={m.id}>
                      <strong>
                        {m.accion.toLowerCase()} · {m.actorId}
                      </strong>
                      <p>
                        {m.monto ? dinero(m.monto) : ""} ·{" "}
                        {new Date(m.creadoEn).toLocaleDateString("es-PE")}
                      </p>
                    </li>
                  ))}
                </ol>
              )}
            </div>
            {!detail && <Link to={`/ofertas/${o.id}`}>Ver negociación →</Link>}
          </article>
        ))}
      </div>
    </div>
  );
}
