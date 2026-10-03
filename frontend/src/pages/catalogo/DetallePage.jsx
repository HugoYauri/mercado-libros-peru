import { useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { useService } from "../../hooks/useService.js";
import { useSession } from "../../hooks/useSession.js";
import { services } from "../../services/index.js";
import {
  Badge,
  LoadState,
  PhotoPlaceholder,
} from "../../components/shared/Ui.jsx";
import { ConfirmDialog } from "../../components/shared/ConfirmDialog.jsx";
import { dinero, LABELS } from "../../../../shared/contracts/domain.js";
export function DetallePage() {
  const { avisoId } = useParams();
  const { result: a, loading, error } = useService("getAviso", [avisoId]);
  const { user } = useSession();
  const location = useLocation();
  const [message, setMessage] = useState(null);
  const favoritos = useService("getFavoritos", [user?.id]);
  const [favoriteOverride, setFavoriteOverride] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const saved =
    favoriteOverride?.avisoId === avisoId
      ? favoriteOverride.saved
      : !!favoritos.result?.some((a) => a.id === avisoId);
  const guardar = async () => {
    setConfirmOpen(false);
    try {
      const r = await services.toggleFavorito(user.id, avisoId);
      setFavoriteOverride({ avisoId, saved: r.saved });
      setMessage({
        text: r.saved
          ? "Guardado en tus favoritos de demostración."
          : "Quitado de tus favoritos de demostración.",
        error: false,
      });
    } catch (e) {
      setMessage({ text: e.message, error: true });
    }
  };
  return (
    <div className="page-container">
      <p className="breadcrumb">
        <Link to="/catalogo">Catálogo</Link> / Detalle del aviso
      </p>
      <LoadState loading={loading} error={error} />
      {a && (
        <div className="detail-layout">
          <section>
            <PhotoPlaceholder title={a.titulo} />
            <div className="panel">
              <h2>Descripción</h2>
              <p>{a.descripcion}</p>
              <p>
                <strong>Estado del producto:</strong> {LABELS[a.condicion]}
              </p>
              <p>
                <strong>Publicado:</strong>{" "}
                {a.publicadoEn
                  ? new Date(a.publicadoEn).toLocaleDateString("es-PE")
                  : "Pendiente"}
              </p>
            </div>
          </section>
          <aside className="panel detail-summary">
            <Badge estado={a.estado} />
            <h1>{a.titulo}</h1>
            <strong className="detail-price">{dinero(a.precioPedido)}</strong>
            {a.aceptaOfertas && (
              <p>
                Acepta ofertas{" "}
                {a.precioMinimo ? `desde ${dinero(a.precioMinimo)}` : ""}
              </p>
            )}
            {a.estado === "VENDIDO" ? (
              <div className="notice">Este aviso ya fue vendido.</div>
            ) : user ? (
              <div className="notice info">
                El envío de ofertas se implementará en HU-4.
              </div>
            ) : (
              <>
                <p>
                  Inicia sesión para guardar favoritos y revisar las pantallas
                  de negociación.
                </p>
                <Link
                  className="button full"
                  to="/login"
                  state={{ from: location }}
                >
                  Ingresar para ofertar
                </Link>
              </>
            )}
            {user ? (
              <button
                className="button secondary full"
                disabled={favoritos.loading}
                onClick={() => (saved ? setConfirmOpen(true) : guardar())}
              >
                {saved ? "Quitar de favoritos" : "Guardar en favoritos"}
              </button>
            ) : (
              <Link
                className="button secondary full"
                to="/login"
                state={{ from: location }}
              >
                Guardar en favoritos
              </Link>
            )}
            {message && (
              <div
                className={`notice ${message.error ? "error" : "success"}`}
                role="status"
              >
                {message.text}
              </div>
            )}
            <hr />
            <p className="eyebrow">VENDEDOR</p>
            <Link to={`/usuarios/${a.vendedorId}`}>Ver perfil público →</Link>
          </aside>
        </div>
      )}
      <ConfirmDialog
        open={confirmOpen}
        title="Quitar de favoritos"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={guardar}
      >
        ¿Quieres quitar este aviso de tus favoritos de demostración?
      </ConfirmDialog>
    </div>
  );
}
