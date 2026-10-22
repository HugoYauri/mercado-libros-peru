import { Modal, dinero } from '../compartido/Marco.jsx';

export default function OfertaEjemplo({ aviso, cerrar, confirmar }) {
  return (
    <Modal titulo="Hacer una oferta" cerrar={cerrar} className="hu3-modal">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          confirmar(Number(new FormData(event.currentTarget).get('monto')));
        }}
      >
        <div className="hu3-modal-producto">
          <span />
          <div>
            <strong>{aviso.title}</strong>
            <small>
              {aviso.condition} · {aviso.course}
            </small>
          </div>
        </div>
        <p>Precio pedido: {dinero(aviso.price)}</p>
        <label>
          Monto de tu oferta
          <input
            name="monto"
            type="number"
            min="50"
            max={aviso.price}
            step="0.01"
            defaultValue="85"
            required
          />
        </label>
        <label>
          Mensaje (opcional)
          <textarea name="mensaje" rows={3} maxLength={300} />
        </label>
        <div className="hu3-modal-acciones">
          <button className="hu3-boton hu3-boton-borde" type="button" onClick={cerrar}>
            Cancelar
          </button>
          <button className="hu3-boton">Enviar oferta</button>
        </div>
      </form>
    </Modal>
  );
}
