import { useState } from 'react';
import { claveValida, registrarUsuario } from '../../assets/js/compartido/sesion.js';
import { Modal } from '../compartido/Marco.jsx';
import MarcoCuenta from './MarcoCuenta.jsx';
import { AvisoCuenta, CampoClave, CuentaCreada, carreras } from './ComponentesCuenta.jsx';

export default function Registro() {
  const [datos, setDatos] = useState({
    nombres: '',
    apellidos: '',
    correo: '',
    clave: '',
    confirmar: '',
    carrera: '',
    ciclo: '1',
    normas: false,
  });
  const [tocados, setTocados] = useState({});
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');
  const [creada, setCreada] = useState(false);

  const errores = {};
  if (!datos.nombres.trim()) errores.nombres = 'Completa tus nombres.';
  if (!datos.apellidos.trim()) errores.apellidos = 'Completa tus apellidos.';
  if (!/^[^\s@]+@aloe\.ulima\.edu\.pe$/i.test(datos.correo.trim()))
    errores.correo = 'El correo debe terminar en @aloe.ulima.edu.pe.';
  if (!claveValida(datos.clave))
    errores.clave = 'Mínimo 8 caracteres, una mayúscula y un número.';
  if (!datos.confirmar || datos.clave !== datos.confirmar)
    errores.confirmar = 'Las contraseñas no coinciden.';
  if (!datos.carrera) errores.carrera = 'Selecciona tu carrera.';
  if (!datos.normas) errores.normas = 'Debes aceptar las normas del tablón.';
  const visibles = Object.keys(errores).filter((campo) => enviado || tocados[campo]);

  function cambiar(event) {
    const { name, type, checked, value } = event.target;
    setDatos({ ...datos, [name]: type === 'checkbox' ? checked : value });
    setError('');
  }
  function marcar(event) {
    setTocados({ ...tocados, [event.target.name]: true });
  }
  function registrar(event) {
    event.preventDefault();
    setEnviado(true);
    const camposInvalidos = Object.keys(errores);
    if (camposInvalidos.length) {
      event.currentTarget.elements.namedItem(camposInvalidos[0])?.focus();
      return;
    }
    try {
      registrarUsuario(datos);
      setCreada(true);
    } catch (problema) {
      setError(problema.message);
    }
  }
  function errorCampo(campo) {
    return enviado || tocados[campo] ? errores[campo] : '';
  }

  return (
    <MarcoCuenta clase="hu1-centrado">
      <section className="hu1-panel hu1-registro">
        <h1>Crear cuenta</h1>
        <p className="hu1-intro">
          Solo para estudiantes con correo institucional. Completa tus datos para
          participar en el tablón.
        </p>
        {visibles.length > 0 && (
          <AvisoCuenta>
            <strong>
              Revisa {visibles.length} {visibles.length === 1 ? 'campo' : 'campos'}.
            </strong>{' '}
            Corrige lo marcado en rojo para continuar.
          </AvisoCuenta>
        )}
        {error && <AvisoCuenta>{error}</AvisoCuenta>}
        <form
          className="hu1-formulario hu1-dos-columnas"
          onSubmit={registrar}
          noValidate
        >
          <div className="hu1-campo">
            <label htmlFor="registro-nombres">Nombres</label>
            <input
              id="registro-nombres"
              name="nombres"
              value={datos.nombres}
              onChange={cambiar}
              onBlur={marcar}
              autoComplete="given-name"
              required
              maxLength={60}
              aria-invalid={!!errorCampo('nombres')}
              aria-describedby={errorCampo('nombres') ? 'error-nombres' : undefined}
            />
            {errorCampo('nombres') && (
              <p
                id="error-nombres"
                className="hu1-error-campo"
              >
                {errores.nombres}
              </p>
            )}
          </div>
          <div className="hu1-campo">
            <label htmlFor="registro-apellidos">Apellidos</label>
            <input
              id="registro-apellidos"
              name="apellidos"
              value={datos.apellidos}
              onChange={cambiar}
              onBlur={marcar}
              autoComplete="family-name"
              required
              maxLength={60}
              aria-invalid={!!errorCampo('apellidos')}
              aria-describedby={errorCampo('apellidos') ? 'error-apellidos' : undefined}
            />
            {errorCampo('apellidos') && (
              <p
                id="error-apellidos"
                className="hu1-error-campo"
              >
                {errores.apellidos}
              </p>
            )}
          </div>
          <div className="hu1-campo hu1-completo">
            <label htmlFor="registro-correo">Correo institucional</label>
            <input
              id="registro-correo"
              name="correo"
              type="email"
              value={datos.correo}
              onChange={cambiar}
              onBlur={marcar}
              autoComplete="email"
              required
              aria-invalid={!!errorCampo('correo')}
              aria-describedby={errorCampo('correo') ? 'error-correo' : undefined}
            />
            {errorCampo('correo') && (
              <p
                id="error-correo"
                className="hu1-error-campo"
              >
                {errores.correo}
              </p>
            )}
          </div>
          <CampoClave
            value={datos.clave}
            onChange={cambiar}
            onBlur={marcar}
            autoComplete="new-password"
            required
            minLength={8}
            error={errorCampo('clave')}
            correcta={claveValida(datos.clave)}
            ayuda={
              claveValida(datos.clave)
                ? 'Cumple los 8 caracteres, una mayúscula y un número.'
                : 'Mínimo 8 caracteres, una mayúscula y un número.'
            }
          />
          <CampoClave
            etiqueta="Confirmar contraseña"
            name="confirmar"
            value={datos.confirmar}
            onChange={cambiar}
            onBlur={marcar}
            autoComplete="new-password"
            required
            error={errorCampo('confirmar')}
            correcta={!!datos.confirmar && !errores.confirmar}
          />
          <div className="hu1-campo">
            <label htmlFor="registro-carrera">Carrera</label>
            <select
              id="registro-carrera"
              name="carrera"
              value={datos.carrera}
              onChange={cambiar}
              onBlur={marcar}
              required
              aria-invalid={!!errorCampo('carrera')}
              aria-describedby={errorCampo('carrera') ? 'error-carrera' : undefined}
            >
              <option value="">Selecciona tu carrera</option>
              {carreras.map((carrera) => (
                <option key={carrera}>{carrera}</option>
              ))}
            </select>
            {errorCampo('carrera') && (
              <p
                id="error-carrera"
                className="hu1-error-campo"
              >
                {errores.carrera}
              </p>
            )}
          </div>
          <div className="hu1-campo">
            <label htmlFor="registro-ciclo">Ciclo</label>
            <select
              id="registro-ciclo"
              name="ciclo"
              value={datos.ciclo}
              onChange={cambiar}
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
          </div>
          <div className="hu1-completo">
            <label className="hu1-casilla">
              <input
                type="checkbox"
                name="normas"
                checked={datos.normas}
                onChange={cambiar}
                required
                aria-invalid={!!errorCampo('normas')}
                aria-describedby={errorCampo('normas') ? 'error-normas' : undefined}
              />
              <span>
                Acepto las{' '}
                <a
                  className="hu1-enlace"
                  href="/#normas"
                  target="_blank"
                  rel="noreferrer"
                >
                  normas de convivencia del tablón
                </a>{' '}
                y el registro de mis acuerdos.
              </span>
            </label>
            {errorCampo('normas') && (
              <p
                id="error-normas"
                className="hu1-error-campo"
              >
                {errores.normas}
              </p>
            )}
          </div>
          <div className="hu1-acciones hu1-acciones-final hu1-completo">
            <a
              className="hu1-enlace"
              href="/"
            >
              Cancelar
            </a>
            <button className="hu1-boton">Crear cuenta</button>
          </div>
        </form>
      </section>
      {creada && (
        <Modal
          titulo="Cuenta creada"
          className="hu1-modal"
          cerrar={() => location.assign('/ingresar')}
        >
          <CuentaCreada />
        </Modal>
      )}
    </MarcoCuenta>
  );
}
