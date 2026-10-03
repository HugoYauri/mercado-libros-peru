import { useParams } from "react-router-dom";
import { useService } from "../../hooks/useService.js";
import { LoadState } from "../../components/shared/Ui.jsx";
export function PerfilPage() {
  const { usuarioId } = useParams();
  const { result: u, loading, error } = useService("getUsuario", [usuarioId]);
  return (
    <div className="page-container narrow">
      <h1>Perfil público</h1>
      <LoadState loading={loading} error={error} />
      {u && (
        <div className="panel">
          <span className="avatar">
            {u.nombres[0]}
            {u.apellidos[0]}
          </span>
          <h2>
            {u.nombres} {u.apellidos}
          </h2>
          <p>
            {u.carrera} · ciclo {u.ciclo}
          </p>
          <p>
            Miembro desde {new Date(u.creadoEn).toLocaleDateString("es-PE")}
          </p>
          <p className="muted">
            El perfil público no muestra correo, teléfono ni datos de acceso.
          </p>
        </div>
      )}
    </div>
  );
}
