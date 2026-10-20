import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { usuarioActivo } from '../../assets/js/compartido/sesion.js';
import { obtenerAviso } from '../../assets/js/compartido/storage.js';
import { esParticipante } from '../../assets/js/hu4/ofertas.js';
import { actualizarAcuerdo } from '../../assets/js/hu5/acuerdos.js';
import Marco, {
  dinero,
  fechaLegible,
  Modal,
  useNegociaciones,
} from '../compartido/Marco.jsx';
import BotonReporte from '../compartido/BotonReporte.jsx';
import CoordinarEntrega from './CoordinarEntrega.jsx';
import ModalCancelarAcuerdo from './ModalCancelarAcuerdo.jsx';
import {
  EstadoAcuerdo,
  FotoAcuerdo,
  HistorialAcuerdo,
  PersonaAcuerdo,
  nombrePersona,
  referenciaAcuerdo,
  fechaEncuentro,
} from './ComponentesAcuerdo.jsx';
import '../../assets/css/acuerdos.css';

export default function DetalleAcuerdo() {
  const { id } = useParams();
  const [parametros, setParametros] = useSearchParams();
  const { acuerdos, ofertas } = useNegociaciones();
  const correo = usuarioActivo().correo;
  const acuerdo = acuerdos.find((item) => item.id === id && esParticipante(item, correo));
  const [accion, setAccion] = useState(() => {
    if (parametros.get('vista') === 'coordinar') return 'coordinar';
    if (parametros.get('vista') === 'entrega') return 'entregar';
    return '';
  });
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [guardando, setGuardando] = useState(false);

  function cerrar() {
    setAccion('');
    setError('');
    setParametros({}, { replace: true });
  }

  function abrir(tipo) {
    setError('');
    setMensaje('');
    setAccion(tipo);
  }

  function confirmar(tipo, campos = {}) {
    if (guardando) return;
    setGuardando(true);
    try {
      // Se reutiliza la misma función que utilizaba la pantalla original.
      actualizarAcuerdo(id, tipo, campos);
      cerrar();
      setMensaje(
        {
          coordinar: 'Tu propuesta quedó guardada. La otra persona debe aprobarla.',
          aprobar: 'Aceptaste el punto y el horario del encuentro.',
          entregar: 'Tu confirmación de entrega quedó registrada.',
          cancelar: 'El acuerdo fue cancelado. El motivo quedó registrado.',
        }[tipo],
      );
    } catch (problema) {
      setError(problema.message);
    } finally {
      setGuardando(false);
    }
  }

  if (!acuerdo)
    return (
      <Marco
        acuerdos
        titulo="Acuerdo no disponible"
      >
        <p className="hu5-alerta hu5-alerta-roja">
          No existe este acuerdo o no participas en él.
        </p>
        <a
          className="hu5-enlace"
          href="/acuerdos"
        >
          Volver a mis acuerdos
        </a>
      </Marco>
    );

  const terminado = ['Cerrado', 'Cancelado'].includes(acuerdo.estado);
  const puedoCoordinar = !terminado && acuerdo.confirmaciones.length === 0;
  const puedoEntregar =
    !terminado &&
    acuerdo.aprobaciones.length === 2 &&
    !acuerdo.confirmaciones.includes(correo);
  const puedoAprobar =
    !terminado && acuerdo.fecha && !acuerdo.aprobaciones.includes(correo);
  const coordinando = accion === 'coordinar' && puedoCoordinar;
  const aviso = obtenerAviso(acuerdo.avisoId);
  const oferta = ofertas.find((item) => item.id === acuerdo.ofertaId);
  const contraparte = acuerdo.comprador === correo ? acuerdo.vendedor : acuerdo.comprador;
  const participantes = [acuerdo.comprador, acuerdo.vendedor];

  return (
    <Marco
      acuerdos
      titulo={
        <span className="hu5-titulo-con-estado">
          {coordinando
            ? 'Coordinar la entrega'
            : `Acuerdo ${referenciaAcuerdo(acuerdo.id)}`}
          <EstadoAcuerdo
            acuerdo={acuerdo}
            correo={correo}
            detallado
          />
        </span>
      }
      migas={
        <>
          <a href="/acuerdos">Mis acuerdos</a>
          <span aria-hidden="true">›</span>
          <span>{referenciaAcuerdo(acuerdo.id)}</span>
          {coordinando && (
            <>
              <span aria-hidden="true">›</span>
              <span>Coordinar la entrega</span>
            </>
          )}
        </>
      }
      acciones={
        !coordinando && (
          <div className="hu5-reportar">
            <BotonReporte
              tipo="Usuario"
              objetivo={contraparte}
            />
          </div>
        )
      }
    >
      {mensaje && (
        <p
          className="hu5-alerta hu5-alerta-verde"
          role="status"
        >
          {mensaje}
        </p>
      )}
      {coordinando ? (
        <CoordinarEntrega
          acuerdo={acuerdo}
          oferta={oferta}
          correo={correo}
          confirmar={confirmar}
          volver={cerrar}
          error={error}
          guardando={guardando}
        />
      ) : (
        <>
          <div className="hu5-detalle">
            <div className="hu5-columna">
              <section className="hu5-panel hu5-producto">
                <FotoAcuerdo
                  aviso={aviso}
                  titulo={acuerdo.titulo}
                />
                <div className="hu5-producto-descripcion">
                  <h2>{acuerdo.titulo}</h2>
                  {aviso && (
                    <p className="hu5-texto-secundario">
                      {aviso.category} · {aviso.course} · {aviso.condition}
                    </p>
                  )}
                  <div className="hu5-precio-fila">
                    <p className="hu5-precio">{dinero(acuerdo.monto)}</p>
                    {aviso && <small>acordado sobre {dinero(aviso.price)} pedidos</small>}
                  </div>
                </div>
                <a
                  className="hu5-enlace"
                  href={`/aviso?id=${acuerdo.avisoId}`}
                >
                  Ver el aviso
                </a>
              </section>

              <section className="hu5-panel">
                <h2>Datos del encuentro</h2>
                <dl className="hu5-datos-encuentro">
                  <div>
                    <dt className="hu5-etiqueta">Punto de encuentro</dt>
                    <dd>{acuerdo.punto || 'Pendiente de coordinar'}</dd>
                  </div>
                  <div>
                    <dt className="hu5-etiqueta">Fecha</dt>
                    <dd>
                      {acuerdo.fecha
                        ? new Date(acuerdo.fecha).toLocaleDateString('es-PE')
                        : 'Sin definir'}
                    </dd>
                  </div>
                  <div>
                    <dt className="hu5-etiqueta">Hora de encuentro</dt>
                    <dd>
                      {acuerdo.fecha
                        ? new Date(acuerdo.fecha).toLocaleTimeString('es-PE', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                          })
                        : 'Sin definir'}
                    </dd>
                  </div>
                </dl>
                <div className="hu5-participantes">
                  <PersonaAcuerdo
                    correo={acuerdo.comprador}
                    rol="Comprador"
                    propia={correo === acuerdo.comprador}
                    mostrarTelefono
                  />
                  <PersonaAcuerdo
                    correo={acuerdo.vendedor}
                    rol="Vendedor"
                    propia={correo === acuerdo.vendedor}
                    mostrarTelefono
                  />
                </div>
                <p className="hu5-aviso">
                  Los teléfonos solo se muestran a las dos partes de este acuerdo.
                </p>
              </section>
              <HistorialAcuerdo
                acuerdo={acuerdo}
                oferta={oferta}
              />
              <a
                className="hu5-enlace hu5-enlace-negociacion"
                href={`/ofertas/${acuerdo.ofertaId}`}
              >
                Ver negociación original →
              </a>
            </div>

            <aside className="hu5-columna">
              <section className="hu5-panel hu5-codigo">
                <h2 className="hu5-etiqueta">Referencia del acuerdo</h2>
                <p title={acuerdo.id}>{referenciaAcuerdo(acuerdo.id)}</p>
                <span className="hu5-ayuda">
                  Identifica tu acuerdo al consultar o coordinar la entrega.
                </span>
              </section>
              <section className="hu5-panel hu5-confirmaciones">
                <h2 className="hu5-etiqueta">Confirmación de entrega</h2>
                {participantes.map((persona) => {
                  const confirmada = acuerdo.confirmaciones.includes(persona);
                  return (
                    <div
                      className={
                        'hu5-confirmacion' + (confirmada ? ' hu5-confirmacion-lista' : '')
                      }
                      key={persona}
                    >
                      <span aria-hidden="true">{confirmada ? '✓' : ''}</span>
                      <p>
                        {persona === correo
                          ? confirmada
                            ? 'Ya confirmaste tu parte'
                            : 'Tú aún no confirmas'
                          : `${nombrePersona(persona)} ${confirmada ? 'confirmó la entrega' : 'aún no confirma'}`}
                      </p>
                    </div>
                  );
                })}
                {puedoEntregar && (
                  <button
                    type="button"
                    className="hu5-boton hu5-boton-verde"
                    onClick={() => abrir('entregar')}
                  >
                    Confirmar entrega
                  </button>
                )}
                <p className="hu5-ayuda">
                  {acuerdo.estado === 'Cerrado'
                    ? 'Ambas partes confirmaron. El aviso está vendido.'
                    : 'Al confirmar ambos, el aviso pasa a vendido y se abre la calificación.'}
                </p>
              </section>
              {(puedoCoordinar || puedoAprobar) && (
                <section className="hu5-panel hu5-acciones-acuerdo">
                  {puedoCoordinar && (
                    <button
                      type="button"
                      className="hu5-boton hu5-boton-borde"
                      onClick={() => abrir('coordinar')}
                    >
                      {acuerdo.fecha
                        ? 'Modificar punto y horario'
                        : 'Proponer punto y horario'}
                    </button>
                  )}
                  {puedoAprobar && (
                    <button
                      type="button"
                      className="hu5-boton hu5-boton-verde"
                      onClick={() => abrir('aprobar')}
                    >
                      Aceptar punto y horario
                    </button>
                  )}
                  {puedoCoordinar && (
                    <button
                      type="button"
                      className="hu5-boton hu5-boton-cancelar"
                      onClick={() => abrir('cancelar')}
                    >
                      Cancelar el acuerdo
                    </button>
                  )}
                </section>
              )}
              {acuerdo.estado === 'Cancelado' && (
                <p className="hu5-alerta hu5-alerta-roja">
                  <strong>Acuerdo cancelado.</strong> {acuerdo.motivo}
                </p>
              )}
              {acuerdo.estado === 'Cerrado' && (
                <a
                  className="hu5-boton"
                  href="/calificaciones"
                >
                  Calificar a la contraparte
                </a>
              )}
            </aside>
          </div>
          {accion === 'cancelar' && puedoCoordinar && (
            <ModalCancelarAcuerdo
              acuerdo={acuerdo}
              cerrar={cerrar}
              confirmar={(motivo) => confirmar('cancelar', { motivo })}
              error={error}
              guardando={guardando}
            />
          )}
          {((accion === 'entregar' && puedoEntregar) ||
            (accion === 'aprobar' && puedoAprobar)) && (
            <Modal
              className={
                'hu5-modal' + (accion === 'entregar' ? ' hu5-modal-entrega' : '')
              }
              titulo={
                accion === 'entregar'
                  ? '¿Confirmas que la entrega se realizó?'
                  : 'Aceptar punto y horario'
              }
              cerrar={cerrar}
            >
              {accion === 'entregar' && (
                <p className="hu5-ayuda">
                  Acuerdo {referenciaAcuerdo(acuerdo.id)} · {acuerdo.punto} ·{' '}
                  {fechaEncuentro(acuerdo.fecha)} · {dinero(acuerdo.monto)}.
                </p>
              )}
              <p className="hu5-ayuda">
                {accion === 'entregar'
                  ? 'Confirma únicamente si ya entregaste o recibiste el producto. El acuerdo se cerrará cuando ambas personas confirmen.'
                  : `Confirmas el encuentro en ${acuerdo.punto}, el ${fechaLegible(acuerdo.fecha)}.`}
              </p>
              {error && (
                <p
                  className="hu5-alerta hu5-alerta-roja"
                  role="alert"
                >
                  {error}
                </p>
              )}
              <div className="hu5-modal-acciones">
                <button
                  type="button"
                  className="hu5-enlace"
                  onClick={cerrar}
                >
                  {accion === 'entregar' ? 'Todavía no' : 'Volver'}
                </button>
                <button
                  type="button"
                  className="hu5-boton hu5-boton-verde"
                  disabled={guardando}
                  onClick={() => confirmar(accion)}
                >
                  {guardando
                    ? 'Guardando…'
                    : accion === 'entregar'
                      ? 'Sí, se entregó'
                      : 'Confirmar'}
                </button>
              </div>
            </Modal>
          )}
        </>
      )}
    </Marco>
  );
}
