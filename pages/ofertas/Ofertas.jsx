import { useState } from 'react';
import { usuarioActivo } from '../../assets/js/compartido/sesion.js';
import Marco, { dinero, useNegociaciones } from '../compartido/Marco.jsx';

export default function Ofertas() {
  const [vista, setVista] = useState('recibidas');
  const [estado, setEstado] = useState('Todas');
  const { ofertas } = useNegociaciones();
  const correo = usuarioActivo().correo;
  const visibles = ofertas.filter((oferta) => {
    const propia =
      vista === 'recibidas' ? oferta.vendedor === correo : oferta.comprador === correo;
    return propia && (estado === 'Todas' || oferta.estado === estado);
  });

  return (
    <Marco
      titulo="Ofertas"
      descripcion="Revisa tus propuestas y responde a los estudiantes interesados en tus publicaciones."
    >
      <div className="neg-fila">
        <div
          className="neg-acciones"
          aria-label="Tipo de ofertas"
        >
          {['recibidas', 'enviadas'].map((tipo) => (
            <button
              key={tipo}
              aria-pressed={vista === tipo}
              className={vista === tipo ? 'neg-boton' : 'neg-secundario'}
              onClick={() => setVista(tipo)}
            >
              {tipo === 'recibidas' ? 'Recibidas' : 'Enviadas'}
            </button>
          ))}
        </div>
        <label>
          Estado
          <select
            value={estado}
            onChange={(event) => setEstado(event.target.value)}
          >
            {['Todas', 'Pendiente', 'Aceptada', 'Rechazada', 'Retirada', 'Cerrada'].map(
              (valor) => (
                <option key={valor}>{valor}</option>
              ),
            )}
          </select>
        </label>
      </div>

      {visibles.length === 0 && (
        <section className="neg-tarjeta neg-vacio">
          <h2>No tienes ofertas {vista} con este filtro</h2>
          <p className="neg-ayuda">
            Cuando haya propuestas, podrás seguir la negociación desde aquí.
          </p>
          <a
            className="neg-boton"
            href="/catalogo"
          >
            Explorar catálogo
          </a>
        </section>
      )}

      {visibles.map((oferta) => (
        <article
          key={oferta.id}
          className="neg-tarjeta"
        >
          <div className="neg-fila">
            <h2>{oferta.titulo}</h2>
            <span className="neg-estado">{oferta.estado}</span>
          </div>
          <p className="neg-precio">{dinero(oferta.monto)}</p>
          <p>{vista === 'recibidas' ? oferta.comprador : oferta.vendedor}</p>
          {oferta.estado === 'Pendiente' && (
            <p className="neg-ayuda">
              {oferta.turno === correo
                ? 'Te toca responder.'
                : 'Esperando respuesta de la otra persona.'}
            </p>
          )}
          <a
            className="neg-secundario"
            href={`/ofertas/${oferta.id}`}
          >
            Ver negociación
          </a>
        </article>
      ))}
    </Marco>
  );
}
