import { useState } from 'react';
import Enlace from '../compartido/Enlace.jsx';

export default function Reportes() {
  const ejemplos = [
    {
      id: 1,
      motivo: 'Información incorrecta',
      tipo: 'Aviso',
      estado: 'Pendiente',
      detalle: 'La descripción no corresponde al producto.',
    },
    {
      id: 2,
      motivo: 'Contenido inapropiado',
      tipo: 'Usuario',
      estado: 'Pendiente',
      detalle: 'El perfil contiene información inapropiada.',
    },
    {
      id: 3,
      motivo: 'Aviso duplicado',
      tipo: 'Aviso',
      estado: 'Descartado',
      detalle: 'Reporte ya revisado.',
    },
  ];
  const estados = ['Todos', 'Pendiente', 'Atendido', 'Descartado'];
  const tipos = ['Todos', 'Aviso', 'Usuario'];
  const [filtro, setFiltro] = useState({ texto: '', estado: 'Todos', tipo: 'Todos' });
  const visibles = ejemplos.filter(
    (item) =>
      (item.motivo + item.detalle).toLowerCase().includes(filtro.texto.toLowerCase()) &&
      (filtro.estado === 'Todos' || item.estado === filtro.estado) &&
      (filtro.tipo === 'Todos' || item.tipo === filtro.tipo),
  );
  return (
    <>
      <div className="rejilla-tres">
        <label>
          Buscar reportes
          <input
            placeholder="Motivo, usuario o detalle"
            value={filtro.texto}
            onChange={(event) => setFiltro({ ...filtro, texto: event.target.value })}
          />
        </label>
        <label>
          Estado
          <select
            value={filtro.estado}
            onChange={(event) => setFiltro({ ...filtro, estado: event.target.value })}
          >
            {estados.map((estado) => (
              <option key={estado}>{estado}</option>
            ))}
          </select>
        </label>
        <label>
          Tipo
          <select
            value={filtro.tipo}
            onChange={(event) => setFiltro({ ...filtro, tipo: event.target.value })}
          >
            {tipos.map((tipo) => (
              <option key={tipo}>{tipo}</option>
            ))}
          </select>
        </label>
      </div>
      {visibles.map((item) => (
        <article className="neg-tarjeta" key={item.id}>
          <div className="neg-fila">
            <h2>{item.motivo}</h2>
            <span className="neg-estado">{item.estado}</span>
          </div>
          <p className="neg-ayuda">{item.tipo} · Agosto de 2026</p>
          <p>{item.detalle}</p>
          <Enlace className="neg-secundario mt-4" href={'/administracion/reportes/' + item.id}>
            Ver detalle
          </Enlace>
        </article>
      ))}
      {!visibles.length && (
        <p className="neg-tarjeta">No hay reportes que coincidan con los filtros.</p>
      )}
    </>
  );
}
