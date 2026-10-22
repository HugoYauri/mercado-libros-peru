import { useState } from 'react';
import MarcoCuenta from './MarcoCuenta.jsx';
import Enlace from '../compartido/Enlace.jsx';
import { CampoClave } from './ComponentesCuenta.jsx';

export default function RecuperarContrasena() {
  const pasos = ['Correo', 'Enlace', 'Nueva contraseña'];
  const [paso, setPaso] = useState(1);
  const [error, setError] = useState('');
  function guardar(event) {
    event.preventDefault();
    const datos = new FormData(event.currentTarget);
    if (datos.get('clave') !== datos.get('confirmar')) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setError('');
    setPaso(4);
  }
  return (
    <MarcoCuenta clase="hu1-centrado">
      <div className="hu1-recuperacion">
        <ol className="hu1-pasos">
          {pasos.map((nombre, i) => (
            <li key={nombre} aria-current={Math.min(paso, 3) === i + 1 ? 'step' : undefined}>
              Paso {i + 1} · {nombre}
            </li>
          ))}
        </ol>
        {paso === 1 && (
          <section className="hu1-panel">
            <h1>Ingresa tu correo institucional</h1>
            <p className="hu1-intro">Solicita un enlace para crear una nueva contraseña.</p>
            <form
              className="hu1-formulario"
              onSubmit={(event) => {
                event.preventDefault();
                setPaso(2);
              }}
            >
              <div className="hu1-campo">
                <label htmlFor="correo-recuperacion">Correo institucional</label>
                <input
                  id="correo-recuperacion"
                  type="email"
                  pattern="[^@ ]+@aloe\.ulima\.edu\.pe"
                  placeholder="tu.correo@aloe.ulima.edu.pe"
                  required
                />
              </div>
              <div className="hu1-acciones">
                <Enlace className="hu1-enlace" href="/ingresar">
                  Volver al inicio de sesión
                </Enlace>
                <button className="hu1-boton">Solicitar enlace</button>
              </div>
            </form>
          </section>
        )}
        {paso === 2 && (
          <section className="hu1-panel">
            <span className="hu1-icono-correo" aria-hidden="true">
              ✉
            </span>
            <h1>Enlace de recuperación generado</h1>
            <p className="hu1-intro">Abre el enlace de ejemplo para continuar.</p>
            <button className="hu1-boton" onClick={() => setPaso(3)}>
              Abrir enlace de ejemplo
            </button>
            <div className="hu1-acciones">
              <button className="hu1-enlace" onClick={() => setPaso(1)}>
                Volver a solicitar un enlace
              </button>
            </div>
          </section>
        )}
        {paso === 3 && (
          <section className="hu1-panel">
            <h1>Crea una nueva contraseña</h1>
            <form className="hu1-formulario" onSubmit={guardar}>
              <CampoClave
                etiqueta="Nueva contraseña"
                required
                minLength={8}
                pattern="(?=.*[A-Z])(?=.*[0-9]).{8,}"
                ayuda="Mínimo 8 caracteres, una mayúscula y un número."
              />
              <CampoClave etiqueta="Confirmar contraseña" name="confirmar" required />
              {error && (
                <p className="hu1-aviso hu1-aviso-error" role="alert">
                  {error}
                </p>
              )}
              <button className="hu1-boton hu1-ancho">Guardar contraseña</button>
            </form>
          </section>
        )}
        {paso === 4 && (
          <section className="hu1-panel hu1-cuenta-creada">
            <span className="hu1-icono-exito">✓</span>
            <h1>Contraseña actualizada</h1>
            <p>Ejemplo de recuperación completado.</p>
            <Enlace className="hu1-boton" href="/ingresar">
              Ir a iniciar sesión
            </Enlace>
          </section>
        )}
        <p className="hu1-recuperacion-pie">El enlace es ilustrativo; no se envían correos.</p>
      </div>
    </MarcoCuenta>
  );
}
