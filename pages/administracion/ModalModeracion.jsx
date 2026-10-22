import { Modal } from '../compartido/Marco.jsx';

export default function ModalModeracion({ accion, cerrar, confirmar }) {
  return (
    <Modal titulo={accion} cerrar={cerrar}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          confirmar(new FormData(event.currentTarget).get('motivo'));
        }}
      >
        <p className="neg-ayuda">La acción solo modifica esta ficha de ejemplo.</p>
        <label>
          Motivo
          <textarea name="motivo" rows={3} minLength={5} maxLength={300} required />
        </label>
        <div className="neg-acciones">
          <button className="neg-boton">Confirmar acción</button>
          <button className="neg-secundario" type="button" onClick={cerrar}>
            Cancelar
          </button>
        </div>
      </form>
    </Modal>
  );
}
