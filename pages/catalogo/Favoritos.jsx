import { useState } from 'react';
import {
  avisos,
  favoritos,
  alternarFavorito,
} from '../../assets/js/compartido/storage.js';
import Marco from '../compartido/Marco.jsx';
import TarjetaAviso from '../compartido/TarjetaAviso.jsx';
import '../../assets/css/catalogo.css';

function fechaPublicacion(fecha) {
  const valor = fecha.includes('/')
    ? (() => {
        const [dia, mes, anio] = fecha.split('/');
        return new Date(Number(anio), Number(mes) - 1, Number(dia)).getTime();
      })()
    : new Date(fecha).getTime();
  return Number.isNaN(valor) ? 0 : valor;
}

export default function Favoritos() {
  const [ids, setIds] = useState(favoritos);
  const [orden, setOrden] = useState('recientes');
  const porId = new Map(avisos().map((aviso) => [aviso.id, aviso]));
  const guardados = ids
    .map((id) => porId.get(id))
    .filter(
      (aviso) => aviso && ['Publicado', 'Vendido', 'Reservado'].includes(aviso.status),
    );

  if (orden === 'menor') guardados.sort((a, b) => a.price - b.price);
  if (orden === 'mayor') guardados.sort((a, b) => b.price - a.price);
  if (orden === 'recientes')
    guardados.sort((a, b) => fechaPublicacion(b.published) - fechaPublicacion(a.published));

  const vendidos = guardados.filter((aviso) => aviso.status === 'Vendido').length;

  function quitar(id) {
    alternarFavorito(id);
    setIds(favoritos());
  }

  return (
    <Marco
      catalogo
      sinTitulo
    >
      <div className="hu3-favoritos-cabecera">
        <div>
          <h1>Favoritos</h1>
          <p>
            {guardados.length} avisos guardados
            {vendidos > 0 && ` · ${vendidos} ${vendidos === 1 ? 'ya se vendió' : 'ya se vendieron'}`}
          </p>
        </div>
        {guardados.length > 0 && (
          <label>
            Ordenar por
            <select
              value={orden}
              onChange={(event) => setOrden(event.target.value)}
            >
              <option value="recientes">Guardados recientemente</option>
              <option value="menor">Menor precio</option>
              <option value="mayor">Mayor precio</option>
            </select>
          </label>
        )}
      </div>

      {guardados.length > 0 ? (
        <>
          <div className="hu3-rejilla-productos hu3-rejilla-favoritos">
            {guardados.map((aviso) => (
              <TarjetaAviso
                key={aviso.id}
                aviso={aviso}
                variant="hu3"
              >
                <button
                  type="button"
                  className="hu3-corazon hu3-corazon-activo"
                  aria-label="Quitar de favoritos"
                  onClick={() => quitar(aviso.id)}
                >
                  ♥
                </button>
              </TarjetaAviso>
            ))}
          </div>
        </>
      ) : (
        <section className="hu3-favoritos-vacio hu3-favoritos-vacio-total">
          <span
            className="hu3-vacio-icono"
            aria-hidden="true"
          >
            ♥
          </span>
          <h2>Aún no tienes favoritos</h2>
          <p>Toca el corazón en cualquier aviso para guardarlo y volver a él cuando quieras ofertar.</p>
          <a
            className="hu3-boton"
            href="/catalogo"
          >
            Explorar catálogo
          </a>
        </section>
      )}
    </Marco>
  );
}
