import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Marco from '../compartido/Marco.jsx';
import ModalCalificacion from './ModalCalificacion.jsx';

export default function Calificaciones() {
  const ejemplos = [
    { id: 1, titulo: 'Cálculo de una variable', persona: 'María García', vista: 'Pendientes' },
    {
      id: 2,
      persona: 'Carlos Mendoza',
      vista: 'Recibidas',
      puntaje: 5,
      comentario: 'Puntual y amable. Todo conforme.',
    },
    {
      id: 3,
      persona: 'Andrea López',
      vista: 'Enviadas',
      puntaje: 4,
      comentario: 'El producto estaba en buen estado.',
    },
  ];
  const vistas = ['Pendientes', 'Recibidas', 'Enviadas'];
  const [parametros] = useSearchParams();
  const [lista, setLista] = useState(parametros.get('ejemplo') === 'vacio' ? [] : ejemplos);
  const [vista, setVista] = useState('Pendientes');
  const [seleccion, setSeleccion] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const visibles = lista.filter((item) => item.vista === vista);
  function enviar(puntaje, comentario) {
    setLista(
      lista.map((item) =>
        item.id === seleccion.id ? { ...item, puntaje, comentario, vista: 'Enviadas' } : item,
      ),
    );
    setSeleccion(null);
    setMensaje('Calificación aplicada al ejemplo.');
  }
  return (
    <Marco
      historia="hu6"
      titulo="Mis calificaciones"
      descripcion="Valora tu experiencia después de completar un acuerdo de entrega."
    >
      <section className="neg-tarjeta">
        <h2>Tu reputación</h2>
        <p className="neg-precio">
          {lista.some((item) => item.vista === 'Recibidas') ? '5.0 ★' : 'Sin calificaciones'}
        </p>
        <p>{lista.filter((item) => item.vista === 'Recibidas').length} opiniones recibidas</p>
      </section>
      <div className="neg-acciones">
        {vistas.map((valor) => (
          <button
            key={valor}
            aria-pressed={vista === valor}
            className={vista === valor ? 'neg-boton' : 'neg-secundario'}
            onClick={() => setVista(valor)}
          >
            {valor}
          </button>
        ))}
      </div>
      {mensaje && (
        <p className="neg-exito" role="status">
          {mensaje}
        </p>
      )}
      {visibles.map((item) => (
        <article className="neg-tarjeta" key={item.id}>
          {vista === 'Pendientes' ? (
            <>
              <h2>{item.titulo}</h2>
              <p className="neg-ayuda">Entrega completada. Ya puedes calificar a {item.persona}.</p>
              <button className="neg-boton" onClick={() => setSeleccion(item)}>
                Calificar a la contraparte
              </button>
            </>
          ) : (
            <>
              <h2>
                {'★'.repeat(item.puntaje)} · {item.puntaje}/5
              </h2>
              <p>
                {vista === 'Recibidas' ? 'De: ' : 'Para: '}
                {item.persona}
              </p>
              <p className="my-3">{item.comentario || 'Sin comentario adicional.'}</p>
              <time>Agosto de 2026</time>
            </>
          )}
        </article>
      ))}
      {!visibles.length && <p className="neg-tarjeta">No hay calificaciones en esta sección.</p>}
      {seleccion && <ModalCalificacion cerrar={() => setSeleccion(null)} confirmar={enviar} />}
    </Marco>
  );
}
