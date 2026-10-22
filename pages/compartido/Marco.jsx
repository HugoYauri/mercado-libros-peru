import { useEffect, useId, useRef } from 'react';
import Cabecera from './Cabecera.jsx';
import Pie from './Pie.jsx';
import '../../assets/css/negociaciones.css';
import '../../assets/css/modales.css';

export function Modal({ titulo, cerrar, children, className = '' }) {
  const dialogo = useRef(null);
  const id = useId();
  useEffect(() => {
    const elemento = dialogo.current;
    elemento.showModal();
    return () => elemento.close();
  }, []);
  return (
    <dialog
      ref={dialogo}
      className={'neg-modal ' + className}
      onCancel={cerrar}
      aria-labelledby={id}
    >
      <div className="neg-fila">
        <h2 id={id}>{titulo}</h2>
        <button type="button" aria-label="Cerrar ventana" onClick={cerrar}>
          ×
        </button>
      </div>
      {children}
    </dialog>
  );
}

export const dinero = (precio) => 'S/ ' + Number(precio).toFixed(2);

export default function Marco({
  historia = 'hu1',
  publico = false,
  visitante = false,
  titulo,
  descripcion,
  acciones,
  migas,
  busqueda,
  clase = '',
  children,
}) {
  return (
    <div className={publico ? 'hu1-app hu1-publico' : 'neg-app ' + historia + '-app'}>
      <Cabecera historia={historia} publico={publico} visitante={visitante} busqueda={busqueda} />
      <main className={publico ? 'hu1-contenido-publico ' + clase : 'neg-contenido ' + clase}>
        {migas && (
          <nav className={historia + '-migas'} aria-label="Ruta de navegación">
            {migas}
          </nav>
        )}
        {titulo && (
          <div className={historia + '-titulo-fila'}>
            <div>
              <h1>{titulo}</h1>
              {descripcion && <p className="neg-subtitulo">{descripcion}</p>}
            </div>
            {acciones}
          </div>
        )}
        {children}
      </main>
      <Pie historia={historia} publico={publico} />
    </div>
  );
}
