import { useState } from 'react';
import {
  solicitarRecuperacion,
  recuperarClave,
} from '../../assets/js/compartido/sesion.js';
import Marco from '../compartido/Marco.jsx';

export default function RecuperarContrasena() {
  const [paso, setPaso] = useState(1);
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  function enviar(event) {
    event.preventDefault();
    try {
      setToken(solicitarRecuperacion(new FormData(event.currentTarget).get('correo')));
      setError('');
      setPaso(2);
    } catch (problema) {
      setError(problema.message);
    }
  }
  function cambiar(event) {
    event.preventDefault();
    const datos = new FormData(event.currentTarget);
    try {
      if (datos.get('clave') !== datos.get('confirmar'))
        throw new Error('Las contraseñas no coinciden.');
      recuperarClave(token, datos.get('clave'));
      setError('');
      setPaso(4);
    } catch (problema) {
      setError(problema.message);
    }
  }
  return (
    <Marco
      titulo="Recuperar contraseña"
      descripcion="Restablece el acceso a tu cuenta."
    >
      <section className="neg-tarjeta formulario-corto">
        <p className="neg-ayuda">
          Avance de frontend: el envío de correo se simula en esta pantalla. El enlace de
          prueba vence en 15 minutos y solo se usa una vez.
        </p>
        {paso === 1 && (
          <form onSubmit={enviar}>
            <label>
              Correo institucional
              <input
                name="correo"
                required
                type="email"
              />
            </label>
            <button className="neg-boton">Solicitar enlace</button>
          </form>
        )}
        {paso === 2 && (
          <>
            <h2>Solicitud generada</h2>
            <p className="neg-ayuda">En producción recibirás el enlace por correo.</p>
            <button
              className="neg-boton"
              onClick={() => setPaso(3)}
            >
              Abrir enlace de demostración
            </button>
          </>
        )}
        {paso === 3 && (
          <form onSubmit={cambiar}>
            <label>
              Nueva contraseña
              <input
                name="clave"
                type="password"
                required
                minLength={8}
              />
            </label>
            <label>
              Repetir contraseña
              <input
                name="confirmar"
                type="password"
                required
              />
            </label>
            <button className="neg-boton">Guardar contraseña</button>
          </form>
        )}
        {paso === 4 && (
          <>
            <p className="neg-exito">
              Contraseña actualizada. Usa la nueva clave al ingresar.
            </p>
            <a
              href="/ingresar"
              className="neg-boton"
            >
              Iniciar sesión
            </a>
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
      </section>
    </Marco>
  );
}
