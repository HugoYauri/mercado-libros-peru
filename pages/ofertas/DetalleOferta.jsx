import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { usuarioActivo, perfilPublico } from '../../assets/js/compartido/sesion.js';
import { obtenerAviso } from '../../assets/js/compartido/storage.js';
import { esParticipante } from '../../assets/js/hu4/ofertas.js';
import { reputacion } from '../../assets/js/hu6/reputacion.js';
import AcuerdoGenerado from '../acuerdos/AcuerdoGenerado.jsx';
import Marco, { dinero, fechaLegible, useNegociaciones } from '../compartido/Marco.jsx';
import ModalOferta from './ModalOferta.jsx';
import '../../assets/css/ofertas.css';

function nombreDe(correo) {
  const usuario = perfilPublico(correo);
  return usuario ? `${usuario.nombres} ${usuario.apellidos}` : correo;
}

function inicialesDe(correo) {
  const usuario = perfilPublico(correo);
  if (!usuario) return 'ES';
  return `${usuario.nombres?.[0] || ''}${usuario.apellidos?.[0] || ''}`.toUpperCase();
}

function etiquetaEvento(evento, indice, total) {
  const texto = evento.texto.toLowerCase();
  if (texto.includes('contraoferta')) return 'Contraoferta';
  if (texto.includes('acept')) return 'Propuesta aceptada';
  if (texto.includes('rechaz')) return 'Propuesta rechazada';
  if (texto.includes('retir')) return 'Oferta retirada';
  if (indice === 0) return 'Oferta enviada';
  if (indice === total - 1) return 'Estado actual';
  return 'Movimiento';
}

function estadoActual(oferta, correo, contraparte) {
  if (oferta.estado !== 'Pendiente') return oferta.estado;
  if (oferta.turno === correo) {
    return oferta.historial.length > 1
      ? `Contraofertada · te toca responder`
      : 'Te toca responder';
  }
  return oferta.historial.length > 1
    ? `Contraofertada · esperando a ${nombreDe(contraparte).split(' ')[0]}`
    : `Enviada · esperando a ${nombreDe(contraparte).split(' ')[0]}`;
}

export default function DetalleOferta() {
  const { id } = useParams();
  const { ofertas, acuerdos } = useNegociaciones();
  const correo = usuarioActivo().correo;
  const oferta = ofertas.find((item) => item.id === id && esParticipante(item, correo));
  const [modal, setModal] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [mostrarAcuerdo, setMostrarAcuerdo] = useState(false);
  const acuerdo = acuerdos.find((item) => item.ofertaId === id);

  if (!oferta)
    return (
      <Marco
        ofertas
        titulo="Oferta no disponible"
        descripcion="No existe esta oferta o no participas en ella."
      >
        <p className="hu4-mensaje-error" role="alert">
          No existe esta oferta o no participas en ella.
        </p>
        <a href="/ofertas" className="hu4-boton">Volver a ofertas</a>
      </Marco>
    );

  if (mostrarAcuerdo && acuerdo) {
    return (
      <AcuerdoGenerado
        acuerdo={acuerdo}
        volver={() => setMostrarAcuerdo(false)}
      />
    );
  }

  const aviso = obtenerAviso(oferta.avisoId);
  const contraparte = oferta.comprador === correo ? oferta.vendedor : oferta.comprador;
  const perfilContraparte = perfilPublico(contraparte);
  const reputacionContraparte = reputacion(contraparte);
  const historialMontos = oferta.historial.filter((evento) => evento.monto != null);
  const primeraOferta = historialMontos[0]?.monto ?? oferta.monto;
  const ultimaDelComprador = [...historialMontos]
    .reverse()
    .find((evento) => evento.autor === oferta.comprador)?.monto ?? primeraOferta;
  const precioPedido = aviso?.price ?? oferta.monto;
  const estado = estadoActual(oferta, correo, contraparte);
  const puedeResponder = oferta.estado === 'Pendiente' && oferta.turno === correo;
  const puedeRetirar = oferta.estado === 'Pendiente' && oferta.comprador === correo;

  return (
    <Marco
      ofertas
      sinTitulo
      migas={
        <>
          <a href="/ofertas">Ofertas {oferta.comprador === correo ? 'enviadas' : 'recibidas'}</a>
          <span>›</span>
          <a href={`/aviso?id=${oferta.avisoId}`}>{oferta.titulo}</a>
          <span>›</span>
          <span>{nombreDe(contraparte)}</span>
        </>
      }
    >
      {mensaje && (
        <p className="hu4-mensaje-exito" role="status">{mensaje}</p>
      )}
      <div className="hu4-detalle-negociacion">
        <section className="hu4-panel hu4-hilo">
          <header className="hu4-hilo-cabecera">
            <div>
              <h1>Negociación con {nombreDe(contraparte)}</h1>
              <p>
                Iniciada el {fechaLegible(oferta.historial[0]?.fecha).split(',')[0]} ·{' '}
                {oferta.historial.length} movimientos
              </p>
            </div>
            <span className="hu4-estado-hilo">{estado}</span>
          </header>

          <ol className="hu4-historial">
            {oferta.historial.map((evento, indice) => {
              const propio = evento.autor === correo;
              const actual = indice === oferta.historial.length - 1 && oferta.estado === 'Pendiente';
              const autor = propio ? 'Tú' : nombreDe(evento.autor);
              const rol = evento.autor === oferta.comprador ? 'comprador' : 'vendedora';
              return (
                <li
                  className={
                    `hu4-evento${propio ? ' hu4-evento-propio' : ''}${actual ? ' hu4-evento-actual' : ''}`
                  }
                  key={evento.id}
                >
                  <span className="hu4-avatar" aria-hidden="true">
                    {propio ? inicialesDe(correo) : inicialesDe(evento.autor)}
                  </span>
                  <article>
                    <div className="hu4-evento-meta">
                      <strong>{autor}{propio ? ` (${rol})` : ''}</strong>
                      <span className="hu4-etiqueta-movimiento">{etiquetaEvento(evento, indice, oferta.historial.length)}</span>
                      <time dateTime={evento.fecha}>{fechaLegible(evento.fecha)}</time>
                    </div>
                    {evento.monto != null && (
                      <p className="hu4-evento-monto">
                        {dinero(evento.monto)}
                        {indice === 0 && <small> sobre {dinero(precioPedido)} pedidos</small>}
                      </p>
                    )}
                    <p className="hu4-evento-texto">«{evento.texto}»</p>
                    {actual && oferta.turno !== correo && (
                      <small className="hu4-evento-vencimiento">
                        La contrapropuesta vence siete días después de su envío.
                      </small>
                    )}
                  </article>
                </li>
              );
            })}
          </ol>

          {puedeResponder || puedeRetirar ? (
            <footer className="hu4-acciones-hilo">
              <p>
                {puedeResponder
                  ? 'Acciones disponibles mientras esta propuesta siga vigente.'
                  : 'Puedes retirar tu oferta mientras la otra persona no haya respondido.'}
              </p>
              <div>
                {puedeResponder && (
                  <>
                    <button
                      type="button"
                      className="hu4-boton hu4-boton-verde"
                      onClick={() => setModal('aceptar')}
                    >
                      Aceptar {dinero(oferta.monto)}
                    </button>
                    <button
                      type="button"
                      className="hu4-boton hu4-boton-borde"
                      onClick={() => setModal('contraofertar')}
                    >
                      Nueva contraoferta
                    </button>
                    <button
                      type="button"
                      className="hu4-boton hu4-boton-rechazar"
                      onClick={() => setModal('rechazar')}
                    >
                      Rechazar
                    </button>
                  </>
                )}
                {puedeRetirar && (
                  <button
                    type="button"
                    className="hu4-boton hu4-boton-rechazar"
                    onClick={() => setModal('retirar')}
                  >
                    Retirar oferta
                  </button>
                )}
              </div>
            </footer>
          ) : (
            <div className="hu4-estado-final">
              <span>Estado de la negociación</span>
              <strong>{estado}</strong>
              {acuerdo && (
                <a className="hu4-boton hu4-boton-verde" href={`/acuerdos/${acuerdo.id}`}>
                  Ver acuerdo de entrega
                </a>
              )}
            </div>
          )}
        </section>

        <aside className="hu4-resumen-lateral">
          <section className="hu4-panel">
            <h2 className="hu4-etiqueta">Aviso en negociación</h2>
            <a href={`/aviso?id=${oferta.avisoId}`} className="hu4-miniatura-detalle">
              {aviso?.imagen && aviso.imagen !== '/imagenes/libro.svg' ? (
                <img src={aviso.imagen} alt="" />
              ) : (
                <span aria-hidden="true">{oferta.titulo}</span>
              )}
            </a>
            <h3>{oferta.titulo}</h3>
            <p className="hu4-precio-lateral">{dinero(precioPedido)}</p>
            <p className="hu4-ayuda">
              Mínimo aceptado {dinero(aviso?.minimum ?? precioPedido)} · {aviso?.status || 'Aviso'}
            </p>
          </section>

          <section className="hu4-panel">
            <h2 className="hu4-etiqueta">Contraparte</h2>
            <div className="hu4-persona-lateral">
              <span className="hu4-avatar" aria-hidden="true">{inicialesDe(contraparte)}</span>
              <div>
                <strong>{nombreDe(contraparte)}</strong>
                <p>
                  {perfilContraparte?.carrera || 'Estudiante'} ·{' '}
                  {reputacionContraparte.recibidas.length
                    ? `${reputacionContraparte.promedio.toFixed(1)} ★`
                    : 'Sin calificaciones'}
                </p>
              </div>
            </div>
            <a
              className="hu4-enlace"
              href={`/vendedor?correo=${encodeURIComponent(contraparte)}`}
            >
              Ver perfil público
            </a>
          </section>

          <section className="hu4-panel hu4-resumen-montos">
            <h2 className="hu4-etiqueta">Resumen de montos</h2>
            <dl>
              <div><dt>Precio pedido</dt><dd>{dinero(precioPedido)}</dd></div>
              <div><dt>Primera oferta</dt><dd>{dinero(primeraOferta)}</dd></div>
              <div><dt>Última del comprador</dt><dd>{dinero(ultimaDelComprador)}</dd></div>
              <div className="hu4-monto-vigente"><dt>Oferta vigente</dt><dd>{dinero(oferta.monto)}</dd></div>
            </dl>
          </section>
        </aside>
      </div>

      {acuerdo && oferta.estado === 'Aceptada' && (
        <p className="hu4-acuerdo-notificacion">
          Esta oferta generó el acuerdo <a href={`/acuerdos/${acuerdo.id}`}>{acuerdo.id.slice(0, 8)}</a>.
          {' '}Puedes consultar su estado desde aquí.
        </p>
      )}

      {modal && (
        <ModalOferta
          aviso={aviso}
          oferta={oferta}
          modo="respuesta"
          accion={modal}
          cerrar={() => setModal('')}
          completar={() => {
            setModal('');
            if (modal === 'aceptar') setMostrarAcuerdo(true);
            else setMensaje('La respuesta quedó guardada.');
          }}
        />
      )}
    </Marco>
  );
}
