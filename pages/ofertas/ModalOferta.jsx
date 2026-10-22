import { Modal, dinero } from '../compartido/Marco.jsx';

export default function ModalOferta({ accion, oferta, cerrar, confirmar }) {
  const titulos = {
    aceptar: 'Aceptar propuesta',
    contraofertar: 'Enviar contraoferta',
    rechazar: 'Rechazar oferta',
    retirar: 'Retirar oferta',
  };
  function enviar(event) {
    event.preventDefault();
    const datos = new FormData(event.currentTarget);
    confirmar(Number(datos.get('monto') || oferta.monto), datos.get('mensaje') || '');
  }
  return (
    <Modal titulo={titulos[accion]} cerrar={cerrar} className="hu3-modal hu4-modal">
      <form onSubmit={enviar}>
        <div className="hu3-modal-producto">
          <span />
          <div>
            <strong>{oferta.titulo}</strong>
            <small>Propuesta vigente: {dinero(oferta.monto)}</small>
          </div>
        </div>
        {accion === 'contraofertar' ? (
          <>
            <div className="hu4-comparacion-montos">
              <div>
                <span>Oferta recibida</span>
                <strong>{dinero(oferta.monto)}</strong>
              </div>
              <div>
                <span>Precio pedido</span>
                <strong>{dinero(oferta.precio)}</strong>
              </div>
            </div>
            <label>
              Monto que propones
              <input
                name="monto"
                type="number"
                required
                min="1"
                max={oferta.precio}
                step="0.01"
                defaultValue={oferta.monto}
              />
            </label>
            <label>
              Mensaje (opcional)
              <textarea name="mensaje" rows={3} maxLength={300} />
            </label>
          </>
        ) : (
          <p className="hu4-modal-ayuda">Confirma tu respuesta. Solo se modificará este ejemplo.</p>
        )}
        <div className="hu3-modal-acciones">
          <button type="button" className="hu3-boton hu3-boton-borde" onClick={cerrar}>
            Cancelar
          </button>
          <button className="hu3-boton">{titulos[accion]}</button>
        </div>
      </form>
    </Modal>
  );
}
