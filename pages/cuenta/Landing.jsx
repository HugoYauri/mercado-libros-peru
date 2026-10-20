import { avisos } from '../../assets/js/compartido/storage.js';
import { categorias } from '../../assets/js/hu2/publicaciones.js';
import { reputacion } from '../../assets/js/hu6/reputacion.js';
import MarcoCuenta from './MarcoCuenta.jsx';
import TarjetaAviso from '../compartido/TarjetaAviso.jsx';
import { dinero } from '../compartido/Marco.jsx';

export default function Landing() {
  const publicados = avisos().filter((aviso) => aviso.status === 'Publicado');
  const precios = publicados.map((aviso) => Number(aviso.price)).sort((a, b) => a - b);
  const mitad = Math.floor(precios.length / 2);
  let mediana = 0;
  if (precios.length > 0) {
    mediana = precios[mitad];
    if (precios.length % 2 === 0) {
      mediana = (precios[mitad - 1] + precios[mitad]) / 2;
    }
  }
  const vendedores = [...new Set(publicados.map((aviso) => aviso.owner))];
  const calificaciones = vendedores.flatMap((correo) => reputacion(correo).recibidas);
  const media = calificaciones.length
    ? calificaciones.reduce((total, item) => total + item.puntaje, 0) /
      calificaciones.length
    : 0;

  return (
    <MarcoCuenta>
      <section className="hu1-hero">
        <div className="hu1-hero-interior">
          <div>
            <h1>Lo que a un compañero le sobra, a ti te sirve este ciclo</h1>
            <p className="hu1-intro">
              Libros, calculadoras e instrumentos de segunda mano publicados por
              estudiantes de la Universidad de Lima. Oferta, acuerda y recoge dentro del
              campus.
            </p>
            <form
              className="hu1-busqueda"
              action="/catalogo"
            >
              <input
                name="q"
                aria-label="¿Qué estás buscando?"
                placeholder="¿Qué estás buscando? Ej. Stewart Cálculo"
              />
              <button className="hu1-boton">Buscar</button>
            </form>
            <div className="hu1-metricas">
              <div>
                <strong>{publicados.length}</strong>
                <span>avisos activos</span>
              </div>
              <div>
                <strong>{precios.length ? dinero(mediana) : '—'}</strong>
                <span>precio mediano</span>
              </div>
              <div>
                <strong>{media ? media.toFixed(1) : '—'}</strong>
                <span>reputación de vendedores</span>
              </div>
            </div>
          </div>
          <div className="hu1-foto-ejemplo hu1-hero-foto">
            fotografía · estudiantes intercambiando libros
          </div>
        </div>
      </section>
      <div className="hu1-inicio-interior">
        <section aria-labelledby="categorias-inicio">
          <h2
            id="categorias-inicio"
            className="hu1-sobretitulo"
          >
            Categorías destacadas
          </h2>
          <div className="hu1-categorias">
            {categorias.map((categoria) => (
              <a
                key={categoria}
                href={'/catalogo?categoria=' + encodeURIComponent(categoria)}
              >
                <span aria-hidden="true" />
                {categoria}
              </a>
            ))}
          </div>
        </section>
        <section
          id="avisos"
          className="hu1-recientes"
          aria-labelledby="avisos-inicio"
        >
          <div className="hu1-fila-titulo">
            <h2 id="avisos-inicio">Avisos recientes</h2>
            <a
              className="hu1-enlace"
              href="/catalogo"
            >
              Ver todo el catálogo →
            </a>
          </div>
          <div className="hu1-avisos">
            {publicados.slice(0, 4).map((aviso) => (
              <TarjetaAviso
                key={aviso.id}
                aviso={aviso}
              />
            ))}
          </div>
          {!publicados.length && (
            <p className="hu1-panel hu1-ayuda">Todavía no hay avisos publicados.</p>
          )}
        </section>
        <section
          id="como-funciona"
          className="hu1-como"
          aria-label="Cómo funciona"
        >
          <article>
            <span>1</span>
            <div>
              <h2>Publica tu aviso</h2>
              <p>Sube fotografías, indica el estado del producto y tu precio pedido.</p>
            </div>
          </article>
          <article>
            <span>2</span>
            <div>
              <h2>Recibe y negocia ofertas</h2>
              <p>Acepta, rechaza o contraoferta desde el hilo de negociación.</p>
            </div>
          </article>
          <article>
            <span>3</span>
            <div>
              <h2>Coordinen la entrega</h2>
              <p>Elijan punto y horario en el campus y confirmen la entrega.</p>
            </div>
          </article>
        </section>
        <details
          id="normas"
          className="hu1-normas"
        >
          <summary>Normas del tablón</summary>
          <p>
            Publica información veraz y fotografías del material. Mantén un trato
            respetuoso, acuerda la entrega en un lugar público del campus y confirma solo
            cuando el intercambio haya terminado.
          </p>
          <p>
            Reporta avisos engañosos o conductas inapropiadas desde el aviso o perfil del
            usuario.
          </p>
          <p>
            Ayuda:{' '}
            <a
              className="hu1-enlace"
              href="mailto:tablon@ulima.edu.pe"
            >
              tablon@ulima.edu.pe
            </a>
          </p>
        </details>
      </div>
    </MarcoCuenta>
  );
}
