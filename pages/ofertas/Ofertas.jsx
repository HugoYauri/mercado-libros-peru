import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Marco, { dinero } from '../compartido/Marco.jsx';
import Enlace from '../compartido/Enlace.jsx';
import ModalOferta from './ModalOferta.jsx';
import '../../assets/css/ofertas.css';

export default function Ofertas() {
  const ejemplos = [
    {
      id: 1,
      titulo: 'Cálculo de una variable — Stewart, 8.ª ed.',
      persona: 'Carlos Mendoza',
      iniciales: 'CM',
      monto: 85,
      precio: 95,
      estado: 'Pendiente',
      vista: 'recibidas',
    },
    {
      id: 2,
      titulo: 'Cálculo de una variable — Stewart, 8.ª ed.',
      persona: 'Andrea López',
      iniciales: 'AL',
      monto: 80,
      precio: 95,
      estado: 'Pendiente',
      vista: 'recibidas',
    },
    {
      id: 3,
      titulo: 'Calculadora científica ClassWiz fx-991',
      persona: 'Diego Ruiz',
      iniciales: 'DR',
      monto: 110,
      precio: 120,
      estado: 'Aceptada',
      vista: 'recibidas',
    },
    {
      id: 4,
      titulo: 'Álgebra lineal — Grossman',
      persona: 'María García',
      iniciales: 'MG',
      monto: 60,
      precio: 70,
      estado: 'Pendiente',
      vista: 'enviadas',
    },
  ];
  const estados = ['Todas', 'Pendiente', 'Aceptada', 'Rechazada', 'Retirada'];
  const [parametros] = useSearchParams();
  const [ofertas, setOfertas] = useState(parametros.get('ejemplo') === 'vacio' ? [] : ejemplos);
  const [filtro, setFiltro] = useState({
    vista: parametros.get('vista') || 'recibidas',
    estado: 'Todas',
  });
  const [seleccion, setSeleccion] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const visibles = ofertas.filter(
    (oferta) =>
      oferta.vista === filtro.vista &&
      (filtro.estado === 'Todas' || oferta.estado === filtro.estado),
  );
  function confirmar(monto) {
    const estado = {
      aceptar: 'Aceptada',
      rechazar: 'Rechazada',
      retirar: 'Retirada',
      contraofertar: 'Pendiente',
    }[seleccion.accion];
    setOfertas(
      ofertas.map((oferta) =>
        oferta.id === seleccion.oferta.id ? { ...oferta, estado, monto } : oferta,
      ),
    );
    setSeleccion(null);
    setMensaje('Respuesta aplicada al ejemplo.');
  }
  return (
    <Marco
      historia="hu4"
      titulo="Ofertas"
      descripcion="Negocia con otros estudiantes de la comunidad."
    >
      <div className="hu4-pestanas-vista" role="tablist" aria-label="Tipo de ofertas">
        {['recibidas', 'enviadas'].map((vista) => (
          <button
            key={vista}
            role="tab"
            aria-selected={filtro.vista === vista}
            onClick={() => setFiltro({ ...filtro, vista })}
          >
            {vista === 'recibidas' ? 'Ofertas recibidas' : 'Ofertas enviadas'}{' '}
            <span>{ofertas.filter((oferta) => oferta.vista === vista).length}</span>
          </button>
        ))}
      </div>
      <div className="hu4-barra-filtros">
        <div className="hu4-filtros-estado">
          {estados.map((estado) => (
            <button
              key={estado}
              className="hu4-chip"
              aria-pressed={filtro.estado === estado}
              onClick={() => setFiltro({ ...filtro, estado })}
            >
              {estado}
            </button>
          ))}
        </div>
        <span className="hu4-agrupacion-ayuda">Agrupadas por aviso</span>
      </div>
      {mensaje && (
        <p className="hu4-mensaje-exito" role="status">
          {mensaje}
        </p>
      )}
      {visibles.length ? (
        <div className="hu4-grupos-ofertas">
          {[...new Set(visibles.map((oferta) => oferta.titulo))].map((titulo) => (
            <section className="hu4-grupo-aviso" key={titulo}>
              <header className="hu4-grupo-cabecera">
                <div className="hu4-miniatura-aviso" />
                <div className="hu4-grupo-titulo">
                  <h2>{titulo}</h2>
                  <p>
                    Precio publicado ·{' '}
                    {dinero(visibles.find((oferta) => oferta.titulo === titulo).precio)}
                  </p>
                </div>
              </header>
              {visibles
                .filter((oferta) => oferta.titulo === titulo)
                .map((oferta) => (
                  <article className="hu4-fila-oferta" key={oferta.id}>
                    <span className="hu4-avatar">{oferta.iniciales}</span>
                    <div className="hu4-persona-oferta">
                      <strong>{oferta.persona}</strong>
                      <p>Estudiante ULima · 4.8 ★</p>
                      <small>Hace 2 horas</small>
                    </div>
                    <div className="hu4-monto-fila">
                      <strong>{dinero(oferta.monto)}</strong>
                      <small>monto propuesto</small>
                    </div>
                    <span className={'hu4-estado hu4-estado-' + oferta.estado.toLowerCase()}>
                      {oferta.estado}
                    </span>
                    <div className="hu4-botones-fila">
                      <Enlace className="hu4-enlace" href={'/ofertas/' + oferta.id}>
                        Ver hilo
                      </Enlace>
                      {oferta.estado === 'Pendiente' && (
                        <div className="hu4-acciones-oferta">
                          {(filtro.vista === 'recibidas'
                            ? ['aceptar', 'contraofertar', 'rechazar']
                            : ['retirar']
                          ).map((accion) => (
                            <button
                              key={accion}
                              className={
                                'hu4-boton ' +
                                (accion === 'aceptar' ? 'hu4-boton-verde' : 'hu4-boton-borde')
                              }
                              onClick={() => setSeleccion({ oferta, accion })}
                            >
                              {
                                {
                                  aceptar: 'Aceptar',
                                  contraofertar: 'Contraofertar',
                                  rechazar: 'Rechazar',
                                  retirar: 'Retirar',
                                }[accion]
                              }
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                ))}
            </section>
          ))}
        </div>
      ) : (
        <section className="hu4-estado-vacio">
          <span className="hu4-vacio-icono">↗</span>
          <h2>No hay ofertas en esta sección</h2>
          <p>Prueba otra pestaña o cambia el filtro.</p>
        </section>
      )}
      <section className="hu4-reglas">
        <h2>Recuerda</h2>
        <p>Revisa el monto antes de responder y coordina siempre dentro del campus.</p>
      </section>
      {seleccion && (
        <ModalOferta {...seleccion} cerrar={() => setSeleccion(null)} confirmar={confirmar} />
      )}
    </Marco>
  );
}
