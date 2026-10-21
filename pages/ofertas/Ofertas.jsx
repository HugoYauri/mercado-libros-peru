import { useMemo, useState } from 'react';
import { usuarioActivo, perfilPublico } from '../../assets/js/compartido/sesion.js';
import { obtenerAviso } from '../../assets/js/compartido/storage.js';
import { reputacion } from '../../assets/js/hu6/reputacion.js';
import Marco, { dinero, useNegociaciones } from '../compartido/Marco.jsx';
import ModalOferta from './ModalOferta.jsx';
import '../../assets/css/ofertas.css';

function fechaCorta(fecha) {
  if (!fecha) return 'Fecha no disponible';
  const resultado = new Date(fecha);
  return Number.isNaN(resultado.getTime())
    ? 'Fecha no disponible'
    : resultado.toLocaleDateString('es-PE');
}

function nombreDe(correo) {
  const usuario = perfilPublico(correo);
  return usuario
    ? `${usuario.nombres} ${usuario.apellidos}`
    : correo || 'Estudiante';
}

function inicialesDe(correo) {
  const usuario = perfilPublico(correo);
  if (!usuario) return 'ES';
  return `${usuario.nombres?.[0] || ''}${usuario.apellidos?.[0] || ''}`.toUpperCase();
}

function estadoOferta(oferta) {
  if (oferta.estado !== 'Pendiente') return oferta.estado;
  return oferta.historial.length > 1 ? 'Contraofertada' : 'Enviada';
}

function coincideFiltro(oferta, filtro) {
  const estado = estadoOferta(oferta);
  return filtro === 'Todas' || estado === filtro;
}

export default function Ofertas() {
  const [vista, setVista] = useState('recibidas');
  const [filtro, setFiltro] = useState('Todas');
  const [modal, setModal] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const { ofertas, acuerdos } = useNegociaciones();
  const correo = usuarioActivo().correo;

  const deLaVista = ofertas.filter((oferta) =>
    vista === 'recibidas' ? oferta.vendedor === correo : oferta.comprador === correo,
  );
  const visibles = deLaVista.filter((oferta) => coincideFiltro(oferta, filtro));
  const agrupadas = useMemo(() => {
    const grupos = new Map();
    visibles.forEach((oferta) => {
      const actual = grupos.get(oferta.avisoId) || [];
      actual.push(oferta);
      grupos.set(oferta.avisoId, actual);
    });
    return [...grupos.entries()].map(([avisoId, lista]) => ({ avisoId, ofertas: lista }));
  }, [visibles]);

  const pestañas = [
    ['Todas', 'Todas', deLaVista.length],
    [
      'Enviada',
      'Enviadas',
      deLaVista.filter((oferta) => estadoOferta(oferta) === 'Enviada').length,
    ],
    [
      'Contraofertada',
      'Contraofertadas',
      deLaVista.filter((oferta) => estadoOferta(oferta) === 'Contraofertada').length,
    ],
    ['Aceptada', 'Aceptadas', deLaVista.filter((oferta) => oferta.estado === 'Aceptada').length],
    ['Rechazada', 'Rechazadas', deLaVista.filter((oferta) => oferta.estado === 'Rechazada').length],
  ];

  function cambiarVista(nuevaVista) {
    setVista(nuevaVista);
    setFiltro('Todas');
    setMensaje('');
  }

  function abrirAccion(oferta, accion) {
    setMensaje('');
    setModal({ oferta, accion });
  }

  function acuerdoDe(ofertaId) {
    return acuerdos.find((acuerdo) => acuerdo.ofertaId === ofertaId);
  }

  function botonesDe(oferta) {
    const puedeResponder = oferta.estado === 'Pendiente' && oferta.turno === correo;
    const esComprador = oferta.comprador === correo;
    const acuerdo = acuerdoDe(oferta.id);

    if (puedeResponder) {
      return (
        <div className="hu4-acciones-oferta">
          <button
            type="button"
            className="hu4-boton hu4-boton-verde"
            onClick={() => abrirAccion(oferta, 'aceptar')}
          >
            Aceptar
          </button>
          <button
            type="button"
            className="hu4-boton hu4-boton-borde"
            onClick={() => abrirAccion(oferta, 'contraofertar')}
          >
            Contraofertar
          </button>
          <button
            type="button"
            className="hu4-boton hu4-boton-rechazar"
            onClick={() => abrirAccion(oferta, 'rechazar')}
          >
            Rechazar
          </button>
        </div>
      );
    }

    if (esComprador && oferta.estado === 'Pendiente') {
      return (
        <div className="hu4-acciones-oferta">
          <a className="hu4-boton hu4-boton-borde" href={`/ofertas/${oferta.id}`}>
            Ver hilo
          </a>
          <button
            type="button"
            className="hu4-boton hu4-boton-borde"
            onClick={() => abrirAccion(oferta, 'retirar')}
          >
            Retirar
          </button>
        </div>
      );
    }

    if (acuerdo) {
      return (
        <a
          className="hu4-boton hu4-boton-verde"
          href={`/acuerdos/${acuerdo.id}`}
        >
          Ir al acuerdo
        </a>
      );
    }

    return (
      <a className="hu4-boton hu4-boton-borde" href={`/ofertas/${oferta.id}`}>
        Ver hilo
      </a>
    );
  }

  return (
    <Marco
      ofertas
      titulo="Ofertas"
      descripcion="Revisa tus propuestas y responde a las personas interesadas."
    >
      <div className="hu4-pestanas-vista" role="tablist" aria-label="Tipo de ofertas">
        <button
          type="button"
          role="tab"
          aria-selected={vista === 'recibidas'}
          onClick={() => cambiarVista('recibidas')}
        >
          Recibidas · {ofertas.filter((oferta) => oferta.vendedor === correo).length}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={vista === 'enviadas'}
          onClick={() => cambiarVista('enviadas')}
        >
          Enviadas · {ofertas.filter((oferta) => oferta.comprador === correo).length}
        </button>
      </div>

      <div className="hu4-barra-filtros">
        <div className="hu4-filtros-estado" aria-label="Filtrar ofertas por estado">
          {pestañas.map(([valor, nombre, cantidad]) => (
            <button
              type="button"
              key={valor}
              className="hu4-chip"
              aria-pressed={filtro === valor}
              onClick={() => setFiltro(valor)}
            >
              {nombre} · {cantidad}
            </button>
          ))}
        </div>
        {vista === 'recibidas' && visibles.length > 0 && (
          <span className="hu4-agrupacion-ayuda">Agrupadas por aviso · mejor oferta destacada</span>
        )}
      </div>

      {mensaje && (
        <p className="hu4-mensaje-exito" role="status">{mensaje}</p>
      )}

      {visibles.length === 0 ? (
        <section className="hu4-estado-vacio">
          <span className="hu4-vacio-icono" aria-hidden="true">↗</span>
          <h2>
            {deLaVista.length === 0
              ? `No has ${vista === 'enviadas' ? 'enviado' : 'recibido'} ofertas`
              : `No tienes ofertas ${filtro.toLowerCase()}`}
          </h2>
          <p>
            {vista === 'enviadas'
              ? 'Cuando encuentres algo que te sirva, envía tu monto y el vendedor podrá responder desde aquí.'
              : 'Cuando recibas una propuesta, podrás revisarla y responder desde esta página.'}
          </p>
          <a className="hu4-boton" href={vista === 'enviadas' ? '/catalogo' : '/mis-publicaciones'}>
            {vista === 'enviadas' ? 'Explorar catálogo' : 'Ver mis publicaciones'}
          </a>
        </section>
      ) : (
        <div className="hu4-grupos-ofertas">
          {agrupadas.map(({ avisoId, ofertas: ofertasDelAviso }) => {
            const aviso = obtenerAviso(avisoId);
            const mejor = Math.max(...ofertasDelAviso.map((oferta) => Number(oferta.monto)));
            const precioPedido = aviso?.price ?? ofertasDelAviso[0].monto;
            const minimo = aviso?.minimum ?? precioPedido;

            return (
              <section
                className="hu4-grupo-aviso"
                key={avisoId}
              >
                <header className="hu4-grupo-cabecera">
                  <div className="hu4-miniatura-aviso" aria-hidden="true" />
                  <div className="hu4-grupo-titulo">
                    <h2>{ofertasDelAviso[0].titulo}</h2>
                    <p>
                      Precio pedido {dinero(precioPedido)} · mínimo aceptado {dinero(minimo)} ·{' '}
                      {ofertasDelAviso.length}{' '}
                      {ofertasDelAviso.length === 1 ? 'oferta' : 'ofertas'}
                    </p>
                  </div>
                  {vista === 'recibidas' ? (
                    <div className="hu4-mejor-oferta">
                      <span>Mejor oferta</span>
                      <strong>{dinero(mejor)}</strong>
                    </div>
                  ) : (
                    <a className="hu4-enlace" href={`/aviso?id=${avisoId}`}>
                      Ver aviso
                    </a>
                  )}
                </header>
                {ofertasDelAviso.map((oferta) => {
                  const contraparte = vista === 'recibidas' ? oferta.comprador : oferta.vendedor;
                  const perfil = perfilPublico(contraparte);
                  const opiniones = reputacion(contraparte);
                  const ultimo = oferta.historial.at(-1);
                  const estado = estadoOferta(oferta);
                  const esMejor = Number(oferta.monto) === mejor;
                  const acuerdo = acuerdoDe(oferta.id);

                  return (
                    <article
                      className={`hu4-fila-oferta${esMejor && vista === 'recibidas' ? ' hu4-fila-destacada' : ''}`}
                      key={oferta.id}
                    >
                      <span className="hu4-avatar" aria-hidden="true">{inicialesDe(contraparte)}</span>
                      <div className="hu4-persona-oferta">
                        <strong>{nombreDe(contraparte)}</strong>
                        <span>
                          {perfil?.carrera || 'Estudiante'} ·{' '}
                          {opiniones.recibidas.length
                            ? `${opiniones.promedio.toFixed(1)} ★`
                            : 'Sin calificaciones'}
                        </span>
                        <small>
                          {fechaCorta(ultimo?.fecha)} · «{ultimo?.texto || 'Oferta enviada'}»
                        </small>
                      </div>
                      <div className="hu4-monto-fila">
                        <strong>{dinero(oferta.monto)}</strong>
                        {esMejor && vista === 'recibidas' && <small>Mejor oferta</small>}
                        {vista === 'enviadas' && <small>Precio pedido {dinero(precioPedido)}</small>}
                      </div>
                      <span className={`hu4-estado hu4-estado-${estado.toLowerCase()}`}>
                        {estado}
                      </span>
                      <div className="hu4-botones-fila">
                        {botonesDe(oferta)}
                        {acuerdo && oferta.estado === 'Aceptada' && (
                          <span className="hu4-acuerdo-generado">
                            Acuerdo {acuerdo.id.slice(0, 8)} generado
                          </span>
                        )}
                      </div>
                    </article>
                  );
                })}
              </section>
            );
          })}
        </div>
      )}

      <section className="hu4-reglas">
        <strong>Reglas de la negociación.</strong> Solo puedes tener una oferta activa por aviso.
        Puedes retirarla mientras la otra persona no haya respondido. Toda oferta sin respuesta vence
        a los 7 días.
      </section>

      {modal && (
        <ModalOferta
          aviso={obtenerAviso(modal.oferta.avisoId)}
          oferta={modal.oferta}
          modo="respuesta"
          accion={modal.accion}
          cerrar={() => setModal(null)}
          completar={() => {
            setModal(null);
            setMensaje('La oferta se actualizó correctamente.');
          }}
        />
      )}
    </Marco>
  );
}
