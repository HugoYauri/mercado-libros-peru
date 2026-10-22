export default function Metricas() {
  const ejemplos = [
    ['Avisos publicados', 12],
    ['Ventas completadas', 4],
    ['Monto de ventas', 'S/ 350.00'],
    ['Ofertas pendientes', 3],
    ['Reportes pendientes', 2],
    ['Cuentas bloqueadas', 0],
  ];
  const estados = [
    ['Borrador', 2],
    ['Publicado', 12],
    ['Pausado', 1],
    ['Reservado', 2],
    ['Vendido', 4],
    ['Retirado', 0],
    ['Eliminado', 0],
  ];
  const ofertas = [
    ['Pendiente', 3],
    ['Aceptada', 4],
    ['Rechazada', 1],
    ['Retirada', 1],
    ['Cerrada', 2],
  ];
  return (
    <>
      <div className="rejilla-productos mt-6">
        {ejemplos.map(([etiqueta, valor]) => (
          <article className="neg-tarjeta" key={etiqueta}>
            <h2>{etiqueta}</h2>
            <p className="neg-precio">{valor}</p>
          </article>
        ))}
      </div>
      <section className="neg-tarjeta">
        <h2>Estados de publicaciones</h2>
        {estados.map(([estado, cantidad]) => (
          <div className="barra-metrica" key={estado}>
            <span>{estado}</span>
            <progress max="21" value={cantidad} aria-label={estado} />
            <strong>{cantidad}</strong>
          </div>
        ))}
      </section>
      <section className="neg-tarjeta">
        <h2>Ofertas por estado</h2>
        {ofertas.map(([estado, cantidad]) => (
          <p className="my-2" key={estado}>
            {estado}: {cantidad}
          </p>
        ))}
      </section>
    </>
  );
}
