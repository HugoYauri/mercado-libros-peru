import { useState } from 'react';
import { registrarUsuario } from '../../assets/js/compartido/sesion.js';
import Marco, { Modal } from '../compartido/Marco.jsx';

export default function Registro() {
  const [error, setError] = useState('');
  const [creada, setCreada] = useState(false);
  function registrar(event) {
    event.preventDefault();
    const datos = Object.fromEntries(new FormData(event.currentTarget));
    try {
      if (datos.clave !== datos.confirmar)
        throw new Error('Las contraseñas no coinciden.');
      if (!datos.normas) throw new Error('Debes aceptar las normas del tablón.');
      registrarUsuario(datos);
      setCreada(true);
    } catch (problema) {
      setError(problema.message);
    }
  }
  return (
    <Marco
      titulo="Crear cuenta"
      descripcion="Completa tus datos para participar en el tablón de la universidad."
    >
      <form
        className="neg-tarjeta formulario-corto"
        onSubmit={registrar}
      >
        <label>
          Nombres
          <input
            name="nombres"
            required
            maxLength={60}
          />
        </label>
        <label>
          Apellidos
          <input
            name="apellidos"
            required
            maxLength={60}
          />
        </label>
        <label>
          Correo institucional
          <input
            name="correo"
            type="email"
            required
          />
        </label>
        <label>
          Carrera
          <select
            name="carrera"
            required
          >
            <option value="">Selecciona</option>
            {[
              'Administración',
              'Ingeniería de Sistemas',
              'Ingeniería Industrial',
              'Contabilidad',
              'Economía',
              'Arquitectura',
              'Comunicación',
              'Derecho',
              'Psicología',
            ].map((valor) => (
              <option key={valor}>{valor}</option>
            ))}
          </select>
        </label>
        <label>
          Ciclo
          <select
            name="ciclo"
            required
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option
                key={i}
                value={i + 1}
              >
                {i + 1}
              </option>
            ))}
          </select>
        </label>
        <label>
          Contraseña
          <input
            name="clave"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
          />
        </label>
        <p className="neg-ayuda">Mínimo 8 caracteres, una mayúscula y un número.</p>
        <label>
          Confirmar contraseña
          <input
            name="confirmar"
            type="password"
            autoComplete="new-password"
            required
          />
        </label>
        <label className="casilla">
          <input
            name="normas"
            type="checkbox"
            required
          />{' '}
          Acepto las normas del tablón
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
          <button className="neg-boton">Crear cuenta</button>
          <a href="/ingresar">Ya tengo cuenta</a>
        </div>
      </form>
      {creada && (
        <Modal
          titulo="Cuenta creada"
          cerrar={() => location.assign('/ingresar')}
        >
          <p className="neg-ayuda">
            Tu cuenta quedó registrada. Ya puedes iniciar sesión.
          </p>
          <a
            className="neg-boton"
            href="/ingresar"
          >
            Iniciar sesión
          </a>
        </Modal>
      )}
    </Marco>
  );
}
