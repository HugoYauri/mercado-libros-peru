import MarcoCuenta from './MarcoCuenta.jsx';

export default function AccesoDenegado() {
  return (
    <MarcoCuenta
      privado
      clase="hu1-estado-pagina"
    >
      <section>
        <span
          className="hu1-icono-permiso"
          aria-hidden="true"
        >
          ▢
        </span>
        <h1>Acceso denegado</h1>
        <p className="hu1-intro">
          Tu cuenta no tiene permisos para esta sección. La bandeja de reportes está
          reservada para el administrador del tablón. Si crees que se trata de un error,
          escribe a tablon@ulima.edu.pe.
        </p>
        <div className="hu1-acciones">
          <a
            className="hu1-boton"
            href="/catalogo"
          >
            Volver al catálogo
          </a>
          <a
            className="hu1-secundario"
            href="mailto:tablon@ulima.edu.pe"
          >
            Escribir a la mesa de ayuda
          </a>
        </div>
        <div className="hu1-acciones">
          <a
            className="hu1-enlace"
            href="/"
          >
            Ir al inicio
          </a>
          <a
            className="hu1-enlace"
            href="/ingresar"
          >
            Ingresar con otra cuenta
          </a>
        </div>
      </section>
    </MarcoCuenta>
  );
}
