import Marco from '../compartido/Marco.jsx';

export default function AccesoDenegado() {
  return (
    <Marco
      titulo="Acceso denegado"
      descripcion="Tu cuenta no tiene permisos para esta sección. La administración está reservada para el rol administrador."
    >
      <section className="neg-tarjeta">
        <div className="neg-acciones">
          <a
            className="neg-boton"
            href="/catalogo"
          >
            Volver al catálogo
          </a>
          <a href="/">Ir al inicio</a>
          <a href="/ingresar">Ingresar con otra cuenta</a>
        </div>
      </section>
    </Marco>
  );
}
