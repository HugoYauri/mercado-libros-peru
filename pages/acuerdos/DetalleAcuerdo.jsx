import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { usuarioActivo } from '../../assets/js/compartido/sesion.js';
import { esParticipante } from '../../assets/js/hu4/ofertas.js';
import { actualizarAcuerdo, puntosCampus } from '../../assets/js/hu5/acuerdos.js';
import Marco, {
  dinero,
  fechaLegible,
  Modal,
  useNegociaciones,
} from '../compartido/Marco.jsx';

export default function DetalleAcuerdo() {
  const { id } = useParams();
  const { acuerdos } = useNegociaciones();
  const correo = usuarioActivo().correo;
  const acuerdo = acuerdos.find((item) => item.id === id && esParticipante(item, correo));
  const [accion, setAccion] = useState('');
  const [punto, setPunto] = useState(puntosCampus[0]);
  const [motivo, setMotivo] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  function confirmar(event) {
    event.preventDefault();
    try {
      const formulario = new FormData(event.currentTarget);
      actualizarAcuerdo(id, accion, {
        punto,
        fecha: formulario.get('fecha'),
        motivo,
      });
      setAccion('');
      setError('');
      setMensaje('El acuerdo se actualizó correctamente.');
    } catch (problema) {
      setError(problema.message);
    }
  }

  if (!acuerdo)
    return (
      <Marco titulo="Acuerdo no disponible">
        <p className="neg-error">No existe este acuerdo o no participas en él.</p>
        <a href="/acuerdos">Volver a acuerdos</a>
      </Marco>
    );
  const terminado = ['Cerrado', 'Cancelado'].includes(acuerdo.estado);
  const opciones = [];
  if (!terminado) {
    if (!acuerdo.confirmaciones.length)
      opciones.push(['coordinar', 'Proponer punto y horario']);
    if (acuerdo.fecha && !acuerdo.aprobaciones.includes(correo))
      opciones.push(['aprobar', 'Aceptar punto y horario']);
    if (acuerdo.aprobaciones.length === 2 && !acuerdo.confirmaciones.includes(correo))
      opciones.push(['entregar', 'Confirmar mi entrega']);
    if (!acuerdo.confirmaciones.length) opciones.push(['cancelar', 'Cancelar acuerdo']);
  }

  return (
    <Marco
      titulo="Detalle del acuerdo"
      descripcion={acuerdo.titulo}
    >
      <a href="/acuerdos">← Mis acuerdos</a>
      {mensaje && (
        <p
          className="neg-exito"
          role="status"
        >
          {mensaje}
        </p>
      )}
      <section className="neg-tarjeta">
        <div className="neg-fila">
          <h2>{dinero(acuerdo.monto)}</h2>
          <span className="neg-estado">{acuerdo.estado}</span>
        </div>
        <dl className="neg-datos">
          <div>
            <dt>Comprador</dt>
            <dd>{acuerdo.comprador}</dd>
          </div>
          <div>
            <dt>Vendedor</dt>
            <dd>{acuerdo.vendedor}</dd>
          </div>
          <div>
            <dt>Punto de encuentro</dt>
            <dd>{acuerdo.punto || 'Pendiente de coordinar'}</dd>
          </div>
          <div>
            <dt>Fecha y hora local</dt>
            <dd>
              {acuerdo.fecha ? fechaLegible(acuerdo.fecha) : 'Pendiente de coordinar'}
            </dd>
          </div>
          <div>
            <dt>Aprobaciones del horario</dt>
            <dd>{acuerdo.aprobaciones.length} de 2</dd>
          </div>
          <div>
            <dt>Confirmaciones de entrega</dt>
            <dd>{acuerdo.confirmaciones.length} de 2</dd>
          </div>
        </dl>
        {acuerdo.confirmaciones.includes(correo) && !terminado && (
          <p className="neg-exito">
            Ya confirmaste. Falta que la otra persona confirme para cerrar el acuerdo.
          </p>
        )}
        {acuerdo.estado === 'Cerrado' && (
          <p className="neg-exito">
            Ambas partes confirmaron. El aviso está marcado como vendido.
          </p>
        )}
        {acuerdo.estado === 'Cancelado' && (
          <p className="neg-error">Motivo de cancelación: {acuerdo.motivo}</p>
        )}
        <a href={`/ofertas/${acuerdo.ofertaId}`}>Ver negociación original</a>
        {acuerdo.estado === 'Cerrado' && (
          <div className="neg-acciones">
            <a
              className="neg-boton"
              href="/calificaciones"
            >
              Calificar a la contraparte
            </a>
          </div>
        )}
        <div className="neg-acciones">
          {opciones.map(([tipo, etiqueta]) => (
            <button
              key={tipo}
              className={tipo === 'cancelar' ? 'neg-secundario' : 'neg-boton'}
              onClick={() => {
                setError('');
                setAccion(tipo);
              }}
            >
              {etiqueta}
            </button>
          ))}
        </div>
      </section>
      {accion && (
        <Modal
          titulo={
            {
              coordinar: 'Coordinar entrega',
              aprobar: 'Aceptar horario',
              entregar: 'Confirmar entrega',
              cancelar: 'Cancelar acuerdo',
            }[accion]
          }
          cerrar={() => setAccion('')}
        >
          <form onSubmit={confirmar}>
            {accion === 'coordinar' && (
              <>
                <p className="neg-ayuda">
                  La otra persona deberá aceptar esta propuesta. Si cambias el horario,
                  tendrá que aceptarlo de nuevo.
                </p>
                <label>
                  Punto dentro del campus
                  <select
                    value={punto}
                    onChange={(event) => setPunto(event.target.value)}
                  >
                    {puntosCampus.map((valor) => (
                      <option key={valor}>{valor}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Fecha y hora local
                  <input
                    required
                    type="datetime-local"
                    name="fecha"
                  />
                </label>
              </>
            )}
            {accion === 'aprobar' && (
              <p className="neg-ayuda">
                Confirmas el encuentro en {acuerdo.punto}, el{' '}
                {fechaLegible(acuerdo.fecha)}.
              </p>
            )}
            {accion === 'entregar' && (
              <p className="neg-ayuda">
                Confirma únicamente si ya entregaste o recibiste el producto. El acuerdo
                se cerrará cuando ambas personas confirmen.
              </p>
            )}
            {accion === 'cancelar' && (
              <>
                <p className="neg-ayuda">
                  El aviso volverá a estar disponible para recibir nuevas ofertas.
                </p>
                <label>
                  Motivo
                  <textarea
                    required
                    minLength={10}
                    maxLength={300}
                    rows={4}
                    value={motivo}
                    onChange={(event) => setMotivo(event.target.value)}
                  />
                </label>
              </>
            )}
            {error && (
              <p
                role="alert"
                className="neg-error"
              >
                {error}
              </p>
            )}
            <div className="neg-acciones">
              <button className="neg-boton">Confirmar</button>
              <button
                type="button"
                className="neg-secundario"
                onClick={() => setAccion('')}
              >
                Volver
              </button>
            </div>
          </form>
        </Modal>
      )}
    </Marco>
  );
}
