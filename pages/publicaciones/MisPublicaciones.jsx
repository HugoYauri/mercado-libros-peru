import { useState } from 'react';
import { avisos } from '../../assets/js/compartido/storage.js';
import { usuarioActivo } from '../../assets/js/compartido/sesion.js';
import { cambiarEstadoPublicacion } from '../../assets/js/hu2/publicaciones.js';
import Marco, { Modal, dinero } from '../compartido/Marco.jsx';

export default function MisPublicaciones() {
  const [filtro, setFiltro] = useState('Todos');
  const [seleccion, setSeleccion] = useState(null);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [, actualizar] = useState(0);
  const propios = avisos().filter(
    (aviso) => aviso.owner === usuarioActivo().correo && aviso.status !== 'Eliminado',
  );
  const visibles = propios.filter(
    (aviso) => filtro === 'Todos' || aviso.status === filtro,
  );
  function confirmar() {
    try {
      cambiarEstadoPublicacion(seleccion.id, seleccion.estado);
      setSeleccion(null);
      setError('');
      setMensaje('Publicación actualizada.');
      actualizar((valor) => valor + 1);
    } catch (problema) {
      setError(problema.message);
    }
  }
  return (
    <Marco
      titulo="Mis publicaciones"
      descripcion="Administra tus avisos, fotografías y disponibilidad."
    >
      <div className="neg-fila">
        <a
          href="/nuevo-aviso"
          className="neg-boton"
        >
          Nuevo aviso
        </a>
        <label>
          Estado
          <select
            value={filtro}
            onChange={(event) => setFiltro(event.target.value)}
          >
            {[
              'Todos',
              'Borrador',
              'Publicado',
              'Pausado',
              'Reservado',
              'Vendido',
              'Retirado',
            ].map((valor) => (
              <option key={valor}>{valor}</option>
            ))}
          </select>
        </label>
      </div>
      {mensaje && (
        <p
          role="status"
          className="neg-exito"
        >
          {mensaje}
        </p>
      )}
      {!visibles.length && (
        <section className="neg-tarjeta neg-vacio">
          <h2>
            {propios.length
              ? 'No tienes publicaciones con este estado'
              : 'Todavía no publicas nada'}
          </h2>
          <p className="neg-ayuda">
            Ese libro del ciclo pasado puede servirle a un compañero.
          </p>
          <a
            href="/nuevo-aviso"
            className="neg-boton"
          >
            Crear aviso
          </a>
        </section>
      )}
      {visibles.map((aviso) => (
        <article
          key={aviso.id}
          className="neg-tarjeta"
        >
          <div className="neg-fila">
            <h2>{aviso.title}</h2>
            <span className="neg-estado">{aviso.status}</span>
          </div>
          <p className="neg-precio">{dinero(aviso.price)}</p>
          <p>
            {aviso.category} · {aviso.course}
          </p>
          {aviso.motivoModeracion && (
            <p className="neg-error">{aviso.motivoModeracion}</p>
          )}
          <div className="neg-acciones">
            {!['Reservado', 'Vendido', 'Retirado'].includes(aviso.status) && (
              <>
                <a
                  href={'/nuevo-aviso?id=' + aviso.id}
                  className="neg-secundario"
                >
                  Editar
                </a>
                <a
                  href={'/fotografias-aviso?id=' + aviso.id}
                  className="neg-secundario"
                >
                  Fotografías
                </a>
                {aviso.status !== 'Borrador' && (
                  <button
                    className="neg-secundario"
                    onClick={() => {
                      setError('');
                      setSeleccion({
                        id: aviso.id,
                        estado: aviso.status === 'Publicado' ? 'Pausado' : 'Publicado',
                      });
                    }}
                  >
                    {aviso.status === 'Publicado' ? 'Pausar' : 'Publicar'}
                  </button>
                )}
                <button
                  className="neg-secundario"
                  onClick={() => {
                    setError('');
                    setSeleccion({ id: aviso.id, estado: 'Eliminado' });
                  }}
                >
                  Eliminar
                </button>
              </>
            )}
            {aviso.status === 'Reservado' && (
              <a
                href="/acuerdos"
                className="neg-boton"
              >
                Gestionar entrega
              </a>
            )}
            {['Publicado', 'Vendido'].includes(aviso.status) && (
              <a href={'/aviso?id=' + aviso.id}>Ver aviso</a>
            )}
          </div>
        </article>
      ))}
      {seleccion && (
        <Modal
          titulo={seleccion.estado === 'Eliminado' ? 'Eliminar aviso' : 'Cambiar estado'}
          cerrar={() => setSeleccion(null)}
        >
          <p className="neg-ayuda">
            {seleccion.estado === 'Eliminado'
              ? 'El aviso dejará de mostrarse. Las ofertas pendientes quedarán cerradas.'
              : 'El aviso pasará al estado ' + seleccion.estado + '.'}
          </p>
          {error && (
            <p
              role="alert"
              className="neg-error"
            >
              {error}
            </p>
          )}
          <div className="neg-acciones">
            <button
              className="neg-boton"
              onClick={confirmar}
            >
              Confirmar
            </button>
            <button
              className="neg-secundario"
              onClick={() => setSeleccion(null)}
            >
              Cancelar
            </button>
          </div>
        </Modal>
      )}
    </Marco>
  );
}
