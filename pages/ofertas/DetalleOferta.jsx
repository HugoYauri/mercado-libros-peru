import { useState } from 'react';
import Marco, { dinero } from '../compartido/Marco.jsx';
import Enlace from '../compartido/Enlace.jsx';
import ModalOferta from './ModalOferta.jsx';
import '../../assets/css/ofertas.css';

export default function DetalleOferta() {
  const ejemplos = [
    {
      titulo: 'Cálculo de una variable — Stewart, 8.ª ed.',
      precio: 95,
      monto: 88,
      estado: 'Pendiente',
    },
  ];
  const mensajes = [
    {
      autor: 'Tú (comprador)',
      iniciales: 'EE',
      monto: 75,
      texto: 'Hola, ¿lo dejarías en S/ 75? Puedo recogerlo mañana.',
      etiqueta: 'Primera oferta',
      propia: true,
    },
    {
      autor: 'María García',
      iniciales: 'MG',
      monto: 90,
      texto: 'Está casi nuevo. Podría dejarlo en S/ 90.',
      etiqueta: 'Contraoferta',
      propia: false,
    },
    {
      autor: 'Tú (comprador)',
      iniciales: 'EE',
      monto: 85,
      texto: '¿Podemos cerrar en S/ 85?',
      etiqueta: 'Contraoferta',
      propia: true,
    },
    {
      autor: 'María García',
      iniciales: 'MG',
      monto: 88,
      texto: 'S/ 88 es mi mejor precio. Lo entrego en la biblioteca.',
      etiqueta: 'Propuesta vigente',
      propia: false,
    },
  ];
  const [oferta, setOferta] = useState(ejemplos[0]);
  const [accion, setAccion] = useState('');
  const [respuesta, setRespuesta] = useState('');
  function confirmar(monto, texto) {
    setOferta({
      ...oferta,
      monto,
      estado: {
        aceptar: 'Aceptada',
        rechazar: 'Rechazada',
        retirar: 'Retirada',
        contraofertar: 'Pendiente',
      }[accion],
    });
    setRespuesta(
      accion === 'contraofertar'
        ? 'Contraoferta preparada: ' + dinero(monto) + '. ' + texto
        : 'Respuesta aplicada al ejemplo.',
    );
    setAccion('');
  }
  return (
    <Marco historia="hu4" migas={<Enlace href="/ofertas">← Volver a ofertas</Enlace>}>
      {respuesta && (
        <p className="hu4-mensaje-exito" role="status">
          {respuesta}
        </p>
      )}
      <div className="hu4-detalle-negociacion">
        <section className="hu4-panel hu4-hilo">
          <header className="hu4-hilo-cabecera">
            <div>
              <h1>Negociación con María García</h1>
              <p>Iniciada el 28 de agosto · 4 movimientos ilustrativos</p>
            </div>
            <span className="hu4-estado-hilo">{oferta.estado}</span>
          </header>
          <ol className="hu4-historial">
            {mensajes.map((mensaje, indice) => (
              <li
                key={indice}
                className={
                  'hu4-evento' +
                  (mensaje.propia ? ' hu4-evento-propio' : '') +
                  (indice === 3 ? ' hu4-evento-actual' : '')
                }
              >
                <span className="hu4-avatar">{mensaje.iniciales}</span>
                <article>
                  <div className="hu4-evento-meta">
                    <strong>{mensaje.autor}</strong>
                    <span className="hu4-etiqueta-movimiento">{mensaje.etiqueta}</span>
                    <time>28 ago · 10:{indice}0</time>
                  </div>
                  <p className="hu4-evento-monto">{dinero(mensaje.monto)}</p>
                  <p className="hu4-evento-texto">«{mensaje.texto}»</p>
                </article>
              </li>
            ))}
          </ol>
          {oferta.estado === 'Pendiente' ? (
            <footer className="hu4-acciones-hilo">
              <p>Acciones disponibles para esta propuesta.</p>
              <div>
                <button className="hu4-boton hu4-boton-verde" onClick={() => setAccion('aceptar')}>
                  Aceptar {dinero(oferta.monto)}
                </button>
                <button
                  className="hu4-boton hu4-boton-borde"
                  onClick={() => setAccion('contraofertar')}
                >
                  Nueva contraoferta
                </button>
                <button
                  className="hu4-boton hu4-boton-rechazar"
                  onClick={() => setAccion('rechazar')}
                >
                  Rechazar
                </button>
              </div>
            </footer>
          ) : (
            <div className="hu4-estado-final">
              <span>Estado de la negociación</span>
              <strong>{oferta.estado}</strong>
            </div>
          )}
        </section>
        <aside className="hu4-resumen-lateral">
          <section className="hu4-panel">
            <h2 className="hu4-etiqueta">Aviso en negociación</h2>
            <div className="hu4-miniatura-detalle">
              <span>{oferta.titulo}</span>
            </div>
            <h3>{oferta.titulo}</h3>
            <p className="hu4-precio-lateral">{dinero(oferta.precio)}</p>
            <p className="hu4-ayuda">Mínimo aceptado S/ 50.00 · Publicado</p>
          </section>
          <section className="hu4-panel">
            <h2 className="hu4-etiqueta">Contraparte</h2>
            <div className="hu4-persona-lateral">
              <span className="hu4-avatar">MG</span>
              <div>
                <strong>María García</strong>
                <p>Ingeniería Industrial · 4.8 ★</p>
              </div>
            </div>
            <Enlace className="hu4-enlace" href="/vendedor">
              Ver perfil público
            </Enlace>
          </section>
          <section className="hu4-panel hu4-resumen-montos">
            <h2 className="hu4-etiqueta">Resumen de montos</h2>
            <dl>
              <div>
                <dt>Precio pedido</dt>
                <dd>{dinero(oferta.precio)}</dd>
              </div>
              <div>
                <dt>Primera oferta</dt>
                <dd>S/ 75.00</dd>
              </div>
              <div>
                <dt>Última del comprador</dt>
                <dd>S/ 85.00</dd>
              </div>
              <div className="hu4-monto-vigente">
                <dt>Oferta vigente</dt>
                <dd>{dinero(oferta.monto)}</dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
      {accion && (
        <ModalOferta
          accion={accion}
          oferta={oferta}
          cerrar={() => setAccion('')}
          confirmar={confirmar}
        />
      )}
    </Marco>
  );
}
