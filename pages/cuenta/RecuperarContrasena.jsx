import { useState } from 'react';
import {
  solicitarRecuperacion,
  recuperarClave,
  claveValida,
} from '../../assets/js/compartido/sesion.js';
import MarcoCuenta from './MarcoCuenta.jsx';
import { AvisoCuenta, CampoClave } from './ComponentesCuenta.jsx';

export default function RecuperarContrasena() {
  const [paso, setPaso] = useState(1);
  const [token, setToken] = useState('');
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');

  function enviar(event) {
    event.preventDefault();
    try {
      setToken(solicitarRecuperacion(correo));
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
      setClave('');
      setPaso(4);
    } catch (problema) {
      setError(problema.message);
    }
  }

  return (
    <MarcoCuenta clase="hu1-centrado">
      <div className="hu1-recuperacion">
        <ol
          className="hu1-pasos"
          aria-label="Pasos de recuperación"
        >
          {['Correo', 'Enlace', 'Nueva contraseña'].map((nombre, i) => (
            <li
              key={nombre}
              aria-current={Math.min(paso, 3) === i + 1 ? 'step' : undefined}
            >
              Paso {i + 1} · {nombre}
            </li>
          ))}
        </ol>
        {paso === 1 && (
          <section className="hu1-panel">
            <h1>Ingresa tu correo institucional</h1>
            <p className="hu1-intro">
              Genera un enlace para crear una nueva contraseña. El enlace vence en 15
              minutos.
            </p>
            <form
              className="hu1-formulario"
              onSubmit={enviar}
            >
              <div className="hu1-campo">
                <label htmlFor="correo-recuperacion">Correo institucional</label>
                <input
                  id="correo-recuperacion"
                  name="correo"
                  type="email"
                  autoComplete="email"
                  value={correo}
                  onChange={(event) => setCorreo(event.target.value)}
                  required
                  placeholder="tu.correo@aloe.ulima.edu.pe"
                />
              </div>
              {error && <AvisoCuenta>{error}</AvisoCuenta>}
              <div
                className="hu1-acciones"
                style={{ justifyContent: 'space-between' }}
              >
                <a
                  className="hu1-enlace"
                  href="/ingresar"
                >
                  Volver al inicio de sesión
                </a>
                <button className="hu1-boton">Solicitar enlace</button>
              </div>
            </form>
          </section>
        )}
        {paso === 2 && (
          <section
            className="hu1-panel"
            aria-live="polite"
          >
            <span
              className="hu1-icono-correo"
              aria-hidden="true"
            >
              ✉
            </span>
            <h1>Enlace de recuperación generado</h1>
            <p className="hu1-intro">
              La solicitud corresponde a <strong>{correo.trim().toLowerCase()}</strong>.
              Puedes abrir el enlace de demostración para continuar.
            </p>
            <AvisoCuenta tipo="info">
              El enlace vence en 15 minutos y solo se usa una vez.
            </AvisoCuenta>
            <button
              className="hu1-boton"
              onClick={() => setPaso(3)}
            >
              Abrir enlace de demostración
            </button>
            <div className="hu1-acciones">
              <button
                className="hu1-enlace"
                onClick={() => {
                  setError('');
                  setPaso(1);
                }}
              >
                Volver a solicitar un enlace
              </button>
            </div>
          </section>
        )}
        {paso === 3 && (
          <section className="hu1-panel">
            <h1>Crea tu nueva contraseña</h1>
            <form
              className="hu1-formulario"
              onSubmit={cambiar}
            >
              <div>
                <CampoClave
                  etiqueta="Nueva contraseña"
                  autoComplete="new-password"
                  value={clave}
                  onChange={(event) => setClave(event.target.value)}
                  required
                  minLength={8}
                  ayuda="Mínimo 8 caracteres, con una mayúscula y un número."
                  correcta={claveValida(clave)}
                />
                <div
                  className="hu1-fuerza"
                  aria-label={
                    claveValida(clave)
                      ? 'La contraseña cumple los requisitos'
                      : 'La contraseña todavía no cumple los requisitos'
                  }
                >
                  {[clave.length >= 8, /[A-Z]/.test(clave), /[0-9]/.test(clave)].map(
                    (cumple, i) => (
                      <span
                        key={i}
                        className={cumple ? 'hu1-fuerza-activa' : ''}
                      />
                    ),
                  )}
                </div>
              </div>
              <CampoClave
                etiqueta="Confirmar contraseña"
                name="confirmar"
                autoComplete="new-password"
                required
              />
              {error && <AvisoCuenta>{error}</AvisoCuenta>}
              <button className="hu1-boton hu1-ancho">Guardar contraseña</button>
            </form>
          </section>
        )}
        {paso === 4 && (
          <section
            className="hu1-panel hu1-cuenta-creada"
            aria-live="polite"
          >
            <span
              className="hu1-icono-exito"
              aria-hidden="true"
            >
              ✓
            </span>
            <h1>Contraseña actualizada</h1>
            <p>Ya puedes iniciar sesión con tu nueva contraseña.</p>
            <a
              className="hu1-boton"
              href="/ingresar"
            >
              Ir a iniciar sesión
            </a>
          </section>
        )}
        <p className="hu1-recuperacion-pie">
          Demostración local: el enlace se muestra en esta pantalla. El envío de correos
          estará disponible al conectar ese servicio.
        </p>
        <p className="hu1-recuperacion-pie">
          Ayuda:{' '}
          <a
            className="hu1-enlace"
            href="mailto:tablon@ulima.edu.pe"
          >
            tablon@ulima.edu.pe
          </a>
        </p>
      </div>
    </MarcoCuenta>
  );
}
