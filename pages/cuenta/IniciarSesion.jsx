import { useState } from 'react';
import { iniciarSesion } from '../../assets/js/compartido/sesion.js';
import MarcoCuenta from './MarcoCuenta.jsx';
import { AvisoCuenta, CampoClave } from './ComponentesCuenta.jsx';

export default function IniciarSesion() {
  const [error, setError] = useState('');
  const [ingresando, setIngresando] = useState(false);

  function ingresar(event) {
    event.preventDefault();
    const datos = new FormData(event.currentTarget);
    setIngresando(true);
    try {
      const usuario = iniciarSesion(datos.get('correo'), datos.get('clave'));
      const destino = new URLSearchParams(location.search).get('returnTo');
      let ruta = usuario.rol === 'administrador' ? '/administracion' : '/mi-cuenta';
      if (destino && destino.startsWith('/') && !destino.startsWith('//')) {
        ruta = destino;
      }
      window.location.assign(ruta);
    } catch (problema) {
      setError(problema.message);
      setIngresando(false);
    }
  }

  return (
    <MarcoCuenta>
      <div className="hu1-login">
        <section
          className="hu1-testimonio"
          aria-label="Testimonio del mockup"
        >
          <div className="hu1-foto-ejemplo hu1-foto-campus">
            fotografía · patio del campus
          </div>
          <blockquote>
            «Vendí mis libros de Cálculo en tres días y compré los de Física del ciclo
            siguiente.»
          </blockquote>
          <p>Rosa María Quispe Ríos · Administración</p>
        </section>
        <section className="hu1-login-derecha">
          <div className="hu1-login-formulario">
            <h1>Iniciar sesión</h1>
            <p className="hu1-intro">
              Usa tu correo institucional @aloe.ulima.edu.pe para ofertar, publicar y
              coordinar entregas.
            </p>
            {error && (
              <AvisoCuenta>
                <strong>No pudimos ingresar.</strong> {error}
              </AvisoCuenta>
            )}
            <form
              className="hu1-formulario"
              onSubmit={ingresar}
              aria-busy={ingresando}
            >
              <div className="hu1-campo">
                <label htmlFor="correo-login">Correo institucional</label>
                <input
                  id="correo-login"
                  name="correo"
                  type="email"
                  autoComplete="username"
                  placeholder="tu.correo@aloe.ulima.edu.pe"
                  required
                  disabled={ingresando}
                />
              </div>
              <CampoClave
                autoComplete="current-password"
                required
                disabled={ingresando}
              />
              <div className="hu1-login-opciones">
                <span className="hu1-ayuda">Sesión en este navegador</span>
                <a
                  className="hu1-enlace"
                  href="/recuperar-contrasena"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <button
                className="hu1-boton hu1-ancho"
                disabled={ingresando}
              >
                {ingresando ? 'Verificando…' : 'Ingresar'}
              </button>
            </form>
            <p className="hu1-login-pie">
              ¿No tienes cuenta?{' '}
              <a
                className="hu1-enlace"
                href="/registro"
              >
                Crear cuenta
              </a>
            </p>
            <details className="hu1-demo">
              <summary>Cuentas para probar el avance</summary>
              <p>Rosa: rosa.quispe@aloe.ulima.edu.pe / Rosa2026!</p>
              <p>Diego: diego.salazar@aloe.ulima.edu.pe / Diego2026!</p>
              <p>Administración: admin@aloe.ulima.edu.pe / Admin2026!</p>
              <p>Son cuentas locales de demostración. No uses contraseñas personales.</p>
            </details>
          </div>
        </section>
      </div>
    </MarcoCuenta>
  );
}
