import { useState } from 'react';
import {
  avisos,
  favoritos,
  alternarFavorito,
} from '../../assets/js/compartido/storage.js';
import Marco from '../compartido/Marco.jsx';
import TarjetaAviso from '../compartido/TarjetaAviso.jsx';

export default function Favoritos() {
  const [ids, setIds] = useState(favoritos);
  const guardados = avisos().filter(
    (aviso) =>
      ids.includes(aviso.id) &&
      ['Publicado', 'Vendido', 'Reservado'].includes(aviso.status),
  );
  return (
    <Marco
      titulo="Favoritos"
      descripcion="Tus avisos guardados para revisar después."
    >
      {!guardados.length && (
        <section className="neg-tarjeta neg-vacio">
          <h2>No tienes favoritos disponibles</h2>
          <p className="neg-ayuda">
            Guarda los productos que te interesen desde el catálogo.
          </p>
          <a
            href="/catalogo"
            className="neg-boton"
          >
            Explorar catálogo
          </a>
        </section>
      )}
      <div className="rejilla-productos">
        {guardados.map((aviso) => (
          <TarjetaAviso
            key={aviso.id}
            aviso={aviso}
          >
            <button
              className="neg-secundario"
              onClick={() => {
                alternarFavorito(aviso.id);
                setIds(favoritos());
              }}
            >
              Quitar de favoritos
            </button>
          </TarjetaAviso>
        ))}
      </div>
    </Marco>
  );
}
