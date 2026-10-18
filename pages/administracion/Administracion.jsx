import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { usuarios, perfilPublico } from '../../assets/js/compartido/sesion.js';
import { avisos, obtenerAviso } from '../../assets/js/compartido/storage.js';
import { leerNegociaciones } from '../../assets/js/hu4/ofertas.js';
import {
  reportes,
  resolverReporte,
  bloquearUsuario,
} from '../../assets/js/hu7/moderacion.js';
import Marco, { dinero, fechaLegible, Modal } from '../compartido/Marco.jsx';

export default function Administracion() {
  const { pathname } = useLocation();
  const seccion = pathname.split('/')[2] || 'metricas';
  const reporteId = pathname.split('/')[3];
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('Todos');
  const [tipo, setTipo] = useState('Todos');
  const [modal, setModal] = useState(null);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const listaReportes = reportes();
  const listaUsuarios = usuarios();
  const publicaciones = avisos();
  const { ofertas, acuerdos } = leerNegociaciones();
  const reporte = listaReportes.find((item) => item.id === reporteId);
  const cerrados = acuerdos.filter((item) => item.estado === 'Cerrado');
  const visibles = listaReportes.filter(
    (item) =>
      (filtro === 'Todos' || item.estado === filtro) &&
      (tipo === 'Todos' || item.tipo === tipo) &&
      (item.motivo + ' ' + item.detalle + ' ' + item.autor + ' ' + item.objetivo)
        .toLowerCase()
        .includes(busqueda.toLowerCase()),
  );

  function confirmar(event) {
    event.preventDefault();
    const motivo = new FormData(event.currentTarget).get('motivo');
    try {
      if (modal.tipo === 'usuario') bloquearUsuario(modal.correo, modal.bloquear, motivo);
      else resolverReporte(reporte.id, modal.accion, motivo);
      setModal(null);
      setError('');
      setMensaje('Acción de moderación registrada.');
    } catch (problema) {
      setError(problema.message);
    }
  }

  return (
    <Marco
      titulo="Administración"
      descripcion="Revisa reportes, gestiona usuarios y consulta la actividad del tablón."
    >
      <nav
        className="neg-acciones"
        aria-label="Secciones de administración"
      >
        <a
          href="/administracion"
          className={seccion === 'metricas' ? 'neg-boton' : 'neg-secundario'}
        >
          Métricas
        </a>
        <a
          href="/administracion/reportes"
          className={seccion === 'reportes' ? 'neg-boton' : 'neg-secundario'}
        >
          Reportes
        </a>
        <a
          href="/administracion/usuarios"
          className={seccion === 'usuarios' ? 'neg-boton' : 'neg-secundario'}
        >
          Usuarios
        </a>
      </nav>
      {mensaje && (
        <p
          className="neg-exito"
          role="status"
        >
          {mensaje}
        </p>
      )}
      {seccion === 'metricas' && (
        <>
          <div className="rejilla-productos mt-6">
            {[
              [
                'Avisos publicados',
                publicaciones.filter((item) => item.status === 'Publicado').length,
              ],
              ['Ventas completadas', cerrados.length],
              [
                'Monto de ventas',
                dinero(cerrados.reduce((total, item) => total + item.monto, 0)),
              ],
              [
                'Ofertas pendientes',
                ofertas.filter((item) => item.estado === 'Pendiente').length,
              ],
              [
                'Reportes pendientes',
                listaReportes.filter((item) => item.estado === 'Pendiente').length,
              ],
              [
                'Cuentas bloqueadas',
                listaUsuarios.filter((item) => item.bloqueado).length,
              ],
            ].map(([etiqueta, valor]) => (
              <article
                key={etiqueta}
                className="neg-tarjeta"
              >
                <h2>{etiqueta}</h2>
                <p className="neg-precio">{valor}</p>
              </article>
            ))}
          </div>
          <section className="neg-tarjeta">
            <h2>Estados de publicaciones</h2>
            {[
              'Borrador',
              'Publicado',
              'Pausado',
              'Reservado',
              'Vendido',
              'Retirado',
              'Eliminado',
            ].map((estado) => {
              const cantidad = publicaciones.filter(
                (item) => item.status === estado,
              ).length;
              return (
                <div
                  className="barra-metrica"
                  key={estado}
                >
                  <span>{estado}</span>
                  <progress
                    max={Math.max(1, publicaciones.length)}
                    value={cantidad}
                    aria-label={estado}
                  />
                  <strong>{cantidad}</strong>
                </div>
              );
            })}
          </section>
          <section className="neg-tarjeta">
            <h2>Ofertas por estado</h2>
            {['Pendiente', 'Aceptada', 'Rechazada', 'Retirada', 'Cerrada'].map(
              (estado) => (
                <p
                  key={estado}
                  className="my-2"
                >
                  {estado}: {ofertas.filter((item) => item.estado === estado).length}
                </p>
              ),
            )}
          </section>
        </>
      )}

      {seccion === 'reportes' && !reporteId && (
        <>
          <div className="rejilla-tres">
            <label>
              Buscar reportes
              <input
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
                placeholder="Motivo, usuario o detalle"
              />
            </label>
            <label>
              Estado
              <select
                value={filtro}
                onChange={(event) => setFiltro(event.target.value)}
              >
                {['Todos', 'Pendiente', 'Atendido', 'Descartado'].map((valor) => (
                  <option key={valor}>{valor}</option>
                ))}
              </select>
            </label>
            <label>
              Tipo
              <select
                value={tipo}
                onChange={(event) => setTipo(event.target.value)}
              >
                {['Todos', 'Aviso', 'Usuario'].map((valor) => (
                  <option key={valor}>{valor}</option>
                ))}
              </select>
            </label>
          </div>
          {!visibles.length && (
            <p className="neg-tarjeta">No hay reportes que coincidan con los filtros.</p>
          )}
          {visibles.map((item) => (
            <article
              key={item.id}
              className="neg-tarjeta"
            >
              <div className="neg-fila">
                <h2>{item.motivo}</h2>
                <span className="neg-estado">{item.estado}</span>
              </div>
              <p className="neg-ayuda">
                {item.tipo} · {item.autor} · {fechaLegible(item.fecha)}
              </p>
              <p>{item.detalle}</p>
              <a
                className="neg-secundario mt-4"
                href={'/administracion/reportes/' + item.id}
              >
                Revisar reporte
              </a>
            </article>
          ))}
        </>
      )}

      {seccion === 'reportes' &&
        reporteId &&
        (reporte ? (
          <section className="neg-tarjeta">
            <a href="/administracion/reportes">← Bandeja de reportes</a>
            <h2 className="mt-5">{reporte.motivo}</h2>
            <p className="neg-ayuda">
              {reporte.tipo} · {reporte.estado}
            </p>
            <p>{reporte.detalle}</p>
            <dl className="neg-datos">
              <div>
                <dt>Reportado por</dt>
                <dd>{reporte.autor}</dd>
              </div>
              <div>
                <dt>Fecha</dt>
                <dd>{fechaLegible(reporte.fecha)}</dd>
              </div>
              <div>
                <dt>Elemento reportado</dt>
                <dd>
                  {reporte.tipo === 'Aviso'
                    ? obtenerAviso(reporte.objetivo)?.title || reporte.objetivo
                    : (perfilPublico(reporte.objetivo)?.nombres || '') +
                      ' · ' +
                      reporte.objetivo}
                </dd>
              </div>
            </dl>
            <a
              href={
                reporte.tipo === 'Aviso'
                  ? '/aviso?id=' + reporte.objetivo
                  : '/vendedor?correo=' + encodeURIComponent(reporte.objetivo)
              }
            >
              Ver elemento reportado
            </a>
            {reporte.estado === 'Pendiente' ? (
              <div className="neg-acciones">
                {reporte.tipo === 'Aviso' && (
                  <button
                    className="neg-boton"
                    onClick={() => {
                      setError('');
                      setModal({ accion: 'retirar' });
                    }}
                  >
                    Retirar aviso
                  </button>
                )}
                <button
                  className="neg-secundario"
                  onClick={() => {
                    setError('');
                    setModal({ accion: 'bloquear' });
                  }}
                >
                  Bloquear cuenta
                </button>
                <button
                  className="neg-secundario"
                  onClick={() => {
                    setError('');
                    setModal({ accion: 'descartar' });
                  }}
                >
                  Descartar reporte
                </button>
              </div>
            ) : (
              <p className="neg-exito">
                Resolución: {reporte.resolucion} · {reporte.resueltoPor}
              </p>
            )}
          </section>
        ) : (
          <p className="neg-error">No se encontró el reporte.</p>
        ))}

      {seccion === 'usuarios' && (
        <>
          <div className="rejilla-dos">
            <label>
              Buscar usuarios
              <input
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
                placeholder="Nombre o correo"
              />
            </label>
            <label>
              Estado
              <select
                value={filtro}
                onChange={(event) => setFiltro(event.target.value)}
              >
                {['Todos', 'Activos', 'Bloqueados'].map((valor) => (
                  <option key={valor}>{valor}</option>
                ))}
              </select>
            </label>
          </div>
          {listaUsuarios
            .filter(
              (item) =>
                (item.nombres + ' ' + item.apellidos + ' ' + item.correo)
                  .toLowerCase()
                  .includes(busqueda.toLowerCase()) &&
                (filtro === 'Todos' || item.bloqueado === (filtro === 'Bloqueados')),
            )
            .map((usuario) => (
              <article
                key={usuario.correo}
                className="neg-tarjeta"
              >
                <div className="neg-fila">
                  <h2>
                    {usuario.nombres} {usuario.apellidos}
                  </h2>
                  <span className="neg-estado">
                    {usuario.bloqueado ? 'Bloqueado' : 'Activo'} · {usuario.rol}
                  </span>
                </div>
                <p className="neg-ayuda">{usuario.correo}</p>
                <details>
                  <summary>Ver actividad del usuario</summary>
                  <p className="my-3">
                    Publicaciones:{' '}
                    {publicaciones.filter((item) => item.owner === usuario.correo).length}{' '}
                    · Ofertas enviadas:{' '}
                    {ofertas.filter((item) => item.comprador === usuario.correo).length} ·
                    Acuerdos cerrados:{' '}
                    {
                      cerrados.filter(
                        (item) =>
                          item.comprador === usuario.correo ||
                          item.vendedor === usuario.correo,
                      ).length
                    }
                  </p>
                  <a href={'/vendedor?correo=' + encodeURIComponent(usuario.correo)}>
                    Ver perfil público
                  </a>
                </details>
                {usuario.motivoModeracion && (
                  <p className="neg-ayuda">Última acción: {usuario.motivoModeracion}</p>
                )}
                {usuario.rol !== 'administrador' && (
                  <button
                    className="neg-secundario mt-4"
                    onClick={() => {
                      setError('');
                      setModal({
                        tipo: 'usuario',
                        correo: usuario.correo,
                        bloquear: !usuario.bloqueado,
                      });
                    }}
                  >
                    {usuario.bloqueado ? 'Desbloquear cuenta' : 'Bloquear cuenta'}
                  </button>
                )}
              </article>
            ))}
        </>
      )}
      {!['metricas', 'reportes', 'usuarios'].includes(seccion) && (
        <p className="neg-error">No existe esta sección.</p>
      )}

      {modal && (
        <Modal
          titulo="Confirmar moderación"
          cerrar={() => setModal(null)}
        >
          <form onSubmit={confirmar}>
            <p className="neg-ayuda">
              {modal.accion === 'descartar'
                ? 'El reporte quedará descartado con la resolución que indiques.'
                : modal.tipo === 'usuario' && !modal.bloquear
                  ? 'La cuenta podrá volver a ingresar. Sus avisos pausados deben reactivarse por separado.'
                  : 'Esta acción puede cerrar ofertas y cancelar acuerdos relacionados. Al bloquear una cuenta se pausarán sus publicaciones y se impedirá su acceso.'}
            </p>
            <label>
              Motivo o resolución
              <textarea
                name="motivo"
                required
                minLength={10}
                maxLength={500}
                rows={4}
              />
            </label>
            {error && (
              <p
                role="alert"
                className="neg-error"
              >
                {error}
              </p>
            )}
            <div className="neg-acciones">
              <button className="neg-boton">Confirmar acción</button>
              <button
                type="button"
                className="neg-secundario"
                onClick={() => setModal(null)}
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
