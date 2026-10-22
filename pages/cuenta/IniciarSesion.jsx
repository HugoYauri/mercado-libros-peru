import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MarcoCuenta from './MarcoCuenta.jsx';
import Enlace from '../compartido/Enlace.jsx';
import { CampoClave } from './ComponentesCuenta.jsx';

export default function IniciarSesion() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  function ingresar(event) {
    event.preventDefault();
    const datos = new FormData(event.currentTarget);
    if (!/^[^\s@]+@aloe\.ulima\.edu\.pe$/i.test(datos.get('correo').trim())) {
      setError('Usa tu correo institucional @aloe.ulima.edu.pe.');
      return;
    }
    navigate('/mi-cuenta');
  }
  return (
    <MarcoCuenta>
      <div className="hu1-login">
        <section className="hu1-testimonio" aria-label="Comunidad universitaria">
          <div className="hu1-foto-ejemplo hu1-foto-campus">fotografía · patio del campus</div>
          <blockquote>
            Encuentra materiales académicos y coordina intercambios dentro del campus.
          </blockquote>
          <p>Comunidad ULima</p>
        </section>
        <section className="hu1-login-derecha">
          <div className="hu1-login-formulario">
            <h1>Iniciar sesión</h1>
            <p className="hu1-intro">
              Usa tu correo institucional @aloe.ulima.edu.pe para ofertar, publicar y coordinar
              entregas.
            </p>
            {error && (
              <p className="hu1-aviso hu1-aviso-error" role="alert">
                {error}
              </p>
            )}
            <form className="hu1-formulario" onSubmit={ingresar}>
              <div className="hu1-campo">
                <label htmlFor="correo-login">Correo institucional</label>
                <input
                  id="correo-login"
                  name="correo"
                  type="email"
                  autoComplete="username"
                  placeholder="tu.correo@aloe.ulima.edu.pe"
                  required
                />
              </div>
              <CampoClave
                autoComplete="current-password"
                required
                minLength={8}
                pattern="(?=.*[A-Z])(?=.*[0-9]).{8,}"
                title="Mínimo 8 caracteres, una mayúscula y un número."
              />
              <div className="hu1-login-opciones">
                <label className="hu1-casilla">
                  <input type="checkbox" />
                  Recordarme
                </label>
                <Enlace className="hu1-enlace" href="/recuperar-contrasena">
                  ¿Olvidaste tu contraseña?
                </Enlace>
              </div>
              <button className="hu1-boton hu1-ancho">Ingresar</button>
            </form>
            <p className="hu1-login-pie">
              ¿No tienes cuenta?{' '}
              <Enlace className="hu1-enlace" href="/registro">
                Crear cuenta
              </Enlace>
            </p>
          </div>
        </section>
      </div>
    </MarcoCuenta>
  );
}
