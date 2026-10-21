import { useState } from 'react';
import { enviarOferta, responderOferta } from '../../assets/js/hu4/ofertas.js';
import { dinero, Modal } from '../compartido/Marco.jsx';

const titulos = {
  nueva: 'Enviar una oferta',
  aceptar: 'Aceptar propuesta',
  contraofertar: 'Enviar contraoferta',
  rechazar: 'Rechazar propuesta',
  retirar: 'Retirar oferta',
};

export default function ModalOferta({
  aviso,
  oferta,
  modo,
  accion = 'nueva',
  cerrar,
  completar,
}) {
  const esNueva = modo ? modo === 'nueva' : !oferta;
  const producto = aviso || oferta;
  const precio = Number(aviso?.price ?? oferta?.monto ?? 0);
  const minimo = Number(
    aviso?.acceptsOffers === false
      ? aviso.price
      : aviso?.minimum || aviso?.price || oferta?.monto || 0,
  );
  const montoInicial = esNueva
    ? String(((precio + minimo) / 2).toFixed(2))
    : String(oferta?.monto || '');
  const [monto, setMonto] = useState(montoInicial);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  function guardar(event) {
    event.preventDefault();
    try {
      if (esNueva) {
        const id = enviarOferta(aviso.id, monto, mensaje);
        completar?.(id);
        return;
      }
      responderOferta(oferta.id, accion, monto, mensaje);
      completar?.();
    } catch (problema) {
      setError(problema.message);
    }
  }

  const mostrarMonto = esNueva || accion === 'contraofertar';
  const mostrarMensaje = mostrarMonto;
  const valorMonto = Number(monto);
  let errorMonto = '';
  if (mostrarMonto && monto !== '' && (!Number.isFinite(valorMonto) || valorMonto <= 0)) {
    errorMonto = 'Ingresa un monto positivo.';
  } else if (mostrarMonto && aviso && monto !== '' && valorMonto < minimo) {
    errorMonto = `El vendedor no acepta ofertas por debajo de ${dinero(minimo)}.`;
  } else if (mostrarMonto && aviso && monto !== '' && valorMonto > precio) {
    errorMonto = `El monto no puede superar el precio pedido de ${dinero(precio)}.`;
  } else if (
    accion === 'contraofertar' &&
    monto !== '' &&
    valorMonto === Number(oferta?.monto)
  ) {
    errorMonto = 'La contraoferta debe proponer un monto distinto al actual.';
  }
  const titulo = titulos[accion] || 'Responder a la oferta';
  let detalle = 'Confirma tu respuesta a esta negociación.';
  if (accion === 'aceptar')
    detalle = `Se reservará el aviso por ${dinero(oferta?.monto)} y se generará un acuerdo de entrega.`;
  if (accion === 'retirar')
    detalle = 'La otra persona ya no podrá responder esta oferta. Podrás enviar una nueva después.';
  if (accion === 'rechazar')
    detalle = 'La negociación se cerrará y la otra persona verá que rechazaste la propuesta.';

  return (
    <Modal
      titulo={titulo}
      cerrar={cerrar}
      className="hu3-modal hu4-modal"
    >
      <form onSubmit={guardar}>
        <div className="hu3-modal-producto">
          <span aria-hidden="true" />
          <div>
            <strong>{producto?.title || 'Publicación'}</strong>
            <small>
              {aviso
                ? `${aviso.condition} · ${aviso.course}`
                : `Precio pedido ${dinero(oferta?.monto)}`}
            </small>
          </div>
        </div>

        {mostrarMonto ? (
          <>
            {!esNueva && (
              <div className="hu4-comparacion-montos">
                <div>
                  <span>Oferta recibida</span>
                  <strong>{dinero(oferta?.monto)}</strong>
                </div>
                <div className="hu4-monto-propio">
                  <span>Tu contraoferta</span>
                  <strong>{dinero(monto || 0)}</strong>
                </div>
                <div>
                  <span>Precio pedido</span>
                  <strong>{dinero(precio)}</strong>
                </div>
              </div>
            )}
            {esNueva && (
              <div className="hu4-precio-resumen">
                <span>Precio pedido <strong>{dinero(precio)}</strong></span>
                <span>Monto mínimo aceptado <strong>{dinero(minimo)}</strong></span>
              </div>
            )}
            <label>
              {esNueva ? 'Monto de tu oferta' : 'Monto que propones'}
              <input
                required
                type="number"
                min={minimo || '0.01'}
                max={precio || undefined}
                step="0.01"
                aria-invalid={Boolean(errorMonto)}
                className={errorMonto ? 'hu4-input-invalido' : undefined}
                value={monto}
                onChange={(event) => setMonto(event.target.value)}
              />
              <small className={errorMonto ? 'hu4-ayuda-error' : undefined}>
                {errorMonto ||
                  (esNueva
                    ? `Entre ${dinero(minimo)} y ${dinero(precio)}.`
                    : 'La contraoferta debe proponer un monto distinto al actual.')}
              </small>
            </label>
            {mostrarMensaje && (
              <label>
                Mensaje (opcional)
                <textarea
                  rows={3}
                  maxLength={300}
                  value={mensaje}
                  onChange={(event) => setMensaje(event.target.value)}
                  placeholder="Escribe un mensaje corto…"
                />
              </label>
            )}
          </>
        ) : (
          <p className="hu4-modal-ayuda">{detalle}</p>
        )}

        {error && (
          <p
            className="hu3-mensaje-error"
            role="alert"
          >
            {error}
          </p>
        )}
        <div className="hu3-modal-acciones">
          <button
            type="button"
            className="hu3-boton hu3-boton-borde"
            onClick={cerrar}
          >
            Cancelar
          </button>
          <button
            className="hu3-boton"
            disabled={Boolean(errorMonto)}
          >
            {esNueva
              ? 'Enviar oferta'
              : {
                  aceptar: 'Aceptar propuesta',
                  contraofertar: 'Enviar contraoferta',
                  rechazar: 'Rechazar oferta',
                  retirar: 'Retirar oferta',
                }[accion] || 'Confirmar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
