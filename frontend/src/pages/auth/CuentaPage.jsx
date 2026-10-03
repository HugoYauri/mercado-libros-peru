import { useSession } from "../../hooks/useSession.js";
import { StageNotice } from "../../components/shared/Ui.jsx";
export function CuentaPage() {
  const { user } = useSession();
  return (
    <div className="page-container narrow">
      <h1>Mi cuenta</h1>
      <StageNotice>
        Perfil de la cuenta ficticia seleccionada. La edición, cambio de
        contraseña y validaciones de servidor pertenecen a HU-1.
      </StageNotice>
      <div className="panel">
        <h2>
          {user.nombres} {user.apellidos}
        </h2>
        <dl className="data-list">
          <dt>Correo de ejemplo</dt>
          <dd>{user.correo}</dd>
          <dt>Carrera</dt>
          <dd>{user.carrera}</dd>
          <dt>Ciclo</dt>
          <dd>{user.ciclo}</dd>
          <dt>Punto preferido</dt>
          <dd>{user.puntoPreferido}</dd>
        </dl>
      </div>
    </div>
  );
}
