import { useState } from 'react';
import { Modal } from './Marco.jsx';

export default function BotonReporte({ tipo = 'Aviso' }) {
  const motivos = ['Información incorrecta', 'Contenido inapropiado', 'Otro motivo'];
  const [estado, setEstado] = useState('');
  return (
    <>
      {estado === 'enviado' ? (
        <p className="neg-exito" role="status">
          Reporte de ejemplo preparado.
        </p>
      ) : (
        <button className="neg-secundario" onClick={() => setEstado('abierto')}>
          Reportar {tipo.toLowerCase()}
        </button>
      )}
      {estado === 'abierto' && (
        <Modal titulo={'Reportar ' + tipo.toLowerCase()} cerrar={() => setEstado('')}>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setEstado('enviado');
            }}
          >
            <label>
              Motivo
              <select name="motivo" required defaultValue="">
                <option value="">Selecciona</option>
                {motivos.map((motivo) => (
                  <option key={motivo}>{motivo}</option>
                ))}
              </select>
            </label>
            <label>
              Detalle
              <textarea name="detalle" minLength={10} maxLength={500} required rows={4} />
            </label>
            <div className="neg-acciones">
              <button className="neg-boton">Enviar reporte</button>
              <button className="neg-secundario" type="button" onClick={() => setEstado('')}>
                Cancelar
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
