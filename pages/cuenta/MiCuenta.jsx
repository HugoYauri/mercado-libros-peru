import { useState } from 'react';
import {
  usuarioActivo,
  guardarUsuario,
  cambiarClave,
} from '../../assets/js/compartido/sesion.js';
import Marco from '../compartido/Marco.jsx';

export default function MiCuenta() {
  const [usuario, setUsuario] = useState(usuarioActivo);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  function guardar(event) {
    event.preventDefault();
    try {
      guardarUsuario(Object.fromEntries(new FormData(event.currentTarget)));
      setUsuario(usuarioActivo());
      setMensaje('Datos guardados.');
      setError('');
    } catch (problema) {
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
      setError(problema.message);
    }
  }
  return (
    <Marco
      titulo="Mi cuenta"
      descripcion={usuario.nombres + ' ' + usuario.apellidos}
    >
      {mensaje && (
        <p
          role="status"
          className="neg-exito"
        >
          {mensaje}
        </p>
      )}
      {error && (
        <p
          role="alert"
          className="neg-error"
        >
          {error}
        </p>
      )}
      <div className="rejilla-dos">
        <form
          className="neg-tarjeta"
          onSubmit={guardar}
        >
          <h2>Datos personales</h2>
          <p className="neg-ayuda">
            {usuario.correo} · {usuario.rol}
          </p>
          <label>
            Nombres
            <input
              name="nombres"
              required
              defaultValue={usuario.nombres}
            />
          </label>
          <label>
            Apellidos
            <input
              name="apellidos"
              required
              defaultValue={usuario.apellidos}
            />
          </label>
          <label>
            Teléfono
            <input
              name="telefono"
              inputMode="numeric"
              maxLength={9}
              defaultValue={usuario.telefono}
            />
          </label>
          <label>
            Carrera
            <input
              name="carrera"
              required
              defaultValue={usuario.carrera}
            />
          </label>
          <label>
            Ciclo
            <input
              name="ciclo"
              type="number"
              min={1}
              max={12}
              required
              defaultValue={usuario.ciclo}
            />
          </label>
          <div className="neg-acciones">
            <button className="neg-boton">Guardar cambios</button>
            <button
              type="reset"
              className="neg-secundario"
            >
              Descartar
            </button>
          </div>
        </form>
        <div>
          <form
            className="neg-tarjeta"
            onSubmit={actualizarClave}
          >
            <h2>Cambiar contraseña</h2>
            <label>
              Contraseña actual
              <input
                type="password"
                name="actual"
                required
              />
            </label>
            <label>
              Nueva contraseña
              <input
                type="password"
                name="nueva"
                required
                minLength={8}
              />
            </label>
            <label>
              Confirmar contraseña
              <input
                type="password"
                name="confirmar"
                required
              />
            </label>
            <button className="neg-boton">Actualizar contraseña</button>
          </form>
          <section className="neg-tarjeta">
            <h2>Mi actividad</h2>
            <div className="neg-acciones">
              <a href="/mis-publicaciones">Publicaciones</a>
              <a href="/ofertas">Ofertas</a>
              <a href="/acuerdos">Acuerdos</a>
              <a href="/calificaciones">Calificaciones</a>
              <a href={'/vendedor?correo=' + encodeURIComponent(usuario.correo)}>
                Mi perfil público
              </a>
            </div>
          </section>
        </div>
      </div>
    </Marco>
  );
}
