import { Link } from "react-router-dom";
import { SearchBox } from "../components/shared/Layout.jsx";
import { AvisoCard } from "../components/shared/AvisoCard.jsx";
import { LoadState } from "../components/shared/Ui.jsx";
import { useService } from "../hooks/useService.js";
export function HomePage() {
  const { result, loading, error } = useService("getCatalogo", [{ limit: 4 }]);
  const metadata = useService("getMetadata");
  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <div>
            <p className="eyebrow">LIBROS Y MATERIALES DE SEGUNDA MANO</p>
            <h1>
              Lo que a un compañero le sobra,
              <br />a ti te sirve este ciclo
            </h1>
            <p>
              Encuentra libros, calculadoras y materiales de estudio. Negocia
              con tus compañeros y coordinen la entrega dentro del campus.
            </p>
            <SearchBox hero />
            <p className="hero-note">Compra y vende con la misma cuenta.</p>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="book book-one">
              CÁLCULO
              <br />
              <small>UN NUEVO CICLO</small>
            </div>
            <div className="book book-two">
              FÍSICA
              <br />
              <small>SEGUNDA VIDA</small>
            </div>
            <span className="hero-tag">Que siga aprendiendo alguien más.</span>
          </div>
        </div>
      </section>
      <div className="page-container">
        <section>
          <p className="eyebrow">CATEGORÍAS DESTACADAS</p>
          <div className="category-grid">
            {metadata.result?.categorias.map((c) => (
              <Link
                key={c.id}
                to={`/catalogo?categoriaId=${c.id}`}
                className="category-tile"
              >
                <span aria-hidden="true">▤</span>
                {c.nombre}
              </Link>
            ))}
          </div>
        </section>
        <section>
          <div className="section-heading">
            <h2>Avisos recientes</h2>
            <Link to="/catalogo">Ver todo el catálogo →</Link>
          </div>
          <LoadState loading={loading} error={error} />
          <div className="cards-grid home-cards">
            {result?.items.map((a) => (
              <AvisoCard key={a.id} aviso={a} />
            ))}
          </div>
        </section>
        <section id="como-funciona" className="steps">
          <div>
            <span>1</span>
            <h3>Publica tu aviso</h3>
            <p>Describe el producto, su estado y el precio pedido.</p>
          </div>
          <div>
            <span>2</span>
            <h3>Recibe y negocia ofertas</h3>
            <p>Acuerden un monto desde el historial de negociación.</p>
          </div>
          <div>
            <span>3</span>
            <h3>Coordinen la entrega</h3>
            <p>Elijan un punto del campus y confirmen ambos.</p>
          </div>
        </section>
      </div>
    </>
  );
}
