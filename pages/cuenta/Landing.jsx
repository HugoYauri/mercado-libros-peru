import { avisos } from '../../assets/js/compartido/storage.js';
import { categorias } from '../../assets/js/hu2/publicaciones.js';
import Marco from '../compartido/Marco.jsx';
import TarjetaAviso from '../compartido/TarjetaAviso.jsx';

export default function Landing() {
  const publicados = avisos().filter((aviso) => aviso.status === 'Publicado');
  return (
    <Marco
      titulo="Lo que a un compañero le sobra, a ti te sirve este ciclo"
      descripcion="Libros, calculadoras e instrumentos de segunda mano entre estudiantes de la Universidad de Lima."
    >
      <section className="neg-tarjeta">
        <form action="/catalogo">
          <label>
            ¿Qué estás buscando?
            <input
              name="q"
              placeholder="Cálculo, programación, calculadora…"
            />
          </label>
          <button className="neg-boton">Buscar en el catálogo</button>
        </form>
        <p className="neg-ayuda mt-5">
          {publicados.length} avisos publicados · Entregas dentro del campus
        </p>
        <div className="neg-acciones">
          <a
            href="/registro"
            className="neg-secundario"
          >
            Crear cuenta
          </a>
          <a
            href="/ingresar"
            className="neg-secundario"
          >
            Ingresar
          </a>
          <a href="#como-funciona">Cómo funciona</a>
        </div>
      </section>
      <h2>Categorías destacadas</h2>
      <div className="neg-acciones">
        {categorias.map((categoria) => (
          <a
            key={categoria}
            className="neg-secundario"
            href={'/catalogo?categoria=' + encodeURIComponent(categoria)}
          >
            {categoria}
          </a>
        ))}
      </div>
      <div className="neg-fila mt-8">
        <h2>Publicaciones disponibles</h2>
        <a href="/catalogo">Ver todo el catálogo →</a>
      </div>
      <div className="rejilla-productos mt-5">
        {publicados.slice(0, 3).map((aviso) => (
          <TarjetaAviso
            key={aviso.id}
            aviso={aviso}
          />
        ))}
      </div>
      <section
        id="como-funciona"
        className="rejilla-tres mt-8"
      >
        <article className="neg-tarjeta">
          <h2>1. Publica</h2>
          <p className="neg-ayuda">
            Agrega fotografías, describe el estado del material e indica el precio.
          </p>
        </article>
        <article className="neg-tarjeta">
          <h2>2. Negocia</h2>
          <p className="neg-ayuda">
            Envía ofertas y responde desde el hilo de negociación.
          </p>
        </article>
        <article className="neg-tarjeta">
          <h2>3. Acuerda y califica</h2>
          <p className="neg-ayuda">
            Coordina la entrega en el campus. Ambos confirman y pueden calificarse.
          </p>
        </article>
      </section>
      <section
        id="normas"
        className="neg-tarjeta"
      >
        <h2>Normas del tablón</h2>
        <p className="my-3">
          Publica información veraz y fotografías del material. Mantén un trato
          respetuoso, acuerda la entrega en un lugar público del campus y confirma solo
          cuando el intercambio haya terminado.
        </p>
        <p>
          Reporta avisos engañosos o conductas inapropiadas desde el aviso o perfil del
          usuario.
        </p>
        <p className="mt-4">
          Ayuda: <a href="mailto:tablon@ulima.edu.pe">tablon@ulima.edu.pe</a>
        </p>
      </section>
    </Marco>
  );
}
