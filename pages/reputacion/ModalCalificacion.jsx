import { Modal } from '../compartido/Marco.jsx';

export default function ModalCalificacion({ cerrar, confirmar }) {
  const puntajes = [5, 4, 3, 2, 1];
  return (
    <Modal titulo="Calificar a la contraparte" cerrar={cerrar}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const datos = new FormData(event.currentTarget);
          confirmar(Number(datos.get('puntaje')), datos.get('comentario'));
        }}
      >
        <label>
          Puntaje
          <select name="puntaje" required defaultValue="">
            <option value="">Selecciona estrellas</option>
            {puntajes.map((valor) => (
              <option key={valor} value={valor}>
                {valor} {'★'.repeat(valor)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Comentario opcional
          <textarea name="comentario" rows={4} maxLength={300} />
        </label>
        <p className="neg-ayuda">Solo puedes enviar una calificación por ejemplo.</p>
        <div className="neg-acciones">
          <button className="neg-boton">Enviar calificación</button>
          <button className="neg-secundario" type="button" onClick={cerrar}>
            Cancelar
          </button>
        </div>
      </form>
    </Modal>
  );
}
