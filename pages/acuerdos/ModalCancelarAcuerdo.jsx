import { useState } from 'react';
import { Modal } from '../compartido/Marco.jsx';
import { referenciaAcuerdo } from './ComponentesAcuerdo.jsx';

const motivos = [
  ['asistencia', 'Ya no puedo asistir al encuentro'],
  ['respuesta', 'La contraparte no responde'],
  ['producto', 'El producto ya no está disponible'],
  ['horario', 'No llegamos a un acuerdo de horario'],
  ['otro', 'Otro motivo'],
];

export default function ModalCancelarAcuerdo({
  acuerdo,
  cerrar,
  confirmar,
  error,
  guardando,
}) {
  const [motivo, setMotivo] = useState('');
  const [comentario, setComentario] = useState('');
  const visibles = motivo
    ? motivos
    : motivos.filter(([valor]) => ['asistencia', 'respuesta', 'otro'].includes(valor));

  function enviar(event) {
    event.preventDefault();
    const seleccionado = motivos.find(([valor]) => valor === motivo);
    if (!seleccionado) return;
    const detalle = comentario.trim() ? `. ${comentario.trim()}` : '';
    confirmar(seleccionado[1] + detalle);
  }

  return (
    <Modal
      className={
        'hu5-modal hu5-modal-cancelar' + (!motivo ? ' hu5-modal-sin-motivo' : '')
      }
      titulo={
        <>
          <span
            className="hu5-icono-alerta"
            aria-hidden="true"
          >
            !
          </span>
          Cancelar el acuerdo {referenciaAcuerdo(acuerdo.id)}
        </>
      }
      cerrar={cerrar}
    >
      <p className="hu5-ayuda">
        El motivo quedará registrado en el acuerdo. Revisa tu decisión antes de confirmar.
      </p>
      <div className={'hu5-alerta ' + (motivo ? 'hu5-alerta-ambar' : 'hu5-alerta-roja')}>
        {motivo ? (
          <>
            <strong>El aviso volverá al estado publicado</strong> si continúa reservado
            por este acuerdo y podrá recibir ofertas nuevamente.
          </>
        ) : (
          'Selecciona un motivo para poder cancelar el acuerdo.'
        )}
      </div>
      <form onSubmit={enviar}>
        <fieldset
          className="hu5-motivos"
          disabled={guardando}
        >
          <legend className="hu5-etiqueta">
            Motivo de la cancelación <span aria-hidden="true">*</span>
          </legend>
          {visibles.map(([valor, texto]) => (
            <label
              key={valor}
              className={motivo === valor ? 'hu5-opcion hu5-opcion-activa' : 'hu5-opcion'}
            >
              <input
                type="radio"
                name="motivo"
                value={valor}
                checked={motivo === valor}
                onChange={() => setMotivo(valor)}
                required
              />
              <span>{texto}</span>
            </label>
          ))}
        </fieldset>
        {motivo && (
          <label className="hu5-campo">
            <span className="hu5-etiqueta">
              Comentario para la contraparte (opcional)
            </span>
            <textarea
              rows={3}
              maxLength={200}
              placeholder="Cuéntale brevemente qué pasó…"
              value={comentario}
              onChange={(event) => setComentario(event.target.value)}
              disabled={guardando}
            />
            <span className="hu5-ayuda">{comentario.length}/200 caracteres</span>
          </label>
        )}
        {error && (
          <p
            className="hu5-alerta hu5-alerta-roja"
            role="alert"
          >
            {error}
          </p>
        )}
        <div className="hu5-modal-acciones">
          <button
            type="button"
            className="hu5-enlace"
            onClick={cerrar}
            disabled={guardando}
          >
            Volver
          </button>
          <button
            className="hu5-boton hu5-boton-destructivo"
            disabled={!motivo || guardando}
          >
            {guardando ? 'Cancelando…' : 'Cancelar el acuerdo'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
