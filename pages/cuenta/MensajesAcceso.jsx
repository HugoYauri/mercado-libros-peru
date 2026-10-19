import { useState } from 'react';
import Marco, { Modal } from '../compartido/Marco.jsx';

export default function MensajesAcceso() {
  const [abierto, setAbierto] = useState(false);

  return (
    <Marco
      titulo="Mensajes y modales de acceso"
      descripcion="Ejemplos de los estados que acompañan los formularios de cuenta."
    >
      <section className="neg-tarjeta">
        <h2>Validación de datos</h2>
        <p className="neg-error">Correo o contraseña incorrectos.</p>
        <p className="neg-aviso">
          Después de cuatro intentos incorrectos, espera un minuto.
        </p>
        <p className="neg-ayuda">
          La contraseña necesita al menos ocho caracteres, una mayúscula y un número.
        </p>
        <button
          className="neg-boton"
          onClick={() => setAbierto(true)}
        >
          Ver ejemplo de confirmación
        </button>
      </section>
      <section className="neg-tarjeta">
        <h2>Accesos y recuperación</h2>
        <p>
          Las secciones privadas requieren iniciar sesión. La administración requiere una
          cuenta con ese rol.
        </p>
        <p>
          La recuperación es una demostración local: muestra un enlace temporal en
          pantalla y no envía correos reales.
        </p>
        <div className="neg-acciones">
          <a href="/ingresar">Ingresar</a>
          <a href="/registro">Crear cuenta</a>
          <a href="/recuperar-contrasena">Recuperar contraseña</a>
          <a href="/acceso-denegado">Ver acceso denegado</a>
          <a href="/no-encontrado">Ver página 404</a>
        </div>
      </section>
      {abierto && (
        <Modal
          titulo="Confirmación de ejemplo"
          cerrar={() => setAbierto(false)}
        >
          <p>Así se presentan las confirmaciones. Este ejemplo no modifica tu cuenta.</p>
          <button
            className="neg-boton"
            onClick={() => setAbierto(false)}
          >
            Entendido
          </button>
        </Modal>
      )}
    </Marco>
  );
}
