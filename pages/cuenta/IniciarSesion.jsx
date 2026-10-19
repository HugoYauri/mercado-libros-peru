import { useState } from 'react';
import { iniciarSesion } from '../../assets/js/compartido/sesion.js';
import Marco from '../compartido/Marco.jsx';

export default function IniciarSesion() {
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false);

  function ingresar(event) {
    event.preventDefault();
    const datos = new FormData(event.currentTarget);
    try {
      const usuario = iniciarSesion(datos.get('correo'), datos.get('clave'));
      const destino = new URLSearchParams(location.search).get('returnTo');
      const ruta =
        destino && destino.startsWith('/') && !destino.startsWith('//')
          ? destino
          : usuario.rol === 'administrador'
            ? '/administracion'
            : '/mi-cuenta';
      window.location.assign(ruta);
    } catch (problema) {
      setError(problema.message);
    }
  }

  return (
    <Marco
      titulo="Iniciar sesión"
      descripcion="Usa tu correo institucional para publicar, negociar y coordinar entregas."
    >
      <form
        className="neg-tarjeta formulario-corto"
        onSubmit={ingresar}
      >
        <label>
          Correo institucional
          <input
            name="correo"
            type="email"
            autoComplete="username"
            required
          />
        </label>
        <label>
          Contraseña
          <input
            name="clave"
            type={visible ? 'text' : 'password'}
            autoComplete="current-password"
            required
          />
        </label>
        <button
          type="button"
          className="neg-enlace"
          onClick={() => setVisible(!visible)}
        >
          {visible ? 'Ocultar' : 'Mostrar'} contraseña
        </button>
        {error && (
          <p
            role="alert"
            className="neg-error"
          >
            {error}
          </p>
        )}
        <div className="neg-acciones">
          <button className="neg-boton">Ingresar</button>
          <a
            href="/registro"
            className="neg-secundario"
          >
            Crear cuenta
          </a>
        </div>
        <p className="mt-5">
          <a href="/recuperar-contrasena">¿Olvidaste tu contraseña?</a>
        </p>
      </form>
      <details className="neg-tarjeta formulario-corto">
        <summary>Cuentas para probar el avance</summary>
        <p className="mt-4">Rosa: rosa.quispe@aloe.ulima.edu.pe / Rosa2026!</p>
        <p>Diego: diego.salazar@aloe.ulima.edu.pe / Diego2026!</p>
        <p>Administración: admin@aloe.ulima.edu.pe / Admin2026!</p>
        <p className="neg-ayuda">
          Son cuentas locales de demostración. No uses contraseñas personales.
        </p>
      </details>
    </Marco>
  );
}
