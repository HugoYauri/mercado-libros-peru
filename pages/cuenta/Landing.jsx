import { useState } from 'react';
import MarcoCuenta from './MarcoCuenta.jsx';
import Enlace from '../compartido/Enlace.jsx';
import TarjetaAviso from '../compartido/TarjetaAviso.jsx';

export default function Landing() {
  const ejemplos = [
    {
      id: 1,
      title: 'Cálculo de una variable — Stewart',
      price: 95,
      category: 'Libros de texto',
      course: 'Cálculo I',
      condition: 'Muy buen estado',
      status: 'Publicado',
    },
    {
      id: 2,
      title: 'Calculadora científica ClassWiz',
      price: 120,
      category: 'Calculadoras',
      course: 'Física II',
      condition: 'Como nuevo',
      status: 'Publicado',
    },
    {
      id: 3,
      title: 'Juego de escuadras y escalímetro',
      price: 38,
      category: 'Instrumentos de dibujo',
      course: 'Dibujo técnico',
      condition: 'Buen estado',
      status: 'Publicado',
    },
  ];
  const categorias = [
    'Libros de texto',
    'Calculadoras',
    'Instrumentos de dibujo',
    'Apuntes y guías',
  ];
  const pasos = [
    ['Publica tu aviso', 'Sube fotografías e indica el estado del producto y tu precio.'],
    ['Recibe y negocia ofertas', 'Revisa las propuestas de las personas interesadas.'],
    ['Coordinen la entrega', 'Elijan un punto y horario de encuentro dentro del campus.'],
  ];
  const [busqueda, setBusqueda] = useState('');
  const visibles = ejemplos.filter((aviso) =>
    aviso.title.toLowerCase().includes(busqueda.toLowerCase()),
  );
  return (
    <MarcoCuenta>
      <section className="hu1-hero">
        <div className="hu1-hero-interior">
          <div>
            <h1>Lo que a un compañero le sobra, a ti te sirve este ciclo</h1>
            <p className="hu1-intro">
              Libros, calculadoras e instrumentos de segunda mano publicados por estudiantes de la
              Universidad de Lima. Oferta, acuerda y recoge dentro del campus.
            </p>
            <form
              className="hu1-busqueda"
              onSubmit={(event) => {
                event.preventDefault();
                setBusqueda(new FormData(event.currentTarget).get('q'));
              }}
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
                <strong>3</strong>
                <span>avisos activos</span>
              </div>
              <div>
                <strong>S/ 95.00</strong>
                <span>precio mediano</span>
              </div>
              <div>
                <strong>4.8</strong>
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
        <section>
          <h2 className="hu1-sobretitulo">Categorías destacadas</h2>
          <div className="hu1-categorias">
            {categorias.map((categoria) => (
              <Enlace href="#avisos" key={categoria}>
                <span aria-hidden="true" />
                {categoria}
              </Enlace>
            ))}
          </div>
        </section>
        <section id="avisos" className="hu1-recientes">
          <div className="hu1-fila-titulo">
            <h2>Avisos recientes</h2>
            <Enlace className="hu1-enlace" href="#avisos">
              Ver todo el catálogo →
            </Enlace>
          </div>
          <div className="hu1-avisos">
            {visibles.map((aviso) => (
              <TarjetaAviso key={aviso.id} aviso={aviso} destino="#avisos" />
            ))}
          </div>
          {!visibles.length && <p className="hu1-panel">No encontramos avisos con ese título.</p>}
        </section>
        <section id="como-funciona" className="hu1-como">
          {pasos.map(([titulo, texto], i) => (
            <article key={titulo}>
              <span>{i + 1}</span>
              <div>
                <h2>{titulo}</h2>
                <p>{texto}</p>
              </div>
            </article>
          ))}
        </section>
        <details id="normas" className="hu1-normas">
          <summary>Normas del tablón</summary>
          <p>
            Publica información veraz y fotografías del material. Mantén un trato respetuoso y
            acuerda la entrega en un lugar público del campus.
          </p>
        </details>
      </div>
    </MarcoCuenta>
  );
}
