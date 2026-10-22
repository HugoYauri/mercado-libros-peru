import { useState } from 'react';
import MarcoCuenta from './MarcoCuenta.jsx';
import Enlace from '../compartido/Enlace.jsx';
import { Modal } from '../compartido/Marco.jsx';
import { CampoClave, CuentaCreada } from './ComponentesCuenta.jsx';

export default function Registro() {
  const carreras = [
    'Administración',
    'Ingeniería de Sistemas',
    'Ingeniería Industrial',
    'Contabilidad',
    'Economía',
  ];
  const [creada, setCreada] = useState(false);
  const [error, setError] = useState('');
  function registrar(event) {
    event.preventDefault();
    const datos = new FormData(event.currentTarget);
    if (datos.get('clave') !== datos.get('confirmar')) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setError('');
    setCreada(true);
  }
  return (
    <MarcoCuenta clase="hu1-centrado">
      <section className="hu1-panel hu1-registro">
        <h1>Crear cuenta</h1>
        <p className="hu1-intro">
          Solo para estudiantes con correo institucional. Completa tus datos para participar en el
          tablón.
        </p>
        {error && (
          <p className="hu1-aviso hu1-aviso-error" role="alert">
            {error}
          </p>
        )}
        <form className="hu1-formulario hu1-dos-columnas" onSubmit={registrar}>
          <div className="hu1-campo">
            <label htmlFor="nombres">Nombres</label>
            <input id="nombres" name="nombres" autoComplete="given-name" required />
          </div>
          <div className="hu1-campo">
            <label htmlFor="apellidos">Apellidos</label>
            <input id="apellidos" name="apellidos" autoComplete="family-name" required />
          </div>
          <div className="hu1-campo hu1-completo">
            <label htmlFor="correo-registro">Correo institucional</label>
            <input
              id="correo-registro"
              name="correo"
              type="email"
              pattern="[^@ ]+@aloe\.ulima\.edu\.pe"
              title="Usa @aloe.ulima.edu.pe"
              required
            />
          </div>
          <CampoClave
            autoComplete="new-password"
            required
            minLength={8}
            pattern="(?=.*[A-Z])(?=.*[0-9]).{8,}"
            ayuda="Mínimo 8 caracteres, una mayúscula y un número."
          />
          <CampoClave
            etiqueta="Confirmar contraseña"
            name="confirmar"
            autoComplete="new-password"
            required
          />
          <div className="hu1-campo">
            <label htmlFor="carrera">Carrera</label>
            <select id="carrera" name="carrera" defaultValue="" required>
              <option value="">Selecciona tu carrera</option>
              {carreras.map((carrera) => (
                <option key={carrera}>{carrera}</option>
              ))}
            </select>
          </div>
          <div className="hu1-campo">
            <label htmlFor="ciclo">Ciclo</label>
            <select id="ciclo" name="ciclo">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((ciclo) => (
                <option key={ciclo}>{ciclo}</option>
              ))}
            </select>
          </div>
          <div className="hu1-completo">
            <label className="hu1-casilla">
              <input type="checkbox" required />
              <span>
                Acepto las{' '}
                <Enlace className="hu1-enlace" href="/#normas" target="_blank">
                  normas de convivencia del tablón
                </Enlace>{' '}
                y el registro de mis acuerdos.
              </span>
            </label>
          </div>
          <div className="hu1-acciones hu1-acciones-final hu1-completo">
            <Enlace className="hu1-enlace" href="/">
              Cancelar
            </Enlace>
            <button className="hu1-boton">Crear cuenta</button>
          </div>
        </form>
      </section>
      {creada && (
        <Modal titulo="Cuenta creada" className="hu1-modal" cerrar={() => setCreada(false)}>
          <CuentaCreada ejemplo />
        </Modal>
      )}
    </MarcoCuenta>
  );
}
