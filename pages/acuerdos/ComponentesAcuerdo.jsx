export function EstadoAcuerdo({ estado }) {
  const colores = {
    'Por coordinar': 'azul',
    'Propuesta recibida': 'ambar',
    Acordado: 'verde',
    Entregado: 'verde',
    Cancelado: 'rojo',
  };
  return <span className={'hu5-estado hu5-estado-' + (colores[estado] || 'azul')}>{estado}</span>;
}

export function FotoAcuerdo({ titulo }) {
  return (
    <div
      className="hu5-foto hu5-foto-ejemplo"
      role="img"
      aria-label={'Sin fotografía de ' + titulo}
    />
  );
}

export function PersonaAcuerdo({ nombre, iniciales, rol, propia = false }) {
  return (
    <div className="hu5-persona-bloque">
      <p className="hu5-etiqueta">{rol}</p>
      <div className="hu5-persona">
        <span className={'hu5-avatar' + (propia ? ' hu5-avatar-propio' : '')}>{iniciales}</span>
        <div>
          <p className="hu5-nombre">
            {nombre}
            {propia && ' (tú)'}
          </p>
          <p className="hu5-texto-secundario">Estudiante ULima · 4.8 ★</p>
        </div>
      </div>
    </div>
  );
}
