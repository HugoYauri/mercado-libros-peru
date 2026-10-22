import { Modal } from '../compartido/Marco.jsx';

export default function ModalCancelarAcuerdo({ cerrar, confirmar }) {
  const motivos = [
    'Ya no necesito el producto',
    'No podemos coordinar el encuentro',
    'Otro motivo',
  ];
  return (
    <Modal titulo="Cancelar el acuerdo" cerrar={cerrar} className="hu5-modal">
      <p>Indica el motivo de la cancelación.</p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          confirmar(new FormData(event.currentTarget).get('motivo'));
        }}
      >
        <label>
          Motivo
          <select name="motivo" defaultValue="" required>
            <option value="">Selecciona un motivo</option>
            {motivos.map((motivo) => (
              <option key={motivo}>{motivo}</option>
            ))}
          </select>
        </label>
        <label>
          Detalle (opcional)
          <textarea maxLength={300} rows={3} />
        </label>
        <div className="hu5-modal-acciones">
          <button className="hu5-boton hu5-boton-borde" type="button" onClick={cerrar}>
            Volver
          </button>
          <button className="hu5-boton hu5-boton-cancelar">Confirmar cancelación</button>
        </div>
      </form>
    </Modal>
  );
}
