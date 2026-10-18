import { useState } from 'react';
import { usuarioActivo, perfilPublico } from '../../assets/js/compartido/sesion.js';
import { calificaciones, calificar, reputacion } from '../../assets/js/hu6/reputacion.js';
import { esParticipante } from '../../assets/js/hu4/ofertas.js';
import Marco, { Modal, useNegociaciones, fechaLegible } from '../compartido/Marco.jsx';

export default function Calificaciones() {
  const correo = usuarioActivo().correo;
  const { acuerdos } = useNegociaciones();
  const [vista, setVista] = useState('Pendientes');
  const [acuerdoId, setAcuerdoId] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const lista = calificaciones();
  const { promedio, recibidas } = reputacion(correo);
  const pendientes = acuerdos.filter(
    (item) =>
      item.estado === 'Cerrado' &&
      esParticipante(item, correo) &&
      !lista.some((resena) => resena.acuerdoId === item.id && resena.autor === correo),
  );
  const resenas = lista.filter((item) =>
    vista === 'Recibidas' ? item.destinatario === correo : item.autor === correo,
  );
  function enviar(event) {
    event.preventDefault();
    const datos = new FormData(event.currentTarget);
    try {
      calificar(acuerdoId, datos.get('puntaje'), datos.get('comentario'));
      setAcuerdoId('');
      setError('');
      setMensaje('Tu calificación quedó registrada.');
    } catch (problema) {
      setError(problema.message);
    }
  }
  return (
    <Marco
      titulo="Mis calificaciones"
      descripcion="Valora tu experiencia después de completar un acuerdo de entrega."
    >
      <section className="neg-tarjeta">
        <h2>Tu reputación</h2>
        <p className="neg-precio">
          {recibidas.length ? promedio.toFixed(1) + ' ★' : 'Sin calificaciones'}
        </p>
        <p>{recibidas.length} opiniones recibidas</p>
      </section>
      <div className="neg-acciones">
        {['Pendientes', 'Recibidas', 'Enviadas'].map((valor) => (
          <button
            key={valor}
            aria-pressed={vista === valor}
            className={vista === valor ? 'neg-boton' : 'neg-secundario'}
            onClick={() => setVista(valor)}
          >
            {valor}
          </button>
        ))}
      </div>
      {mensaje && (
        <p
          className="neg-exito"
          role="status"
        >
          {mensaje}
        </p>
      )}
      {vista === 'Pendientes' ? (
        pendientes.length ? (
          pendientes.map((acuerdo) => (
            <article
              className="neg-tarjeta"
              key={acuerdo.id}
            >
              <h2>{acuerdo.titulo}</h2>
              <p className="neg-ayuda">
                Entrega completada. Ya puedes calificar a la otra persona.
              </p>
              <button
                className="neg-boton"
                onClick={() => {
                  setError('');
                  setAcuerdoId(acuerdo.id);
                }}
              >
                Calificar a la contraparte
              </button>
            </article>
          ))
        ) : (
          <p className="neg-tarjeta">No tienes acuerdos pendientes de calificación.</p>
        )
      ) : resenas.length ? (
        resenas.map((resena) => (
          <article
            key={resena.id}
            className="neg-tarjeta"
          >
            <h2>
              {'★'.repeat(resena.puntaje)} · {resena.puntaje}/5
            </h2>
            <p>
              {vista === 'Recibidas'
                ? 'De: ' + (perfilPublico(resena.autor)?.nombres || resena.autor)
                : 'Para: ' +
                  (perfilPublico(resena.destinatario)?.nombres || resena.destinatario)}
            </p>
            <p className="my-3">{resena.comentario || 'Sin comentario adicional.'}</p>
            <time>{fechaLegible(resena.fecha)}</time>
          </article>
        ))
      ) : (
        <p className="neg-tarjeta">Todavía no hay calificaciones en esta sección.</p>
      )}
      {acuerdoId && (
        <Modal
          titulo="Calificar a la contraparte"
          cerrar={() => setAcuerdoId('')}
        >
          <form onSubmit={enviar}>
            <label>
              Puntaje
              <select
                name="puntaje"
                required
                defaultValue=""
              >
                <option value="">Selecciona estrellas</option>
                {[5, 4, 3, 2, 1].map((valor) => (
                  <option
                    key={valor}
                    value={valor}
                  >
                    {valor} {'★'.repeat(valor)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Comentario opcional
              <textarea
                name="comentario"
                rows={4}
                maxLength={300}
              />
            </label>
            <p className="neg-ayuda">Solo puedes enviar una calificación por acuerdo.</p>
            {error && (
              <p
                className="neg-error"
                role="alert"
              >
                {error}
              </p>
            )}
            <div className="neg-acciones">
              <button className="neg-boton">Enviar calificación</button>
              <button
                type="button"
                className="neg-secundario"
                onClick={() => setAcuerdoId('')}
              >
                Cancelar
              </button>
            </div>
          </form>
        </Modal>
      )}
    </Marco>
  );
}
