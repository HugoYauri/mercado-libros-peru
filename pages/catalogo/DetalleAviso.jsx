import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Marco, { dinero } from '../compartido/Marco.jsx';
import Enlace from '../compartido/Enlace.jsx';
import BotonReporte from '../compartido/BotonReporte.jsx';
import OfertaEjemplo from './OfertaEjemplo.jsx';
import '../../assets/css/catalogo.css';

export default function DetalleAviso() {
  const ejemplos = [
    {
      title: 'Cálculo de una variable — Stewart, 8.ª ed.',
      price: 95,
      course: 'Cálculo I',
      condition: 'Muy buen estado',
      descripcion:
        'Libro completo, con pocas anotaciones a lápiz. Ideal para Cálculo I y II. Entrega dentro del campus.',
    },
  ];
  const fotos = ['Portada', 'Interior', 'Contraportada'];
  const [parametros] = useSearchParams();
  const [foto, setFoto] = useState(0);
  const [guardado, setGuardado] = useState(false);
  const [oferta, setOferta] = useState(null);
  const [modal, setModal] = useState(false);
  const aviso = ejemplos[0];
  const vendido = parametros.get('ejemplo') === 'vendido';
  return (
    <Marco
      historia="hu3"
      migas={
        <>
          <Enlace href="/catalogo">Catálogo</Enlace>
          <span> / Libros de texto / {aviso.course}</span>
        </>
      }
    >
      <div className="hu3-detalle">
        <div className="hu3-columna">
          <section className="hu3-panel hu3-galeria-panel">
            <div className="hu3-galeria-principal">
              <span>{fotos[foto]}</span>
            </div>
            <div className="hu3-miniaturas">
              {fotos.map((nombre, indice) => (
                <button
                  key={nombre}
                  aria-label={'Ver ' + nombre}
                  aria-pressed={foto === indice}
                  onClick={() => setFoto(indice)}
                >
                  <span>{nombre}</span>
                </button>
              ))}
            </div>
          </section>
          <section className="hu3-panel hu3-descripcion">
            <h2>Descripción</h2>
            <p>{aviso.descripcion}</p>
            <dl className="hu3-metadatos">
              <div>
                <dt>Categoría</dt>
                <dd>Libros de texto</dd>
              </div>
              <div>
                <dt>Curso asociado</dt>
                <dd>{aviso.course}</dd>
              </div>
              <div>
                <dt>Estado del producto</dt>
                <dd>{aviso.condition}</dd>
              </div>
              <div>
                <dt>Publicado</dt>
                <dd>18 de agosto de 2026</dd>
              </div>
            </dl>
          </section>
        </div>
        <aside className="hu3-columna hu3-columna-derecha">
          <section className="hu3-panel hu3-resumen-aviso">
            <span className={'hu3-etiqueta-estado' + (vendido ? ' vendido' : '')}>
              {vendido ? 'Vendido' : 'Publicado'}
            </span>
            <h1>{aviso.title}</h1>
            <p className="hu3-precio-grande">{dinero(aviso.price)}</p>
            <p className="hu3-resumen-secundario">Acepta ofertas desde S/ 50.00</p>
            {vendido ? (
              <div className="hu3-acciones-detalle">
                <p className="hu3-aviso-informativo">Este aviso ya se cerró.</p>
                <Enlace className="hu3-boton" href="/catalogo">
                  Ver avisos similares
                </Enlace>
              </div>
            ) : (
              <div className="hu3-acciones-detalle">
                {oferta !== null ? (
                  <div className="hu3-oferta-activa">
                    <div className="hu3-oferta-activa-cabecera">
                      <span>Oferta enviada</span>
                    </div>
                    <strong>{dinero(oferta)}</strong>
                    <p>Ejemplo independiente de oferta pendiente.</p>
                    <button className="hu3-boton hu3-boton-borde" onClick={() => setOferta(null)}>
                      Retirar oferta
                    </button>
                  </div>
                ) : (
                  <button className="hu3-boton" onClick={() => setModal(true)}>
                    Hacer oferta
                  </button>
                )}
                <button
                  className="hu3-boton hu3-boton-borde"
                  aria-pressed={guardado}
                  onClick={() => setGuardado(!guardado)}
                >
                  {guardado ? '♥ Guardado en favoritos' : '♥ Guardar en favoritos'}
                </button>
              </div>
            )}
          </section>
          <section className="hu3-panel hu3-tarjeta-vendedor">
            <p className="hu3-etiqueta-seccion">Vendedor</p>
            <div className="hu3-persona">
              <span className="hu3-persona-avatar">MG</span>
              <div className="hu3-persona-datos">
                <strong>María García</strong>
                <p>Ingeniería Industrial · 12 acuerdos cerrados</p>
              </div>
            </div>
            <div className="hu3-vendedor-resumen">
              <strong>4.8 ★</strong>
              <span>12 calificaciones recibidas</span>
              <span className="hu3-insignia-confiable">Vendedor confiable</span>
            </div>
            <Enlace className="hu3-enlace" href="/vendedor">
              Ver perfil y sus avisos →
            </Enlace>
          </section>
          <section className="hu3-panel hu3-reporte">
            <span>¿Este aviso incumple las normas del tablón?</span>
            <BotonReporte tipo="Aviso" />
          </section>
        </aside>
      </div>
      {modal && (
        <OfertaEjemplo
          aviso={aviso}
          cerrar={() => setModal(false)}
          confirmar={(monto) => {
            setOferta(monto);
            setModal(false);
          }}
        />
      )}
    </Marco>
  );
}
