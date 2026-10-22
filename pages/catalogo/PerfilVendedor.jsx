import { useState } from 'react';
import Marco from '../compartido/Marco.jsx';
import BotonReporte from '../compartido/BotonReporte.jsx';
import TarjetaAviso from '../compartido/TarjetaAviso.jsx';
import '../../assets/css/catalogo.css';

export default function PerfilVendedor() {
  const ejemplos = [
    {
      id: 1,
      title: 'Cálculo de una variable — Stewart, 8.ª ed.',
      price: 95,
      course: 'Cálculo I',
      condition: 'Muy buen estado',
      status: 'Publicado',
    },
    {
      id: 2,
      title: 'Calculadora científica ClassWiz fx-991',
      price: 120,
      course: 'Física II',
      condition: 'Como nuevo',
      status: 'Publicado',
    },
    {
      id: 3,
      title: 'Física para ciencias e ingeniería — Serway',
      price: 110,
      course: 'Física II',
      condition: 'Buen estado',
      status: 'Vendido',
    },
  ];
  const resenas = [
    {
      nombre: 'Andrea',
      texto: 'Muy amable y puntual. El libro estaba en perfecto estado.',
      estrellas: 5,
    },
    { nombre: 'Carlos', texto: 'Todo conforme con lo acordado.', estrellas: 5 },
  ];
  const filtros = ['Todos', 'Activos', 'Vendidos'];
  const [filtro, setFiltro] = useState('Todos');
  const visibles = ejemplos.filter(
    (aviso) =>
      filtro === 'Todos' ||
      (filtro === 'Activos' ? aviso.status === 'Publicado' : aviso.status === 'Vendido'),
  );
  return (
    <Marco historia="hu3">
      <section className="hu3-perfil-cabecera">
        <div className="hu3-perfil-identidad">
          <span className="hu3-perfil-avatar">MG</span>
          <div>
            <h1>
              María García <span className="hu3-insignia-confiable">Vendedor confiable</span>
            </h1>
            <p>Ingeniería Industrial · 6.º ciclo</p>
            <p>Estudiante de la comunidad ULima</p>
            <div className="hu3-reputacion">
              4.8 ★★★★★ <small>(12 calificaciones recibidas)</small>
            </div>
          </div>
        </div>
        <div className="hu3-estadisticas-perfil">
          <div>
            <strong>12</strong>
            <span>acuerdos cerrados</span>
          </div>
          <div>
            <strong>2</strong>
            <span>avisos activos</span>
          </div>
          <div className="hu3-perfil-reporte">
            <BotonReporte tipo="Usuario" />
          </div>
        </div>
      </section>
      <section className="hu3-seccion">
        <div className="hu3-seccion-cabecera">
          <h2>Avisos publicados</h2>
          <div className="hu3-pestanas">
            {filtros.map((nombre) => (
              <button
                key={nombre}
                className="hu3-chip-pestana"
                aria-pressed={filtro === nombre}
                onClick={() => setFiltro(nombre)}
              >
                {nombre}
              </button>
            ))}
          </div>
        </div>
        <div className="hu3-rejilla-productos hu3-rejilla-perfil">
          {visibles.map((aviso) => (
            <TarjetaAviso key={aviso.id} aviso={aviso} variant="hu3" />
          ))}
        </div>
      </section>
      <section className="hu3-seccion">
        <div className="hu3-seccion-cabecera">
          <h2>Últimas calificaciones recibidas</h2>
        </div>
        <div className="hu3-resenas-grid">
          {resenas.map((resena) => (
            <article className="hu3-resena" key={resena.nombre}>
              <div>
                <p className="hu3-resena-estrellas">{'★'.repeat(resena.estrellas)}</p>
                <p>{resena.texto}</p>
                <small>{resena.nombre} · ULima</small>
              </div>
              <time>Agosto de 2026</time>
            </article>
          ))}
        </div>
      </section>
    </Marco>
  );
}
