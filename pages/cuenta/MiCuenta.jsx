import { useState } from 'react';
import {
  usuarioActivo,
  guardarUsuario,
  cambiarClave,
  cerrarSesion,
} from '../../assets/js/compartido/sesion.js';
import { avisos } from '../../assets/js/compartido/storage.js';
import { reputacion } from '../../assets/js/hu6/reputacion.js';
import { puntosCampus } from '../../assets/js/hu5/acuerdos.js';
import { useNegociaciones } from '../compartido/Marco.jsx';
import MarcoCuenta from './MarcoCuenta.jsx';
import { AvisoCuenta, CampoClave, carreras } from './ComponentesCuenta.jsx';

export default function MiCuenta() {
  const [usuario, setUsuario] = useState(usuarioActivo);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const { acuerdos } = useNegociaciones();
  const propios = acuerdos.filter(
    (acuerdo) =>
      acuerdo.comprador === usuario.correo || acuerdo.vendedor === usuario.correo,
  );
  const cerrados = propios.filter((acuerdo) => acuerdo.estado === 'Cerrado');
  const publicados = avisos().filter(
    (aviso) => aviso.owner === usuario.correo && aviso.status === 'Publicado',
  );
  const valoracion = reputacion(usuario.correo);
  const nombre = usuario.nombres + ' ' + usuario.apellidos;

  function guardar(event) {
    event.preventDefault();
    try {
      guardarUsuario(Object.fromEntries(new FormData(event.currentTarget)));
      setUsuario(usuarioActivo());
      setMensaje('Datos personales guardados.');
      setError('');
    } catch (problema) {
      setMensaje('');
      setError(problema.message);
    }
  }
  function actualizarClave(event) {
    event.preventDefault();
    const datos = new FormData(event.currentTarget);
    try {
      if (datos.get('nueva') !== datos.get('confirmar'))
        throw new Error('Las contraseñas no coinciden.');
      cambiarClave(datos.get('actual'), datos.get('nueva'));
      event.currentTarget.reset();
      setMensaje('Contraseña actualizada.');
      setError('');
    } catch (problema) {
      setMensaje('');
      setError(problema.message);
    }
  }
  function salir() {
    cerrarSesion();
    window.location.assign('/');
  }

  return (
    <MarcoCuenta privado>
      <div className="hu1-perfil-titulo">
        <h1>Mi cuenta</h1>
        <p>
          {nombre} · {usuario.carrera}, ciclo {usuario.ciclo}
        </p>
      </div>
      {mensaje && <AvisoCuenta tipo="exito">{mensaje}</AvisoCuenta>}
      {error && <AvisoCuenta>{error}</AvisoCuenta>}
      <div className="hu1-perfil-rejilla">
        <section className="hu1-panel">
          <h2>Datos personales</h2>
          <form
            className="hu1-formulario"
            onSubmit={guardar}
            key={JSON.stringify(usuario)}
          >
            <div className="hu1-campo">
              <label htmlFor="cuenta-nombres">Nombres</label>
              <input
                id="cuenta-nombres"
                name="nombres"
                defaultValue={usuario.nombres}
                autoComplete="given-name"
                required
                maxLength={60}
              />
            </div>
            <div className="hu1-campo">
              <label htmlFor="cuenta-apellidos">Apellidos</label>
              <input
                id="cuenta-apellidos"
                name="apellidos"
                defaultValue={usuario.apellidos}
                autoComplete="family-name"
                required
                maxLength={60}
              />
            </div>
            <div className="hu1-campo">
              <label htmlFor="cuenta-correo">Correo institucional</label>
              <input
                id="cuenta-correo"
                value={usuario.correo}
                readOnly
              />
              <p className="hu1-ayuda">No editable.</p>
            </div>
            <div className="hu1-campo">
              <label htmlFor="cuenta-telefono">Teléfono de contacto</label>
              <input
                id="cuenta-telefono"
                name="telefono"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                maxLength={9}
                defaultValue={usuario.telefono}
              />
              <p className="hu1-ayuda">
                Se muestra a la contraparte en el detalle de tus acuerdos.
              </p>
            </div>
            <div
              className="hu1-dos-columnas hu1-formulario"
              style={{ marginTop: 0 }}
            >
              <div className="hu1-campo">
                <label htmlFor="cuenta-carrera">Carrera</label>
                <select
                  id="cuenta-carrera"
                  name="carrera"
                  defaultValue={usuario.carrera}
                  required
                >
                  {!carreras.includes(usuario.carrera) && (
                    <option>{usuario.carrera}</option>
                  )}
                  {carreras.map((carrera) => (
                    <option key={carrera}>{carrera}</option>
                  ))}
                </select>
              </div>
              <div className="hu1-campo">
                <label htmlFor="cuenta-ciclo">Ciclo</label>
                <input
                  id="cuenta-ciclo"
                  name="ciclo"
                  type="number"
                  min={1}
                  max={12}
                  defaultValue={usuario.ciclo}
                  required
                />
              </div>
            </div>
            <div className="hu1-acciones">
              <button className="hu1-boton">Guardar cambios</button>
              <button
                type="reset"
                className="hu1-enlace"
              >
                Descartar
              </button>
            </div>
          </form>
        </section>
        <section className="hu1-panel">
          <h2>Cambiar contraseña</h2>
          <form
            className="hu1-formulario"
            onSubmit={actualizarClave}
          >
            <CampoClave
              etiqueta="Contraseña actual"
              name="actual"
              autoComplete="current-password"
              required
            />
            <CampoClave
              etiqueta="Nueva contraseña"
              name="nueva"
              autoComplete="new-password"
              required
              minLength={8}
              ayuda="Mínimo 8 caracteres, una mayúscula y un número."
            />
            <CampoClave
              etiqueta="Confirmar nueva contraseña"
              name="confirmar"
              autoComplete="new-password"
              required
            />
            <button className="hu1-boton hu1-ancho">Actualizar contraseña</button>
          </form>
          <div className="hu1-preferencias">
            <h2>Punto de encuentro preferido</h2>
            <p className="hu1-ayuda">
              Próximamente podrás guardar tu preferencia. Por ahora, el punto se elige al
              coordinar cada acuerdo.
            </p>
            <div className="hu1-puntos">
              {puntosCampus.map((punto) => (
                <button
                  key={punto}
                  type="button"
                  disabled
                >
                  {punto}
                </button>
              ))}
            </div>
          </div>
        </section>
        <aside className="hu1-lateral">
          <section className="hu1-panel hu1-tarjeta-perfil">
            <div
              className="hu1-avatar-grande"
              aria-hidden="true"
            >
              {usuario.nombres[0]}
              {usuario.apellidos[0]}
            </div>
            <h3>{nombre}</h3>
            <p>
              {valoracion.recibidas.length
                ? 'Reputación ' + valoracion.promedio.toFixed(1)
                : 'Sin calificaciones todavía'}{' '}
              · {cerrados.length} acuerdos cerrados
            </p>
            <button
              type="button"
              className="hu1-secundario"
              disabled
              aria-describedby="foto-pendiente"
            >
              Cambiar fotografía
            </button>
            <p
              id="foto-pendiente"
              className="hu1-ayuda"
            >
              Próximamente
            </p>
          </section>
          <section className="hu1-panel hu1-actividad">
            <h2>Mi actividad</h2>
            <dl>
              <div>
                <dt>Avisos publicados</dt>
                <dd>{publicados.length}</dd>
              </div>
              <div>
                <dt>Acuerdos cerrados</dt>
                <dd>{cerrados.length}</dd>
              </div>
              <div>
                <dt>Entregas confirmadas por mí</dt>
                <dd>
                  {
                    propios.filter((acuerdo) =>
                      acuerdo.confirmaciones.includes(usuario.correo),
                    ).length
                  }
                </dd>
              </div>
            </dl>
            <div className="hu1-actividad-enlaces">
              <a
                className="hu1-enlace"
                href="/mis-publicaciones"
              >
                Publicaciones
              </a>
              <a
                className="hu1-enlace"
                href="/ofertas"
              >
                Ofertas
              </a>
              <a
                className="hu1-enlace"
                href="/acuerdos"
              >
                Acuerdos
              </a>
              <a
                className="hu1-enlace"
                href="/calificaciones"
              >
                Calificaciones
              </a>
            </div>
          </section>
          <section className="hu1-panel hu1-cerrar-sesion">
            <div>
              <h2>Cerrar sesión</h2>
              <p>En este dispositivo</p>
            </div>
            <button onClick={salir}>Salir</button>
          </section>
        </aside>
      </div>
    </MarcoCuenta>
  );
}
