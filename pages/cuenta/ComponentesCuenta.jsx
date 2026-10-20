import { useId, useState } from 'react';

export const carreras = [
  'Administración',
  'Ingeniería de Sistemas',
  'Ingeniería Industrial',
  'Contabilidad',
  'Economía',
  'Arquitectura',
  'Comunicación',
  'Derecho',
  'Psicología',
];

export function CampoClave({
  etiqueta = 'Contraseña',
  name = 'clave',
  ayuda,
  error,
  correcta = false,
  ...opciones
}) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  return (
    <div className="hu1-campo">
      <label htmlFor={id}>{etiqueta}</label>
      <div className="hu1-clave">
        <input
          {...opciones}
          id={id}
          name={name}
          type={visible ? 'text' : 'password'}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || ayuda ? id + '-ayuda' : undefined}
          className={correcta && !error ? 'hu1-correcto' : undefined}
        />
        <button
          type="button"
          disabled={opciones.disabled}
          onClick={() => setVisible(!visible)}
          aria-label={(visible ? 'Ocultar ' : 'Mostrar ') + etiqueta.toLowerCase()}
          aria-pressed={visible}
        >
          {visible ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>
      {(error || ayuda) && (
        <p
          id={id + '-ayuda'}
          className={error ? 'hu1-error-campo' : correcta ? 'hu1-valido' : 'hu1-ayuda'}
        >
          {error || ayuda}
        </p>
      )}
    </div>
  );
}

export function AvisoCuenta({ children, tipo = 'error' }) {
  return (
    <div
      className={'hu1-aviso hu1-aviso-' + tipo}
      role={tipo === 'error' ? 'alert' : 'status'}
    >
      {children}
    </div>
  );
}

export function CuentaCreada({ ejemplo = false }) {
  return (
    <div className="hu1-cuenta-creada">
      <span
        className="hu1-icono-exito"
        aria-hidden="true"
      >
        ✓
      </span>
      <h2>Cuenta creada</h2>
      <p>
        {ejemplo
          ? 'Ejemplo visual de la confirmación de registro.'
          : 'Tu cuenta quedó registrada. Ya puedes iniciar sesión con tu correo institucional.'}
      </p>
      <a
        className="hu1-boton hu1-ancho"
        href="/ingresar"
      >
        Ir a iniciar sesión
      </a>
      <p className="hu1-ayuda">
        La confirmación por correo estará disponible cuando se conecte el servicio de
        correo.
      </p>
    </div>
  );
}
