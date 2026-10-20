import { useState } from 'react';
import { Modal } from '../compartido/Marco.jsx';
import { AvisoCuenta, CampoClave, CuentaCreada } from './ComponentesCuenta.jsx';
import '../../assets/css/cuenta.css';

export default function MensajesAcceso() {
  const [abierto, setAbierto] = useState(false);
  return (
    <div className="hu1-app">
      <main
        className="hu1-galeria"
        aria-label="Ejemplos visuales de mensajes y modales de acceso"
      >
        <div>
          <section>
            <h1 className="hu1-sobretitulo">Error de credenciales</h1>
            <div className="hu1-panel">
              <AvisoCuenta>
                <strong>No pudimos ingresar.</strong> El correo o la contraseña no
                coinciden.
              </AvisoCuenta>
              <CampoClave
                defaultValue="123456"
                error="Verifica tu contraseña."
                autoComplete="off"
              />
              <p className="hu1-ayuda">
                Después de cuatro intentos incorrectos, espera un minuto.
              </p>
            </div>
          </section>
          <section>
            <h2 className="hu1-sobretitulo">Botón en estado de carga</h2>
            <div className="hu1-panel">
              <button
                className="hu1-boton hu1-ancho"
                disabled
              >
                ◌ Verificando…
              </button>
              <p className="hu1-ayuda">
                El botón y los campos quedan deshabilitados mientras se validan las
                credenciales.
              </p>
            </div>
          </section>
          <section className="hu1-panel">
            <h2 className="hu1-sobretitulo">Pantallas de acceso</h2>
            <p className="hu1-ayuda">
              Galería de ejemplos. Estos controles no modifican ninguna cuenta.
            </p>
            <div className="hu1-actividad-enlaces">
              <a
                className="hu1-enlace"
                href="/ingresar"
              >
                Ingresar
              </a>
              <a
                className="hu1-enlace"
                href="/registro"
              >
                Crear cuenta
              </a>
              <a
                className="hu1-enlace"
                href="/recuperar-contrasena"
              >
                Recuperar contraseña
              </a>
              <a
                className="hu1-enlace"
                href="/acceso-denegado"
              >
                Acceso denegado
              </a>
              <a
                className="hu1-enlace"
                href="/no-encontrado"
              >
                Página 404
              </a>
            </div>
          </section>
        </div>
        <div>
          <section>
            <h2 className="hu1-sobretitulo">Cuenta creada · Confirmación</h2>
            <div className="hu1-fondo-modal">
              <div className="hu1-panel">
                <CuentaCreada ejemplo />
              </div>
            </div>
            <button
              className="hu1-enlace"
              style={{ marginTop: 12 }}
              onClick={() => setAbierto(true)}
            >
              Ver ejemplo de confirmación
            </button>
          </section>
          <section>
            <h2 className="hu1-sobretitulo">Recuperación · Paso 2 de 3</h2>
            <div className="hu1-panel">
              <span
                className="hu1-icono-correo"
                aria-hidden="true"
              >
                ✉
              </span>
              <h3>Enlace de recuperación generado</h3>
              <p className="hu1-intro">
                En esta demostración el enlace se abre desde la pantalla de recuperación.
              </p>
              <div
                className="hu1-aviso hu1-aviso-info"
                style={{ marginTop: 16 }}
              >
                Vence en <strong>15 minutos</strong> y solo se utiliza una vez.
              </div>
            </div>
          </section>
        </div>
        <div>
          <section>
            <h2 className="hu1-sobretitulo">Recuperación · Paso 3 de 3</h2>
            <div className="hu1-panel">
              <h3>Crea tu nueva contraseña</h3>
              <CampoClave
                etiqueta="Nueva contraseña"
                defaultValue="Ejemplo2026"
                autoComplete="off"
                ayuda="Mínimo 8 caracteres, con una mayúscula y un número."
              />
              <div
                className="hu1-fuerza"
                aria-hidden="true"
              >
                <span className="hu1-fuerza-activa" />
                <span className="hu1-fuerza-activa" />
                <span className="hu1-fuerza-activa" />
              </div>
              <CampoClave
                etiqueta="Confirmar contraseña"
                name="confirmar"
                defaultValue="Ejemplo2026"
                autoComplete="off"
              />
              <a
                className="hu1-boton hu1-ancho"
                style={{ marginTop: 24 }}
                href="/recuperar-contrasena"
              >
                Ir a recuperar contraseña
              </a>
            </div>
          </section>
          <section>
            <h2 className="hu1-sobretitulo">Notificaciones de resultado</h2>
            <AvisoCuenta tipo="exito">
              <strong>Listo.</strong> Ya puedes iniciar sesión con tu nueva contraseña.
            </AvisoCuenta>
            <AvisoCuenta>
              <strong>Enlace vencido.</strong> Solicita uno nuevo para continuar.
            </AvisoCuenta>
            <AvisoCuenta tipo="info">
              <strong>Verificación por correo.</strong> Disponible próximamente al
              conectar el servicio de correo.
            </AvisoCuenta>
          </section>
        </div>
      </main>
      {abierto && (
        <Modal
          titulo="Confirmación de ejemplo"
          className="hu1-modal"
          cerrar={() => setAbierto(false)}
        >
          <CuentaCreada ejemplo />
          <button
            className="hu1-enlace hu1-ancho"
            style={{ marginTop: 20 }}
            onClick={() => setAbierto(false)}
          >
            Entendido
          </button>
        </Modal>
      )}
    </div>
  );
}
