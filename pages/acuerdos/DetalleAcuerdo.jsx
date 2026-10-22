import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Marco, { dinero, Modal } from '../compartido/Marco.jsx';
import Enlace from '../compartido/Enlace.jsx';
import { EstadoAcuerdo, FotoAcuerdo, PersonaAcuerdo } from './ComponentesAcuerdo.jsx';
import CoordinarEntrega from './CoordinarEntrega.jsx';
import ModalCancelarAcuerdo from './ModalCancelarAcuerdo.jsx';
import '../../assets/css/acuerdos.css';

export default function DetalleAcuerdo() {
  const ejemplos = [
    {
      titulo: 'Cálculo de una variable — Stewart, 8.ª ed.',
      monto: 88,
      estado: 'Por coordinar',
      punto: '',
      fecha: '',
    },
    {
      titulo: 'Calculadora científica ClassWiz fx-991',
      monto: 110,
      estado: 'Propuesta recibida',
      punto: 'Biblioteca central',
      fecha: '30 de agosto · 14:00',
    },
    {
      titulo: 'Juego de escuadras y escalímetro Faber',
      monto: 35,
      estado: 'Acordado',
      punto: 'Pabellón A',
      fecha: '30 de agosto · 10:00',
    },
    {
      titulo: 'Física para ciencias e ingeniería — Serway',
      monto: 100,
      estado: 'Entregado',
      punto: 'Biblioteca central',
      fecha: '25 de agosto · 10:00',
    },
    {
      titulo: 'Mandil de laboratorio talla M',
      monto: 40,
      estado: 'Cancelado',
      punto: '',
      fecha: '',
    },
  ];
  const { id } = useParams();
  const [parametros] = useSearchParams();
  const [acuerdo, setAcuerdo] = useState(ejemplos[Number(id) - 1] || ejemplos[0]);
  const [vista, setVista] = useState(
    parametros.get('vista') === 'coordinar' ? 'coordinar' : 'detalle',
  );
  const [modal, setModal] = useState(
    parametros.get('vista') === 'calificar' && acuerdo.estado === 'Entregado' ? 'calificar' : '',
  );
  const puntajes = [5, 4, 3, 2, 1];
  const [mensaje, setMensaje] = useState('');
  const cerrado = ['Entregado', 'Cancelado'].includes(acuerdo.estado);
  function actualizar(nuevo) {
    setAcuerdo(nuevo);
    setModal('');
    setVista('detalle');
    setMensaje('Ejemplo de acuerdo actualizado.');
  }
  return (
    <Marco
      historia="hu5"
      titulo={vista === 'coordinar' ? 'Coordinar encuentro' : 'Detalle del acuerdo'}
      acciones={<EstadoAcuerdo estado={acuerdo.estado} />}
      migas={<Enlace href="/acuerdos">← Mis acuerdos</Enlace>}
    >
      {mensaje && (
        <p className="hu5-alerta hu5-alerta-azul" role="status">
          {mensaje}
        </p>
      )}
      {vista === 'coordinar' ? (
        <CoordinarEntrega
          acuerdo={acuerdo}
          confirmar={actualizar}
          volver={() => setVista('detalle')}
        />
      ) : (
        <div className="hu5-detalle">
          <div className="hu5-columna">
            <section className="hu5-panel hu5-producto">
              <FotoAcuerdo titulo={acuerdo.titulo} />
              <div className="hu5-producto-descripcion">
                <h2>{acuerdo.titulo}</h2>
                <p className="hu5-texto-secundario">Producto académico · Buen estado</p>
                <div className="hu5-precio-fila">
                  <p className="hu5-precio">{dinero(acuerdo.monto)}</p>
                  <small>monto acordado</small>
                </div>
              </div>
            </section>
            <section className="hu5-panel">
              <h2>Datos del encuentro</h2>
              <dl className="hu5-datos-encuentro">
                <div>
                  <dt className="hu5-etiqueta">Punto de encuentro</dt>
                  <dd>{acuerdo.punto || 'Pendiente de coordinar'}</dd>
                </div>
                <div>
                  <dt className="hu5-etiqueta">Fecha y hora</dt>
                  <dd>{acuerdo.fecha || 'Sin definir'}</dd>
                </div>
              </dl>
              <div className="hu5-participantes">
                <PersonaAcuerdo
                  nombre="Estudiante de ejemplo"
                  iniciales="EE"
                  rol="Comprador"
                  propia
                />
                <PersonaAcuerdo nombre="María García" iniciales="MG" rol="Vendedor" />
              </div>
              <p className="hu5-aviso">Datos ilustrativos para revisar esta interfaz.</p>
            </section>
            <section className="hu5-panel">
              <h2>Situación del acuerdo</h2>
              <p>{acuerdo.estado}</p>
              <p className="hu5-ayuda">La coordinación se revisa dentro de esta HU.</p>
            </section>
          </div>
          <aside className="hu5-columna">
            <section className="hu5-panel hu5-codigo">
              <h2 className="hu5-etiqueta">Referencia del acuerdo</h2>
              <p>AC-00{id || 1}</p>
              <span className="hu5-ayuda">
                Identifica tu acuerdo al consultar o coordinar la entrega.
              </span>
            </section>
            <section className="hu5-panel hu5-confirmaciones">
              <h2 className="hu5-etiqueta">Confirmación de entrega</h2>
              {['Tú', 'María García'].map((nombre) => (
                <div
                  key={nombre}
                  className={
                    'hu5-confirmacion' +
                    (acuerdo.estado === 'Entregado' ? ' hu5-confirmacion-lista' : '')
                  }
                >
                  <span>{acuerdo.estado === 'Entregado' ? '✓' : ''}</span>
                  <p>
                    {nombre}:{' '}
                    {acuerdo.estado === 'Entregado'
                      ? 'entrega confirmada'
                      : 'pendiente de confirmación'}
                  </p>
                </div>
              ))}
              {acuerdo.estado === 'Acordado' && (
                <button className="hu5-boton hu5-boton-verde" onClick={() => setModal('entregar')}>
                  Confirmar entrega
                </button>
              )}
              <p className="hu5-ayuda">Confirma únicamente después de realizar el encuentro.</p>
            </section>
            {!cerrado && (
              <section className="hu5-panel hu5-acciones-acuerdo">
                <button className="hu5-boton hu5-boton-borde" onClick={() => setVista('coordinar')}>
                  {acuerdo.punto ? 'Modificar punto y horario' : 'Proponer punto y horario'}
                </button>
                {acuerdo.estado === 'Propuesta recibida' && (
                  <button
                    className="hu5-boton hu5-boton-verde"
                    onClick={() => actualizar({ ...acuerdo, estado: 'Acordado' })}
                  >
                    Aceptar punto y horario
                  </button>
                )}
                <button
                  className="hu5-boton hu5-boton-cancelar"
                  onClick={() => setModal('cancelar')}
                >
                  Cancelar el acuerdo
                </button>
              </section>
            )}
            {acuerdo.estado === 'Cancelado' && (
              <p className="hu5-alerta hu5-alerta-roja">Acuerdo cancelado. {acuerdo.motivo}</p>
            )}
          </aside>
        </div>
      )}
      {modal === 'cancelar' && (
        <ModalCancelarAcuerdo
          cerrar={() => setModal('')}
          confirmar={(motivo) => actualizar({ ...acuerdo, estado: 'Cancelado', motivo })}
        />
      )}
      {modal === 'entregar' && (
        <Modal titulo="Confirmar entrega" cerrar={() => setModal('')} className="hu5-modal">
          <p>¿Ya recibiste el producto? La confirmación se aplica a este ejemplo.</p>
          <div className="hu5-modal-acciones">
            <button className="hu5-boton hu5-boton-borde" onClick={() => setModal('')}>
              Volver
            </button>
            <button
              className="hu5-boton hu5-boton-verde"
              onClick={() => actualizar({ ...acuerdo, estado: 'Entregado' })}
            >
              Confirmar
            </button>
          </div>
        </Modal>
      )}
      {modal === 'calificar' && (
        <Modal
          titulo="Calificar a la contraparte"
          cerrar={() => setModal('')}
          className="hu5-modal"
        >
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setMensaje('Calificación del ejemplo preparada.');
              setModal('');
            }}
          >
            <label>
              Puntaje
              <select name="puntaje" required defaultValue="">
                <option value="">Selecciona estrellas</option>
                {puntajes.map((valor) => (
                  <option key={valor} value={valor}>
                    {valor} ★
                  </option>
                ))}
              </select>
            </label>
            <label>
              Comentario opcional
              <textarea rows={3} maxLength={300} />
            </label>
            <div className="hu5-modal-acciones">
              <button
                type="button"
                className="hu5-boton hu5-boton-borde"
                onClick={() => setModal('')}
              >
                Cancelar
              </button>
              <button className="hu5-boton">Enviar calificación</button>
            </div>
          </form>
        </Modal>
      )}
    </Marco>
  );
}
