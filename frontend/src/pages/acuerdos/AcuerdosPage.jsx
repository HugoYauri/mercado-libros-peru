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
export function AcuerdosPage({ detail = false }) {
  const { user } = useSession();
  const { acuerdoId } = useParams();
  const { result, loading, error } = useService(
    detail ? "getAcuerdo" : "getAcuerdos",
    [user.id, ...(detail ? [acuerdoId] : [])],
  );
  const items = detail ? (result ? [result] : []) : result;
  return (
    <div className="page-container">
      <h1>{detail ? "Detalle del acuerdo" : "Mis acuerdos"}</h1>
      <StageNotice />
      <LoadState loading={loading} error={error} />
      {items?.length === 0 && !loading && !error && (
        <EmptyState
          title="Aún no tienes acuerdos"
          text="Al aceptar una oferta, se generará un acuerdo de entrega."
        />
      )}
      <div className="record-list">
        {items?.map((a) => (
          <article className="panel record" key={a.id}>
            <div>
              <Badge estado={a.estado} />
              <h2>Acuerdo · {a.id}</h2>
              <p>
                {a.punto} · {dinero(a.montoPactado)}
              </p>
              {detail && (
                <>
                  <p>
                    Entrega del comprador:{" "}
                    {a.entregaCompradorEn ? "Confirmada" : "Pendiente"}
                  </p>
                  <p>
                    Entrega del vendedor:{" "}
                    {a.entregaVendedorEn ? "Confirmada" : "Pendiente"}
                  </p>
                  <p className="notice">
                    El aviso solo pasa a vendido cuando ambas partes confirman
                    la entrega.
                  </p>
                  <ol className="timeline">
                    {a.cambios.map((c) => (
                      <li key={c.id}>
                        {c.accion.toLowerCase()} · {c.actorId} ·{" "}
                        {new Date(c.creadoEn).toLocaleDateString("es-PE")}
                      </li>
                    ))}
                  </ol>
                </>
              )}
            </div>
            {!detail && (
              <Link to={`/acuerdos/${a.id}`}>Ver trazabilidad →</Link>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
