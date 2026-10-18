import Marco from '../compartido/Marco.jsx';

export default function PaginaNoEncontrada() {
  return (
    <Marco
      titulo="Página no encontrada (404)"
      descripcion="La dirección no existe o el enlace dejó de estar disponible. Puedes volver al catálogo y buscar el material que necesitas."
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
