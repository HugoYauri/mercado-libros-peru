import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  obtenerAviso,
  listarFotos,
  alternarFavorito,
  favoritos,
} from '../../assets/js/compartido/storage.js';
import { usuarioActivo, perfilPublico } from '../../assets/js/compartido/sesion.js';
import { reputacion } from '../../assets/js/hu6/reputacion.js';
import BotonReporte from '../compartido/BotonReporte.jsx';
import { enviarOferta } from '../../assets/js/hu4/ofertas.js';
import Marco, { dinero, Modal, useNegociaciones } from '../compartido/Marco.jsx';

export default function DetalleAviso() {
  const [parametros] = useSearchParams();
  const id = parametros.get('id');
  const aviso = obtenerAviso(id);
  const usuario = usuarioActivo();
  const { ofertas } = useNegociaciones();
  const [fotos, setFotos] = useState([]);
  const [principal, setPrincipal] = useState(0);
  const [guardado, setGuardado] = useState(() => favoritos().includes(id));
  const [modal, setModal] = useState(false);
  const [monto, setMonto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const activa = ofertas.find(
    (oferta) =>
      oferta.avisoId === id &&
      oferta.comprador === usuario?.correo &&
      oferta.estado === 'Pendiente',
  );

  useEffect(() => {
    let cancelado = false;
    let urls = [];
    listarFotos(id)
      .then((archivos) => {
        if (cancelado) return;
        urls = archivos.map((archivo) => URL.createObjectURL(archivo));
        setFotos(urls);
      })
      .catch(() => setFotos([]));
    return () => {
      cancelado = true;
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [id]);

  function ingresar() {
    window.location.assign(
      '/ingresar?returnTo=' + encodeURIComponent(location.pathname + location.search),
    );
  }

  function guardarOferta(event) {
    event.preventDefault();
    try {
      const ofertaId = enviarOferta(id, monto, mensaje);
      window.location.assign('/ofertas/' + ofertaId);
    } catch (problema) {
      setError(problema.message);
    }
  }

  if (
    !aviso ||
    ['Borrador', 'Pausado', 'Retirado', 'Eliminado'].includes(aviso.status) ||
    perfilPublico(aviso.owner)?.bloqueado
  ) {
    return (
      <Marco titulo="Aviso no disponible">
        <a
          href="/catalogo"
          className="neg-boton"
        >
          Volver al catálogo
        </a>
      </Marco>
    );
  }

  return (
    <Marco
      titulo={aviso.title}
      descripcion={aviso.category + ' · ' + aviso.course}
    >
      <a href="/catalogo">← Catálogo</a>
      <div className="grid gap-8 lg:grid-cols-2">
        <section className="neg-tarjeta">
          {fotos.length ? (
            <>
              <img
                src={fotos[principal]}
                alt={aviso.title}
                className="h-80 w-full rounded-lg object-contain"
              />
              <div className="neg-acciones">
                {fotos.map((foto, indice) => (
                  <button
                    key={foto}
                    onClick={() => setPrincipal(indice)}
                    aria-label={'Ver fotografía ' + (indice + 1)}
                  >
                    <img
                      src={foto}
                      alt=""
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                  </button>
                ))}
              </div>
            </>
          ) : aviso.imagen ? (
            <img
              src={aviso.imagen}
              alt={aviso.title}
              className="h-80 w-full rounded-lg object-contain"
            />
          ) : (
            <div className="foto-ejemplo flex h-80 items-center justify-center rounded-lg">
              Sin fotografía disponible
            </div>
          )}
          <h2 className="mt-6">Descripción</h2>
          <p className="mt-3 leading-7">{aviso.description}</p>
        </section>
        <section className="neg-tarjeta">
          <span className="neg-estado">{aviso.status}</span>
          <p className="neg-precio">{dinero(aviso.price)}</p>
          <p>{aviso.condition}</p>
          <p className="neg-ayuda">
            Ofertas desde {dinero(aviso.minimum || aviso.price)}
          </p>
          <h2>Vendedor</h2>
          <p>{perfilPublico(aviso.owner)?.nombres || 'Estudiante'}</p>
          <p>
            {reputacion(aviso.owner).recibidas.length
              ? reputacion(aviso.owner).promedio.toFixed(1) + ' ★'
              : 'Sin calificaciones todavía'}
          </p>
          <p className="my-3 break-all">{aviso.owner}</p>
          <a href={'/vendedor?correo=' + encodeURIComponent(aviso.owner)}>Ver perfil</a>
          <div className="neg-acciones">
            {aviso.status === 'Publicado' &&
              aviso.owner !== usuario?.correo &&
              (activa ? (
                <a
                  className="neg-boton"
                  href={'/ofertas/' + activa.id}
                >
                  Ver mi oferta activa
                </a>
              ) : (
                <button
                  className="neg-boton"
                  onClick={() => (usuario ? setModal(true) : ingresar())}
                >
                  {usuario ? 'Hacer oferta' : 'Ingresar para ofertar'}
                </button>
              ))}
            {usuario?.correo === aviso.owner && (
              <a
                className="neg-boton"
                href="/ofertas"
              >
                Ver ofertas recibidas
              </a>
            )}
            <button
              className="neg-secundario"
              onClick={() => (usuario ? setGuardado(alternarFavorito(id)) : ingresar())}
            >
              {guardado ? '♥ Guardado' : '♡ Guardar favorito'}
            </button>
          </div>
          {aviso.status !== 'Publicado' && (
            <p className="neg-ayuda">Este aviso no admite nuevas ofertas.</p>
          )}
          {usuario?.correo !== aviso.owner && (
            <div className="neg-acciones">
              <BotonReporte
                tipo="Aviso"
                objetivo={aviso.id}
              />
            </div>
          )}
        </section>
      </div>
      {modal && (
        <Modal
          titulo="Enviar oferta"
          cerrar={() => setModal(false)}
        >
          <form onSubmit={guardarOferta}>
            <p className="neg-ayuda">
              Propón un monto entre {dinero(aviso.minimum || aviso.price)} y{' '}
              {dinero(aviso.price)}.
            </p>
            <label>
              Monto en soles
              <input
                required
                type="number"
                step="0.01"
                min={aviso.minimum || aviso.price}
                max={aviso.price}
                value={monto}
                onChange={(event) => setMonto(event.target.value)}
              />
            </label>
            <label>
              Mensaje opcional
              <textarea
                rows={3}
                maxLength={300}
                value={mensaje}
                onChange={(event) => setMensaje(event.target.value)}
              />
            </label>
            {error && (
              <p
                className="neg-error"
                role="alert"
              >
                {error}
              </p>
            )}
            <div className="neg-acciones">
              <button className="neg-boton">Enviar oferta</button>
              <button
                type="button"
                className="neg-secundario"
                onClick={() => setModal(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </Modal>
      )}
    </Marco>
  );
}
