import { useEffect, useState } from 'react';
import { avisos, listarFotos } from '../../assets/js/compartido/storage.js';
import { usuarioActivo } from '../../assets/js/compartido/sesion.js';
import { cambiarEstadoPublicacion } from '../../assets/js/hu2/publicaciones.js';
import Marco, { dinero, useNegociaciones } from '../compartido/Marco.jsx';
import ModalesPublicacion from './ModalesPublicacion.jsx';
import '../../assets/css/publicaciones.css';

const filtros = [
  ['Todos', 'Todos'],
  ['Publicado', 'Publicados'],
  ['Pausado', 'Pausados'],
  ['Borrador', 'Borradores'],
  ['Vendido', 'Vendidos'],
  ['Reservado', 'Reservados'],
  ['Retirado', 'Retirados'],
];
const avisosPorPagina = 6;
const estadosNoEditables = ['Reservado', 'Vendido', 'Retirado'];

function contarOfertas(ofertas, estado) {
  return ofertas.filter((oferta) => oferta.estado === estado).length;
}

function mensajeOfertasSinPendientes(estadoAviso, aceptadas) {
  if (estadoAviso === 'Borrador') return '—';
  if (aceptadas > 0) return `Cerrado con ${aceptadas}`;
  return 'Sin ofertas';
}

function obtenerDescripcion(propias, porResponder) {
  if (propias.length === 0) return 'Ningún aviso todavía';
  const textoAvisos = propias.length === 1 ? 'aviso' : 'avisos';
  const textoOfertas = porResponder === 1 ? 'oferta' : 'ofertas';
  return `${propias.length} ${textoAvisos} · ${porResponder} ${textoOfertas} por responder`;
}

function fechaPublicacion(aviso) {
  if (aviso.status === 'Borrador') return 'Sin publicar';
  if (!aviso.published) return '—';
  if (aviso.published.includes('/')) return aviso.published;
  return new Date(aviso.published).toLocaleDateString('es-PE');
}

function FilaPublicacion({ aviso, ofertas, seleccionar }) {
  const [foto, setFoto] = useState(aviso.imagen || '');
  const editable = !estadosNoEditables.includes(aviso.status);
  const pendientes = contarOfertas(ofertas, 'Pendiente');
  const aceptadas = contarOfertas(ofertas, 'Aceptada');

  useEffect(() => {
    let vigente = true;
    let url = '';
    listarFotos(aviso.id)
      .then((fotos) => {
        if (vigente && fotos.length) {
          url = URL.createObjectURL(fotos[0]);
          setFoto(url);
        }
      })
      .catch(() => {
        // Si la foto local no está disponible, se mantiene el marcador visual.
      });
    return () => {
      vigente = false;
      if (url) URL.revokeObjectURL(url);
    };
  }, [aviso.id]);

  function abrirModal(event, estado) {
    event.currentTarget.closest('details').open = false;
    seleccionar({ id: aviso.id, titulo: aviso.title, estado });
  }

  function cambiarEstado(event) {
    const nuevoEstado = aviso.status === 'Publicado' ? 'Pausado' : 'Publicado';
    abrirModal(event, nuevoEstado);
  }

  return (
    <tr className={'hu2-fila-' + aviso.status.toLowerCase()}>
      <td>
        {foto ? (
          <img
            className="hu2-miniatura-lista"
            src={foto}
            alt={'Portada de ' + aviso.title}
          />
        ) : (
          <div
            className="hu2-miniatura-lista hu2-sin-foto"
            aria-label="Sin fotografía"
          >
            {aviso.status === 'Borrador' && <span>sin foto</span>}
          </div>
        )}
      </td>
      <td className="hu2-celda-aviso">
        <h2>{aviso.title}</h2>
        <p>
          {aviso.category} · {aviso.course} · {aviso.condition}
        </p>
        {aviso.motivoModeracion && (
          <p className="hu2-error-campo">{aviso.motivoModeracion}</p>
        )}
      </td>
      <td className="hu2-precio">{dinero(aviso.price)}</td>
      <td>
        <span className={'hu2-estado hu2-estado-' + aviso.status.toLowerCase()}>
          {aviso.status}
        </span>
      </td>
      <td>
        {pendientes > 0 ? (
          <a
            className="hu2-enlace"
            href="/ofertas"
          >
            {pendientes} oferta{pendientes === 1 ? '' : 's'}
          </a>
        ) : (
          <span className="hu2-texto-secundario">
            {mensajeOfertasSinPendientes(aviso.status, aceptadas)}
          </span>
        )}
      </td>
      <td className="hu2-fecha">{fechaPublicacion(aviso)}</td>
      <td className="hu2-celda-acciones">
        <details className="hu2-menu-acciones">
          <summary aria-label={'Acciones de ' + aviso.title}>
            Acciones <span aria-hidden="true">⌄</span>
          </summary>
          <div className="hu2-menu-opciones">
            {editable && (
              <>
                <a href={'/nuevo-aviso?id=' + aviso.id}>Editar aviso</a>
                <a href={'/fotografias-aviso?id=' + aviso.id}>Fotografías</a>
                {aviso.status !== 'Borrador' && (
                  <button
                    type="button"
                    onClick={cambiarEstado}
                  >
                    Cambiar estado
                  </button>
                )}
                <button
                  type="button"
                  className="hu2-texto-error"
                  onClick={(event) => abrirModal(event, 'Eliminado')}
                >
                  Eliminar aviso
                </button>
              </>
            )}
            {aviso.status === 'Reservado' && <a href="/acuerdos">Gestionar entrega</a>}
            {['Publicado', 'Vendido'].includes(aviso.status) && (
              <a href={'/aviso?id=' + aviso.id}>Ver aviso</a>
            )}
            {aviso.status === 'Retirado' && (
              <span className="hu2-menu-ayuda">Retirado por moderación</span>
            )}
          </div>
        </details>
      </td>
    </tr>
  );
}

export default function MisPublicaciones() {
  const [filtro, setFiltro] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(1);
  const [seleccion, setSeleccion] = useState(null);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [listaAvisos, setListaAvisos] = useState(avisos);
  const { ofertas } = useNegociaciones();
  const correo = usuarioActivo().correo;
  const propios = listaAvisos.filter(
    (aviso) => aviso.owner === correo && aviso.status !== 'Eliminado',
  );
  // Se aplican los filtros
  const resultados = propios.filter((aviso) => {
    if (filtro !== 'Todos' && aviso.status !== filtro) return false;
    const texto = `${aviso.title} ${aviso.category} ${aviso.course}`.toLowerCase();
    return texto.includes(busqueda.trim().toLowerCase());
  });
  const paginas = Math.max(1, Math.ceil(resultados.length / avisosPorPagina));
  const paginaActual = Math.min(pagina, paginas);
  const visibles = resultados.slice(
    (paginaActual - 1) * avisosPorPagina,
    paginaActual * avisosPorPagina,
  );
  const porResponder = ofertas.filter(
    (oferta) =>
      oferta.vendedor === correo &&
      oferta.estado === 'Pendiente' &&
      oferta.turno === correo,
  ).length;
  const ofertasSeleccionadas = seleccion
    ? ofertas.filter(
        (oferta) => oferta.avisoId === seleccion.id && oferta.estado === 'Pendiente',
      ).length
    : 0;

  function seleccionar(datos) {
    setError('');
    setSeleccion(datos);
  }

  function confirmar(estado) {
    try {
      cambiarEstadoPublicacion(seleccion.id, estado);
      setSeleccion(null);
      setError('');
      setMensaje(
        estado === 'Eliminado'
          ? 'Aviso eliminado. Las ofertas pendientes quedaron cerradas.'
          : 'Publicación actualizada.',
      );
      setListaAvisos(avisos());
    } catch (problema) {
      setError(problema.message);
    }
  }
  // cambiar filtros
  function cambiarFiltro(nuevoFiltro) {
    setFiltro(nuevoFiltro);
    setPagina(1);
  }

  function cambiarBusqueda(event) {
    setBusqueda(event.target.value);
    setPagina(1);
  }

  function limpiarFiltros() {
    setFiltro('Todos');
    setBusqueda('');
    setPagina(1);
  }

  const descripcion = obtenerDescripcion(propios, porResponder);

  return (
    <Marco
      publicaciones
      titulo="Mis publicaciones"
      descripcion={descripcion}
      acciones={
        <a
          href="/nuevo-aviso"
          className="hu2-boton"
        >
          Nuevo aviso
        </a>
      }
    >
      <div className="hu2-herramientas">
        <div
          className="hu2-filtros"
          role="group"
          aria-label="Filtrar por estado"
        >
          {filtros.map(([valor, etiqueta]) => {
            const cantidad =
              valor === 'Todos'
                ? propios.length
                : propios.filter((aviso) => aviso.status === valor).length;
            // Los estados de otras HU siguen disponibles cuando hay avisos en ellos.
            if (['Reservado', 'Retirado'].includes(valor) && cantidad === 0) return null;
            return (
              // Aqui al hacer click se cambia los filtros
              <button
                key={valor}
                type="button"
                className={'hu2-chip' + (filtro === valor ? ' hu2-chip-activo' : '')}
                aria-pressed={filtro === valor}
                onClick={() => cambiarFiltro(valor)}
              >
                {etiqueta} · {cantidad}
              </button>
            );
          })}
        </div>
        {propios.length > 0 && (
          <input
            className="hu2-buscar-propios"
            aria-label="Buscar en mis avisos"
            placeholder="Buscar en mis avisos…"
            value={busqueda}
            onChange={cambiarBusqueda}
          />
        )}
      </div>
      {mensaje && (
        <p
          className="hu2-alerta hu2-alerta-exito"
          role="status"
        >
          {mensaje}
        </p>
      )}
      {visibles.length === 0 ? (
        <section className="hu2-vacio hu2-panel">
          <span
            className="hu2-vacio-icono"
            aria-hidden="true"
          />
          <h2>
            {propios.length
              ? 'No encontramos publicaciones con estos filtros'
              : 'Todavía no publicas nada'}
          </h2>
          <p>
            {propios.length
              ? 'Prueba con otro estado o busca un título diferente.'
              : 'Ese libro del ciclo pasado le puede servir a alguien esta semana. Publicar un aviso toma menos de tres minutos.'}
          </p>
          {propios.length ? (
            <button
              type="button"
              className="hu2-boton"
              onClick={limpiarFiltros}
            >
              Limpiar filtros
            </button>
          ) : (
            <a
              className="hu2-boton"
              href="/nuevo-aviso"
            >
              Crear mi primer aviso
            </a>
          )}
          <a
            className="hu2-enlace"
            href="/#como-funciona"
          >
            Ver cómo funciona el tablón
          </a>
        </section>
      ) : (
        <>
          <div className="hu2-tabla-contenedor">
            <table className="hu2-tabla">
              <caption className="hu2-solo-lectores">
                Tus publicaciones, disponibilidad y acciones
              </caption>
              <thead>
                <tr>
                  {['Foto', 'Aviso', 'Precio', 'Estado', 'Ofertas', 'Publicado'].map(
                    (titulo) => (
                      <th
                        scope="col"
                        key={titulo}
                      >
                        {titulo}
                      </th>
                    ),
                  )}
                  <th scope="col">
                    <span className="hu2-solo-lectores">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibles.map((aviso) => (
                  <FilaPublicacion
                    key={aviso.id}
                    aviso={aviso}
                    ofertas={ofertas.filter((oferta) => oferta.avisoId === aviso.id)}
                    seleccionar={seleccionar}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <nav
            className="hu2-paginacion"
            aria-label="Paginación de publicaciones"
          >
            <p aria-live="polite">
              Mostrando {(paginaActual - 1) * avisosPorPagina + 1}–
              {Math.min(paginaActual * avisosPorPagina, resultados.length)} de{' '}
              {resultados.length} avisos
            </p>
            <button
              type="button"
              aria-label="Página anterior"
              disabled={paginaActual === 1}
              onClick={() => setPagina(paginaActual - 1)}
            >
              ‹
            </button>
            <span aria-current="page">{paginaActual}</span>
            <button
              type="button"
              aria-label="Página siguiente"
              disabled={paginaActual === paginas}
              onClick={() => setPagina(paginaActual + 1)}
            >
              ›
            </button>
          </nav>
        </>
      )}
      {seleccion && (
        <ModalesPublicacion
          seleccion={seleccion}
          ofertas={ofertasSeleccionadas}
          error={error}
          cerrar={() => setSeleccion(null)}
          confirmar={confirmar}
        />
      )}
    </Marco>
  );
}
