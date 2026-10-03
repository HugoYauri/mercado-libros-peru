import { useService } from "../../hooks/useService.js";
import { useSession } from "../../hooks/useSession.js";
import { AvisoCard } from "../../components/shared/AvisoCard.jsx";
import {
  EmptyState,
  LoadState,
  StageNotice,
} from "../../components/shared/Ui.jsx";
export function FavoritosPage() {
  const { user } = useSession();
  const { result, loading, error } = useService("getFavoritos", [user.id]);
  return (
    <div className="page-container">
      <h1>Mis favoritos</h1>
      <StageNotice>
        Favoritos de demostración guardados en este navegador. Puedes quitarlos
        desde el detalle del aviso. Los avisos vendidos conservan su etiqueta.
      </StageNotice>
      <LoadState loading={loading} error={error} />
      {result?.length === 0 && (
        <EmptyState
          title="Aún no guardas favoritos"
          text="Explora el catálogo y guarda los avisos que te interesen."
        />
      )}
      <div className="cards-grid">
        {result?.map((a) => (
          <AvisoCard aviso={a} key={a.id} />
        ))}
      </div>
    </div>
  );
}
