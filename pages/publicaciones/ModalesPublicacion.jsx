import { useState } from 'react';
import { Modal } from '../compartido/Marco.jsx';

export default function ModalesPublicacion({
  seleccion,
  ofertas,
  error,
  cerrar,
  confirmar,
}) {
  const [confirmacion, setConfirmacion] = useState('');
  const [estado, setEstado] = useState(seleccion.estado);
  const eliminando = seleccion.estado === 'Eliminado';

  return (
    <Modal
      titulo={
        eliminando ? (
          <>
            <span
              className="hu2-icono-eliminar"
              aria-hidden="true"
            >
              !
            </span>
            Eliminar aviso
          </>
        ) : (
          'Cambiar el estado del aviso'
        )
      }
      cerrar={cerrar}
      className={'hu2-modal' + (eliminando ? ' hu2-modal-eliminar' : '')}
    >
      <p className="hu2-ayuda">
        {eliminando
          ? `Vas a eliminar «${seleccion.titulo}». El aviso dejará de mostrarse.`
          : `«${seleccion.titulo}» dejará de aparecer en el catálogo si lo pausas.`}
      </p>
      {!eliminando && (
        <fieldset className="hu2-estados-modal">
          <legend className="hu2-solo-lectores">Nuevo estado del aviso</legend>
          {[
            ['Pausado', 'Pausar temporalmente'],
            ['Publicado', 'Reactivar y volver a publicar'],
          ].map(([valor, etiqueta]) => (
            <label
              key={valor}
              className={estado === valor ? 'hu2-opcion-activa' : ''}
            >
              <input
                type="radio"
                name="nuevo-estado"
                value={valor}
                checked={estado === valor}
                onChange={() => setEstado(valor)}
              />
              {etiqueta}
            </label>
          ))}
          <label className="hu2-opcion-pendiente">
            <input
              type="radio"
              name="nuevo-estado"
              disabled
            />
            Marcar como vendido <small>Próximamente</small>
          </label>
        </fieldset>
      )}
      {ofertas > 0 && (eliminando || estado === 'Pausado') && (
        <p
          className={
            eliminando ? 'hu2-alerta hu2-alerta-error' : 'hu2-alerta hu2-alerta-atencion'
          }
        >
          <strong>
            {eliminando
              ? `El aviso tiene ${ofertas} oferta(s) pendiente(s).`
              : 'Atención.'}
          </strong>{' '}
          Las ofertas pendientes quedarán cerradas al confirmar.
        </p>
      )}
      {eliminando && (
        <label className="hu2-confirmacion">
          <span className="hu2-etiqueta">Escribe ELIMINAR para confirmar</span>
          <input
            value={confirmacion}
            onChange={(event) => setConfirmacion(event.target.value)}
            placeholder="ELIMINAR"
            autoComplete="off"
          />
        </label>
      )}
      {error && (
        <p
          className="hu2-alerta hu2-alerta-error"
          role="alert"
        >
          {error}
        </p>
      )}
      <div className="hu2-modal-acciones">
        <button
          type="button"
          className="hu2-enlace"
          onClick={cerrar}
        >
          Cancelar
        </button>
        <button
          type="button"
          className={eliminando ? 'hu2-boton hu2-destructivo' : 'hu2-boton'}
          disabled={eliminando && confirmacion !== 'ELIMINAR'}
          onClick={() => confirmar(eliminando ? 'Eliminado' : estado)}
        >
          {eliminando ? 'Eliminar aviso' : 'Confirmar cambio'}
        </button>
      </div>
    </Modal>
  );
}
