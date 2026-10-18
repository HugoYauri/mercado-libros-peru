import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { usuarioActivo } from '../../assets/js/compartido/sesion.js';
import { esParticipante, responderOferta } from '../../assets/js/hu4/ofertas.js';
import Marco, {
  dinero,
  fechaLegible,
  Modal,
  useNegociaciones,
} from '../compartido/Marco.jsx';

export default function DetalleOferta() {
  const { id } = useParams();
  const { ofertas, acuerdos } = useNegociaciones();
  const correo = usuarioActivo().correo;
  const oferta = ofertas.find((item) => item.id === id && esParticipante(item, correo));
  const [accion, setAccion] = useState('');
  const [monto, setMonto] = useState('');
  const [comentario, setComentario] = useState('');
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const acuerdo = acuerdos.find((item) => item.ofertaId === id);

  function confirmar(event) {
    event.preventDefault();
    try {
      responderOferta(id, accion, monto, comentario);
      setAccion('');
      setError('');
      setAviso('La respuesta quedó guardada.');
    } catch (problema) {
      setError(problema.message);
    }
  }

  if (!oferta)
    return (
      <Marco titulo="Oferta no disponible">
        <p className="neg-error">No existe esta oferta o no participas en ella.</p>
        <a href="/ofertas">Volver a ofertas</a>
      </Marco>
    );

  return (
    <Marco
      titulo="Hilo de negociación"
      descripcion={oferta.titulo}
    >
      <a href="/ofertas">← Volver a ofertas</a>
      {aviso && (
        <p
          role="status"
          className="neg-exito"
        >
          {aviso}
        </p>
      )}
      <section className="neg-tarjeta">
        <div className="neg-fila">
          <h2>Propuesta actual: {dinero(oferta.monto)}</h2>
          <span className="neg-estado">{oferta.estado}</span>
        </div>
        <p className="neg-ayuda">
          Comprador: {oferta.comprador}
          <br />
          Vendedor: {oferta.vendedor}
        </p>
        <a href={`/aviso?id=${oferta.avisoId}`}>Ver publicación</a>
        <ol className="neg-historial">
          {oferta.historial.map((evento) => (
            <li key={evento.id}>
              <strong>{evento.autor === correo ? 'Tú' : evento.autor}</strong>
              <time dateTime={evento.fecha}>{fechaLegible(evento.fecha)}</time>
              <p>{evento.texto}</p>
              {evento.monto != null && <p>{dinero(evento.monto)}</p>}
            </li>
          ))}
        </ol>
        {oferta.estado === 'Pendiente' && (
          <div className="neg-acciones">
            {(oferta.turno === correo ? ['aceptar', 'contraofertar', 'rechazar'] : [])
              .concat(oferta.comprador === correo ? ['retirar'] : [])
              .map((tipo) => (
                <button
                  key={tipo}
                  className={tipo === 'aceptar' ? 'neg-boton' : 'neg-secundario'}
                  onClick={() => {
                    setAccion(tipo);
                    setError('');
                    setMonto(String(oferta.monto));
                  }}
                >
                  {
                    {
                      aceptar: 'Aceptar propuesta',
                      contraofertar: 'Contraofertar',
                      rechazar: 'Rechazar',
                      retirar: 'Retirar oferta',
                    }[tipo]
                  }
                </button>
              ))}
          </div>
        )}
        {acuerdo && (
          <a
            className="neg-boton"
            href={`/acuerdos/${acuerdo.id}`}
          >
            Ver acuerdo de entrega
          </a>
        )}
      </section>
      {accion && (
        <Modal
          titulo={
            {
              aceptar: 'Aceptar propuesta',
              contraofertar: 'Enviar contraoferta',
              rechazar: 'Rechazar propuesta',
              retirar: 'Retirar oferta',
            }[accion]
          }
          cerrar={() => setAccion('')}
        >
          <form onSubmit={confirmar}>
            <p className="neg-ayuda">
              {accion === 'aceptar'
                ? `Se reservará el aviso por ${dinero(oferta.monto)} y se generará un acuerdo de entrega.`
                : 'Confirma tu respuesta a esta negociación.'}
            </p>
            {accion === 'contraofertar' && (
              <>
                <label>
                  Monto en soles
                  <input
                    required
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={monto}
                    onChange={(event) => setMonto(event.target.value)}
                  />
                </label>
                <label>
                  Mensaje opcional
                  <textarea
                    maxLength={300}
                    rows={3}
                    value={comentario}
                    onChange={(event) => setComentario(event.target.value)}
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
