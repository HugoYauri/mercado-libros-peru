import { useState } from 'react';
import { usuarioActivo } from '../../assets/js/compartido/sesion.js';
import { esParticipante } from '../../assets/js/hu4/ofertas.js';
import Marco, { dinero, fechaLegible, useNegociaciones } from '../compartido/Marco.jsx';

export default function MisAcuerdos() {
  const { acuerdos } = useNegociaciones();
  const [filtro, setFiltro] = useState('Todos');
  const correo = usuarioActivo().correo;
  const visibles = acuerdos.filter(
    (item) =>
      esParticipante(item, correo) && (filtro === 'Todos' || item.estado === filtro),
  );
  return (
    <Marco
      titulo="Mis acuerdos"
      descripcion="Coordina la entrega dentro del campus y confirma cuando hayas recibido o entregado el producto."
    >
      <label>
        Estado del acuerdo
        <select
          value={filtro}
          onChange={(event) => setFiltro(event.target.value)}
        >
          {[
            'Todos',
            'Por coordinar',
            'Por confirmar horario',
            'Coordinado',
            'Entrega parcial',
            'Cerrado',
            'Cancelado',
          ].map((valor) => (
            <option key={valor}>{valor}</option>
          ))}
        </select>
      </label>
      {visibles.length === 0 && (
        <section className="neg-tarjeta neg-vacio">
          <h2>No hay acuerdos con este filtro</h2>
          <p className="neg-ayuda">Los acuerdos se generan al aceptar una oferta.</p>
          <a
            href="/ofertas"
            className="neg-boton"
          >
            Ver ofertas
          </a>
        </section>
      )}
      {visibles.map((acuerdo) => (
        <article
          className="neg-tarjeta"
          key={acuerdo.id}
        >
          <div className="neg-fila">
            <h2>{acuerdo.titulo}</h2>
            <span className="neg-estado">{acuerdo.estado}</span>
          </div>
          <p className="neg-precio">{dinero(acuerdo.monto)}</p>
          <p>
            {acuerdo.comprador === correo
              ? `Vendedor: ${acuerdo.vendedor}`
              : `Comprador: ${acuerdo.comprador}`}
          </p>
          <p className="neg-ayuda">
            {acuerdo.fecha
              ? `${acuerdo.punto} · ${fechaLegible(acuerdo.fecha)}`
              : 'Punto y horario pendientes'}
          </p>
          <a
            href={`/acuerdos/${acuerdo.id}`}
            className="neg-secundario"
          >
            Ver y coordinar entrega
          </a>
        </article>
      ))}
    </Marco>
  );
}
