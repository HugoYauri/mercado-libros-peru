import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Marco, { dinero } from '../compartido/Marco.jsx';
import Enlace from '../compartido/Enlace.jsx';
import { EstadoAcuerdo, FotoAcuerdo } from './ComponentesAcuerdo.jsx';
import '../../assets/css/acuerdos.css';

export default function MisAcuerdos() {
  const ejemplos = [
    {
      id: 1,
      titulo: 'Cálculo de una variable — Stewart, 8.ª ed.',
      persona: 'María García',
      precio: 88,
      estado: 'Por coordinar',
      detalle: 'Aceptado hoy · Falta definir punto y horario',
    },
    {
      id: 2,
      titulo: 'Calculadora científica ClassWiz fx-991',
      persona: 'Carlos Mendoza',
      precio: 110,
      estado: 'Propuesta recibida',
      detalle: 'Biblioteca central · 30 ago, 14:00',
    },
    {
      id: 3,
      titulo: 'Juego de escuadras y escalímetro Faber',
      persona: 'Andrea López',
      precio: 35,
      estado: 'Acordado',
      detalle: 'Pabellón A · 30 ago, 10:00',
    },
    {
      id: 4,
      titulo: 'Física para ciencias e ingeniería — Serway',
      persona: 'Diego Ruiz',
      precio: 100,
      estado: 'Entregado',
      detalle: 'Entregado el 25 de agosto',
    },
    {
      id: 5,
      titulo: 'Mandil de laboratorio talla M',
      persona: 'Lucía Torres',
      precio: 40,
      estado: 'Cancelado',
      detalle: 'Cancelado el 24 de agosto',
    },
  ];
  const filtros = ['Todos', 'En curso', 'Cerrados'];
  const acciones = {
    'Por coordinar': ['Coordinar', ''],
    'Propuesta recibida': ['Responder', ''],
    Acordado: ['Confirmar entrega', 'hu5-boton-verde'],
    Entregado: ['Calificar', 'hu5-boton-borde'],
    Cancelado: ['Ver detalle', 'hu5-boton-detalle'],
  };
  const [parametros] = useSearchParams();
  const [filtro, setFiltro] = useState('Todos');
  const [texto, setTexto] = useState('');
  const visibles = (parametros.get('ejemplo') === 'vacio' ? [] : ejemplos).filter(
    (acuerdo) =>
      acuerdo.titulo.toLowerCase().includes(texto.toLowerCase()) &&
      (filtro === 'Todos' ||
        (filtro === 'Cerrados'
          ? ['Entregado', 'Cancelado'].includes(acuerdo.estado)
          : !['Entregado', 'Cancelado'].includes(acuerdo.estado))),
  );
  const grupos = ['En curso', 'Cerrados'].map((titulo) => ({
    titulo,
    acuerdos: visibles.filter((acuerdo) =>
      titulo === 'Cerrados'
        ? ['Entregado', 'Cancelado'].includes(acuerdo.estado)
        : !['Entregado', 'Cancelado'].includes(acuerdo.estado),
    ),
  }));
  return (
    <Marco
      historia="hu5"
      titulo="Mis acuerdos"
      descripcion="5 acuerdos · 3 en curso · 1 pendiente de calificar"
      busqueda={{ valor: texto, cambiar: setTexto }}
      acciones={
        <div className="hu5-filtros">
          {filtros.map((valor) => (
            <button
              key={valor}
              className={'hu5-chip' + (filtro === valor ? ' hu5-chip-activo' : '')}
              aria-pressed={filtro === valor}
              onClick={() => setFiltro(valor)}
            >
              {valor} · {valor === 'Todos' ? 5 : valor === 'En curso' ? 3 : 2}
            </button>
          ))}
        </div>
      }
    >
      {visibles.length ? (
        grupos
          .filter((grupo) => grupo.acuerdos.length)
          .map((grupo) => (
            <section className="hu5-grupo-acuerdos" key={grupo.titulo}>
              <h2 className="hu5-etiqueta">{grupo.titulo}</h2>
              <div className="hu5-lista-acuerdos">
                {grupo.acuerdos.map((acuerdo) => (
                  <article className="hu5-fila-acuerdo" key={acuerdo.id}>
                    <FotoAcuerdo titulo={acuerdo.titulo} />
                    <div className="hu5-fila-descripcion">
                      <h3>{acuerdo.titulo}</h3>
                      <p className="hu5-texto-secundario">
                        AC-00{acuerdo.id} · Con {acuerdo.persona} · 4.8 ★
                      </p>
                      <p>{acuerdo.detalle}</p>
                    </div>
                    <div className="hu5-fila-acciones">
                      <strong className="hu5-precio">{dinero(acuerdo.precio)}</strong>
                      <EstadoAcuerdo estado={acuerdo.estado} />
                      <Enlace
                        className={'hu5-boton ' + acciones[acuerdo.estado][1]}
                        href={
                          '/acuerdos/' +
                          acuerdo.id +
                          (acuerdo.estado === 'Por coordinar'
                            ? '?vista=coordinar'
                            : acuerdo.estado === 'Entregado'
                              ? '?vista=calificar'
                              : '')
                        }
                      >
                        {acciones[acuerdo.estado][0]}
                      </Enlace>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))
      ) : (
        <section className="hu5-panel hu5-vacio">
          <h2>Aún no tienes acuerdos</h2>
          <p>Los acuerdos de ejemplo se muestran al abrir la vista principal.</p>
          <Enlace className="hu5-boton" href="/acuerdos">
            Ver ejemplos
          </Enlace>
        </section>
      )}
    </Marco>
  );
}
