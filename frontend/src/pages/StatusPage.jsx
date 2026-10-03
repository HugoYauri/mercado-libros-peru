import { EmptyState } from "../components/shared/Ui.jsx";
export function StatusPage({ denied = false }) {
  return (
    <div className="page-container">
      <EmptyState
        title={denied ? "Acceso denegado" : "Página no encontrada"}
        text={
          denied
            ? "Tu cuenta no tiene permisos para esta vista."
            : "Revisa la dirección o vuelve al catálogo."
        }
      />
    </div>
  );
}
