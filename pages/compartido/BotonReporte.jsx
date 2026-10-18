import { useState } from 'react';
import { usuarioActivo } from '../../assets/js/compartido/sesion.js';
import { reportar } from '../../assets/js/hu7/moderacion.js';
import { Modal } from './Marco.jsx';

export default function BotonReporte({ tipo, objetivo }) {
  const [abierto, setAbierto] = useState(false);
  const [error, setError] = useState('');
  const [enviado, setEnviado] = useState(false);
  function enviar(event) {
    event.preventDefault();
    const datos = new FormData(event.currentTarget);
    try {
      reportar(tipo, objetivo, datos.get('motivo'), datos.get('detalle'));
      setAbierto(false);
      setEnviado(true);
    } catch (problema) {
      setError(problema.message);
    }
  }
  return (
    <>
      {enviado ? (
        <p
          role="status"
          className="neg-exito"
        >
          Reporte enviado a moderación.
        </p>
      ) : (
        <button
          className="neg-secundario"
          onClick={() => {
            if (!usuarioActivo()) {
              location.assign(
                '/ingresar?returnTo=' +
                  encodeURIComponent(location.pathname + location.search),
              );
              return;
            }
            setError('');
            setAbierto(true);
          }}
        >
          Reportar {tipo.toLowerCase()}
        </button>
      )}
      {abierto && (
        <Modal
          titulo={'Reportar ' + tipo.toLowerCase()}
          cerrar={() => setAbierto(false)}
        >
          <form onSubmit={enviar}>
            <label>
              Motivo
              <select
                name="motivo"
                required
              >
                <option value="">Selecciona</option>
                {[
                  'Información incorrecta',
                  'Contenido inapropiado',
                  'Incumplimiento de acuerdo',
                  'Otro motivo',
                ].map((valor) => (
                  <option key={valor}>{valor}</option>
                ))}
              </select>
            </label>
            <label>
              Detalle
              <textarea
                name="detalle"
                required
                minLength={10}
                maxLength={500}
                rows={4}
              />
            </label>
            {error && (
              <p
                role="alert"
                className="neg-error"
              >
                {error}
              </p>
            )}
            <div className="neg-acciones">
              <button className="neg-boton">Enviar reporte</button>
              <button
                className="neg-secundario"
                type="button"
                onClick={() => setAbierto(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
