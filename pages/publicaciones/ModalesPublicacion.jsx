import { useState } from 'react';
import { Modal } from '../compartido/Marco.jsx';

export default function ModalesPublicacion({ seleccion, cerrar, confirmar }) {
  const opciones = [
    ['Pausado', 'Pausar temporalmente'],
    ['Publicado', 'Reactivar y volver a publicar'],
  ];
  const [estado, setEstado] = useState(seleccion.estado);
  const [texto, setTexto] = useState('');
  const eliminando = seleccion.estado === 'Eliminado';
  return (
    <Modal
      titulo={eliminando ? 'Eliminar aviso' : 'Cambiar el estado del aviso'}
      cerrar={cerrar}
      className={'hu2-modal' + (eliminando ? ' hu2-modal-eliminar' : '')}
    >
      <p className="hu2-ayuda">{seleccion.titulo}</p>
      {eliminando ? (
        <label className="hu2-confirmacion">
          <span className="hu2-etiqueta">Escribe ELIMINAR para confirmar</span>
          <input
            value={texto}
            onChange={(event) => setTexto(event.target.value)}
            placeholder="ELIMINAR"
          />
        </label>
      ) : (
        <fieldset className="hu2-estados-modal">
          <legend className="hu2-solo-lectores">Nuevo estado</legend>
          {opciones.map(([valor, etiqueta]) => (
            <label key={valor} className={estado === valor ? 'hu2-opcion-activa' : ''}>
              <input
                type="radio"
                name="estado"
                checked={estado === valor}
                onChange={() => setEstado(valor)}
              />
              {etiqueta}
            </label>
          ))}
        </fieldset>
      )}
      <p className="hu2-alerta hu2-alerta-atencion">La acción solo cambia este ejemplo.</p>
      <div className="hu2-modal-acciones">
        <button className="hu2-enlace" onClick={cerrar}>
          Cancelar
        </button>
        <button
          className={eliminando ? 'hu2-boton hu2-destructivo' : 'hu2-boton'}
          disabled={eliminando && texto !== 'ELIMINAR'}
          onClick={() => confirmar(eliminando ? 'Eliminado' : estado)}
        >
          {eliminando ? 'Eliminar aviso' : 'Confirmar cambio'}
        </button>
      </div>
    </Modal>
  );
}
