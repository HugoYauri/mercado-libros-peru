import { useState } from 'react';
import MarcoCuenta from './MarcoCuenta.jsx';
import { CampoClave } from './ComponentesCuenta.jsx';

export default function MiCuenta() {
  const ejemplos = [
    {
      nombres: 'Estudiante',
      apellidos: 'de ejemplo',
      correo: 'estudiante@aloe.ulima.edu.pe',
      carrera: 'Administración',
      ciclo: 5,
    },
  ];
  const actividad = [
    ['Avisos publicados', 3],
    ['Acuerdos cerrados', 2],
    ['Entregas confirmadas por mí', 2],
  ];
  const [persona, setPersona] = useState(ejemplos[0]);
  const [mensaje, setMensaje] = useState('');
  function guardar(event) {
    event.preventDefault();
    setPersona({ ...persona, ...Object.fromEntries(new FormData(event.currentTarget)) });
    setMensaje('Datos de ejemplo actualizados.');
  }
  function cambiarClave(event) {
    event.preventDefault();
    const datos = new FormData(event.currentTarget);
    setMensaje(
      datos.get('nueva') === datos.get('confirmar')
        ? 'Cambio de contraseña de ejemplo completado.'
        : 'Las contraseñas no coinciden.',
    );
  }
  return (
    <MarcoCuenta privado>
      <div className="hu1-perfil-titulo">
        <h1>Mi cuenta</h1>
        <p>
          {persona.nombres} {persona.apellidos} · {persona.carrera}, ciclo {persona.ciclo}
        </p>
      </div>
      {mensaje && (
        <p className="hu1-aviso hu1-aviso-info" role="status">
          {mensaje}
        </p>
      )}
      <div className="hu1-perfil-rejilla">
        <section className="hu1-panel">
          <h2>Datos personales</h2>
          <form className="hu1-formulario" onSubmit={guardar}>
            <div className="hu1-campo">
              <label htmlFor="cuenta-nombres">Nombres</label>
              <input id="cuenta-nombres" name="nombres" defaultValue={persona.nombres} required />
            </div>
            <div className="hu1-campo">
              <label htmlFor="cuenta-apellidos">Apellidos</label>
              <input
                id="cuenta-apellidos"
                name="apellidos"
                defaultValue={persona.apellidos}
                required
              />
            </div>
            <div className="hu1-campo">
              <label htmlFor="cuenta-correo">Correo institucional</label>
              <input id="cuenta-correo" value={persona.correo} readOnly />
              <p className="hu1-ayuda">No editable.</p>
            </div>
            <div className="hu1-campo">
              <label htmlFor="cuenta-telefono">Teléfono de contacto</label>
              <input
                id="cuenta-telefono"
                name="telefono"
                type="tel"
                pattern="[0-9]{9}"
                maxLength={9}
              />
            </div>
            <div className="hu1-dos-columnas">
              <div className="hu1-campo">
                <label htmlFor="cuenta-carrera">Carrera</label>
                <select id="cuenta-carrera" name="carrera" defaultValue={persona.carrera}>
                  <option>Administración</option>
                  <option>Ingeniería de Sistemas</option>
                  <option>Ingeniería Industrial</option>
                </select>
              </div>
              <div className="hu1-campo">
                <label htmlFor="cuenta-ciclo">Ciclo</label>
                <input
                  id="cuenta-ciclo"
                  type="number"
                  name="ciclo"
                  min={1}
                  max={12}
                  defaultValue={persona.ciclo}
                />
              </div>
            </div>
            <div className="hu1-acciones">
              <button className="hu1-boton">Guardar cambios</button>
              <button className="hu1-enlace" type="reset">
                Descartar
              </button>
            </div>
          </form>
        </section>
        <section className="hu1-panel">
          <h2>Cambiar contraseña</h2>
          <form className="hu1-formulario" onSubmit={cambiarClave}>
            <CampoClave etiqueta="Contraseña actual" name="actual" required />
            <CampoClave
              etiqueta="Nueva contraseña"
              name="nueva"
              minLength={8}
              pattern="(?=.*[A-Z])(?=.*[0-9]).{8,}"
              required
              ayuda="Mínimo 8 caracteres, una mayúscula y un número."
            />
            <CampoClave etiqueta="Confirmar nueva contraseña" name="confirmar" required />
            <button className="hu1-boton hu1-ancho">Actualizar contraseña</button>
          </form>
          <div className="hu1-preferencias">
            <h2>Punto de encuentro preferido</h2>
            <div className="hu1-puntos">
              <button disabled>Biblioteca</button>
              <button disabled>Cafetería central</button>
            </div>
          </div>
        </section>
        <aside className="hu1-lateral">
          <section className="hu1-panel hu1-tarjeta-perfil">
            <div className="hu1-avatar-grande">EE</div>
            <h3>
              {persona.nombres} {persona.apellidos}
            </h3>
            <p>Reputación 4.8 · 2 acuerdos cerrados</p>
            <button className="hu1-secundario" disabled>
              Cambiar fotografía
            </button>
          </section>
          <section className="hu1-panel hu1-actividad">
            <h2>Mi actividad</h2>
            <dl>
              {actividad.map(([titulo, cantidad]) => (
                <div key={titulo}>
                  <dt>{titulo}</dt>
                  <dd>{cantidad}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section className="hu1-panel hu1-cerrar-sesion">
            <div>
              <h2>Cerrar sesión</h2>
              <p>En este dispositivo</p>
            </div>
            <button onClick={() => setMensaje('Ejemplo de cierre de sesión completado.')}>
              Salir
            </button>
          </section>
        </aside>
      </div>
    </MarcoCuenta>
  );
}
