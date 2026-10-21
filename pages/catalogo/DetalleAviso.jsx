import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  avisos,
  obtenerAviso,
  listarFotos,
  alternarFavorito,
  favoritos,
} from '../../assets/js/compartido/storage.js';
import { usuarioActivo, perfilPublico } from '../../assets/js/compartido/sesion.js';
import { reputacion } from '../../assets/js/hu6/reputacion.js';
import BotonReporte from '../compartido/BotonReporte.jsx';
import TarjetaAviso from '../compartido/TarjetaAviso.jsx';
import Marco, { dinero, useNegociaciones } from '../compartido/Marco.jsx';
import ModalOferta from '../ofertas/ModalOferta.jsx';
import '../../assets/css/catalogo.css';
import '../../assets/css/ofertas.css';

function iniciales(usuario) {
  if (!usuario) return 'ES';
  return `${usuario.nombres?.[0] || ''}${usuario.apellidos?.[0] || ''}`.toUpperCase();
}

function fechaCorta(fecha) {
  if (!fecha) return 'Fecha no disponible';
  const valor = fecha.includes('/')
    ? (() => {
        const [dia, mes, anio] = fecha.split('/');
        return new Date(Number(anio), Number(mes) - 1, Number(dia));
      })()
    : new Date(fecha);
  return Number.isNaN(valor.getTime()) ? 'Fecha no disponible' : valor.toLocaleDateString('es-PE');
}

export default function DetalleAviso() {
  const [parametros] = useSearchParams();
  const id = parametros.get('id');
  const aviso = obtenerAviso(id);
  const usuario = usuarioActivo();
  const { ofertas, acuerdos } = useNegociaciones();
  const [fotos, setFotos] = useState([]);
  const [principal, setPrincipal] = useState(0);
  const [guardado, setGuardado] = useState(() => favoritos().includes(id));
  const [modalOferta, setModalOferta] = useState('');
  const [mensajeLocal, setMensajeLocal] = useState('');

  useEffect(() => {
    let cancelado = false;
    let urls = [];
    listarFotos(id)
      .then((archivos) => {
        if (cancelado) return;
        urls = archivos.map((archivo) => URL.createObjectURL(archivo));
        setFotos(urls);
        setPrincipal(0);
      })
      .catch(() => setFotos([]));
    return () => {
      cancelado = true;
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [id]);

  const activa = ofertas.find(
    (oferta) =>
      oferta.avisoId === id &&
      oferta.comprador === usuario?.correo &&
      oferta.estado === 'Pendiente',
  );
  const vendedor = aviso ? perfilPublico(aviso.owner) : null;
  const reputacionVendedor = aviso ? reputacion(aviso.owner) : { recibidas: [], promedio: 0 };
  const acuerdosCerrados = acuerdos.filter(
    (acuerdo) =>
      acuerdo.estado === 'Cerrado' &&
      (acuerdo.comprador === aviso?.owner || acuerdo.vendedor === aviso?.owner),
  ).length;
  const cursosSimilares = useMemo(
    () =>
      aviso
        ? avisos()
            .filter(
              (otro) =>
                otro.id !== aviso.id &&
                otro.course === aviso.course &&
                ['Publicado', 'Vendido'].includes(otro.status),
            )
            .slice(0, 3)
        : [],
    [id, aviso?.status],
  );

  function ingresar() {
    window.location.assign(
      '/ingresar?returnTo=' + encodeURIComponent(location.pathname + location.search),
    );
  }

  function alternarGuardado() {
    if (!usuario) {
      ingresar();
      return;
    }
    setGuardado(alternarFavorito(id));
  }

  if (
    !aviso ||
    ['Borrador', 'Pausado', 'Retirado', 'Eliminado'].includes(aviso.status) ||
    perfilPublico(aviso.owner)?.bloqueado
  ) {
    return (
      <Marco
        catalogo
        titulo="Aviso no disponible"
        descripcion="Esta publicación no está disponible en este momento."
      >
        <a
          href="/catalogo"
          className="hu3-boton"
        >
          Volver al catálogo
        </a>
      </Marco>
    );
  }

  const fotoAlternativa =
    aviso.imagen && aviso.imagen !== '/imagenes/libro.svg' ? aviso.imagen : '';
  const tieneFotos = fotos.length > 0 || Boolean(fotoAlternativa);
  const fotoActual = fotos[principal] || fotoAlternativa;
  const nombreVendedor = vendedor
    ? `${vendedor.nombres} ${vendedor.apellidos}`
    : 'Estudiante vendedor';
  const categoriaUrl = `/catalogo?categoria=${encodeURIComponent(aviso.category)}&curso=${encodeURIComponent(aviso.course)}`;

  return (
    <Marco
      catalogo
      sinTitulo
      migas={
        <>
          <a href="/catalogo">Catálogo</a>
          <span>›</span>
          <a href={`/catalogo?categoria=${encodeURIComponent(aviso.category)}`}>{aviso.category}</a>
          <span>›</span>
          <span>{aviso.course}</span>
        </>
      }
    >
      {mensajeLocal && (
        <p
          className="hu3-mensaje-exito"
          role="status"
        >
          {mensajeLocal}
        </p>
      )}
      <div className="hu3-detalle">
        <div className="hu3-columna">
          <section className="hu3-panel hu3-galeria-panel" aria-label="Fotografías del aviso">
            <div className="hu3-galeria-principal">
              {tieneFotos ? (
                <img
                  src={fotoActual}
                  alt={`${aviso.title}, fotografía ${principal + 1}`}
                />
              ) : (
                <span>fotografía principal · {aviso.title}</span>
              )}
              {aviso.status === 'Vendido' && (
                <span className="hu3-etiqueta-vendido-detalle">Vendido</span>
              )}
            </div>
            {fotos.length > 1 && (
              <div className="hu3-miniaturas" aria-label="Seleccionar fotografía">
                {fotos.map((foto, indice) => (
                  <button
                    key={foto}
                    type="button"
                    aria-label={`Ver fotografía ${indice + 1}`}
                    aria-pressed={principal === indice}
                    onClick={() => setPrincipal(indice)}
                  >
                    <img src={foto} alt="" />
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="hu3-panel hu3-descripcion">
            <h2>Descripción</h2>
            <p>{aviso.description}</p>
            <dl className="hu3-metadatos">
              <div>
                <dt>Categoría</dt>
                <dd>{aviso.category}</dd>
              </div>
              <div>
                <dt>Curso</dt>
                <dd>{aviso.course}</dd>
              </div>
              <div>
                <dt>Estado</dt>
                <dd>{aviso.condition}</dd>
              </div>
              <div>
                <dt>Publicado</dt>
                <dd>{fechaCorta(aviso.published)}</dd>
              </div>
            </dl>
          </section>

          {aviso.status === 'Vendido' && cursosSimilares.length > 0 && (
            <section className="hu3-seccion">
              <div className="hu3-seccion-cabecera">
                <h2>Avisos similares del mismo curso</h2>
                <a className="hu3-enlace" href={categoriaUrl}>Ver todos</a>
              </div>
              <div className="hu3-rejilla-productos hu3-rejilla-similares">
                {cursosSimilares.map((similar) => (
                  <TarjetaAviso
                    key={similar.id}
                    aviso={similar}
                    variant="hu3"
                  />
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="hu3-columna-derecha">
          <section className="hu3-panel hu3-resumen-aviso">
            <span
              className={
                'hu3-etiqueta-estado' +
                (aviso.status === 'Vendido'
                  ? ' vendido'
                  : aviso.status === 'Reservado'
                    ? ' reservado'
                    : '')
              }
            >
              {aviso.status}
            </span>
            <h1>{aviso.title}</h1>
            <p className="hu3-precio-grande">{dinero(aviso.price)}</p>
            <p className="hu3-resumen-secundario">
              {aviso.acceptsOffers === false
                ? 'No acepta ofertas'
                : `Acepta ofertas desde ${dinero(aviso.minimum || aviso.price)}`}
            </p>

            {aviso.status === 'Vendido' ? (
              <div className="hu3-acciones-detalle">
                <p className="hu3-aviso-informativo">
                  Este aviso ya se cerró y no acepta ofertas. Puedes ver avisos parecidos del mismo
                  curso o crear una alerta para esta búsqueda.
                </p>
                <a
                  className="hu3-boton"
                  href={categoriaUrl}
                >
                  Ver avisos de {aviso.course}
                </a>
                <button
                  type="button"
                  className="hu3-boton hu3-boton-borde"
                  onClick={() => setMensajeLocal('Alerta de búsqueda preparada para esta sesión.')}
                >
                  Crear alerta de búsqueda
                </button>
              </div>
            ) : aviso.status === 'Reservado' ? (
              <p className="hu3-aviso-informativo">
                Esta publicación está reservada mientras se coordina una entrega.
              </p>
            ) : !usuario ? (
              <div className="hu3-acciones-detalle">
                <p className="hu3-aviso-informativo">
                  Inicia sesión con tu correo institucional para ofertar o guardar este aviso en
                  favoritos.
                </p>
                <button
                  type="button"
                  className="hu3-boton"
                  onClick={ingresar}
                >
                  Ingresar para ofertar
                </button>
                <button
                  type="button"
                  className="hu3-boton hu3-boton-borde"
                  onClick={alternarGuardado}
                >
                  ♥ Guardar en favoritos
                </button>
              </div>
            ) : activa ? (
              <div className="hu3-oferta-activa">
                <div className="hu3-oferta-activa-cabecera">
                  <span className="hu3-etiqueta-estado">Oferta enviada</span>
                  <time>{fechaCorta(activa.historial.at(-1)?.fecha)}</time>
                </div>
                <strong>{dinero(activa.monto)}</strong>
                <p>El vendedor todavía no responde. Solo se admite una oferta activa por aviso.</p>
                <div className="hu3-acciones-en-linea">
                  <a
                    className="hu3-boton"
                    href={`/ofertas/${activa.id}`}
                  >
                    Ver el hilo
                  </a>
                  <button
                    type="button"
                    className="hu3-boton hu3-boton-borde"
                    onClick={() => setModalOferta('retirar')}
                  >
                    Retirar oferta
                  </button>
                </div>
              </div>
            ) : aviso.owner === usuario?.correo ? (
              <div className="hu3-acciones-detalle">
                <a
                  className="hu3-boton"
                  href="/ofertas"
                >
                  Ver ofertas recibidas
                </a>
              </div>
            ) : (
              <div className="hu3-acciones-detalle">
                <button
                  type="button"
                  className="hu3-boton"
                  onClick={() => setModalOferta('nueva')}
                >
                  Hacer oferta
                </button>
                <button
                  type="button"
                  className="hu3-boton hu3-boton-borde"
                  aria-pressed={guardado}
                  onClick={alternarGuardado}
                >
                  {guardado ? '♥ Guardado en favoritos' : '♥ Guardar en favoritos'}
                </button>
              </div>
            )}
          </section>

          <section className="hu3-panel hu3-tarjeta-vendedor">
            <p className="hu3-etiqueta-seccion">Vendedor</p>
            <div className="hu3-persona">
              <span className="hu3-persona-avatar" aria-hidden="true">
                {iniciales(vendedor)}
              </span>
              <div className="hu3-persona-datos">
                <strong>{nombreVendedor}</strong>
                <p>
                  {vendedor?.carrera || 'Estudiante'} · {acuerdosCerrados} acuerdos cerrados
                </p>
              </div>
            </div>
            <div className="hu3-vendedor-resumen">
              <strong>
                {reputacionVendedor.recibidas.length
                  ? `${reputacionVendedor.promedio.toFixed(1)} ★`
                  : 'Sin calificaciones'}
              </strong>
              <span>
                {reputacionVendedor.recibidas.length
                  ? `${reputacionVendedor.recibidas.length} calificaciones recibidas`
                  : 'Aún no tiene opiniones'}
              </span>
              {reputacionVendedor.promedio >= 4.5 && (
                <span className="hu3-insignia-confiable">Vendedor confiable</span>
              )}
            </div>
            <a
              className="hu3-enlace"
              href={'/vendedor?correo=' + encodeURIComponent(aviso.owner)}
            >
              Ver perfil y sus avisos →
            </a>
          </section>

          {usuario?.correo !== aviso.owner && (
            <section className="hu3-panel hu3-reporte">
              <span>¿Este aviso incumple las normas del tablón?</span>
              <BotonReporte
                tipo="Aviso"
                objetivo={aviso.id}
              />
            </section>
          )}
        </aside>
      </div>

      {(modalOferta === 'nueva' || modalOferta === 'retirar') && (
        <ModalOferta
          aviso={aviso}
          oferta={modalOferta === 'retirar' ? activa : undefined}
          modo={modalOferta === 'nueva' ? 'nueva' : 'respuesta'}
          accion={modalOferta}
          cerrar={() => setModalOferta('')}
          completar={(ofertaId) => {
            setModalOferta('');
            if (ofertaId) window.location.assign('/ofertas/' + ofertaId);
            else setMensajeLocal('Oferta retirada. Ya puedes enviar otra propuesta.');
          }}
        />
      )}
    </Marco>
  );
}
