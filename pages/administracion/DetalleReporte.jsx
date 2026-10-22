import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Enlace from '../compartido/Enlace.jsx';
import ModalModeracion from './ModalModeracion.jsx';

export default function DetalleReporte() {
  const ejemplos = [
    {
      motivo: 'Información incorrecta',
      tipo: 'Aviso',
      estado: 'Pendiente',
      detalle: 'La descripción no corresponde al producto.',
      elemento: 'Cálculo de una variable',
    },
    {
      motivo: 'Contenido inapropiado',
      tipo: 'Usuario',
      estado: 'Pendiente',
      detalle: 'El perfil contiene información inapropiada.',
      elemento: 'Perfil de ejemplo',
    },
    {
      motivo: 'Aviso duplicado',
      tipo: 'Aviso',
      estado: 'Descartado',
      detalle: 'Reporte ya revisado.',
      elemento: 'Álgebra lineal',
    },
  ];
  const { id } = useParams();
  const [reporte, setReporte] = useState(ejemplos[Number(id) - 1] || ejemplos[0]);
  const [accion, setAccion] = useState('');
  function confirmar(motivo) {
    setReporte({
      ...reporte,
      estado: accion === 'Descartar reporte' ? 'Descartado' : 'Atendido',
      resolucion: accion + ': ' + motivo,
    });
    setAccion('');
  }
  return (
    <section className="neg-tarjeta">
      <Enlace href="/administracion/reportes">← Bandeja de reportes</Enlace>
      <h2 className="mt-5">{reporte.motivo}</h2>
      <p className="neg-ayuda">
        {reporte.tipo} · {reporte.estado}
      </p>
      <p>{reporte.detalle}</p>
      <dl className="neg-datos">
        <div>
          <dt>Reportado por</dt>
          <dd>Estudiante de ejemplo</dd>
        </div>
        <div>
          <dt>Fecha</dt>
          <dd>28 de agosto de 2026</dd>
        </div>
        <div>
          <dt>Elemento reportado</dt>
          <dd>{reporte.elemento}</dd>
        </div>
      </dl>
      {reporte.estado === 'Pendiente' ? (
        <div className="neg-acciones">
          {(reporte.tipo === 'Aviso'
            ? ['Retirar aviso', 'Bloquear cuenta', 'Descartar reporte']
            : ['Bloquear cuenta', 'Descartar reporte']
          ).map((opcion) => (
            <button key={opcion} className="neg-secundario" onClick={() => setAccion(opcion)}>
              {opcion}
            </button>
          ))}
        </div>
      ) : (
        <p className="neg-exito" role="status">
          Resolución: {reporte.resolucion || 'Reporte descartado.'}
        </p>
      )}
      {accion && (
        <ModalModeracion accion={accion} cerrar={() => setAccion('')} confirmar={confirmar} />
      )}
    </section>
  );
}
