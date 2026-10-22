import Enlace from './Enlace.jsx';
import { dinero } from './Marco.jsx';

export default function TarjetaAviso({ aviso, children, variant = '', destino }) {
  const foto = aviso.imagen || '';
  return (
    <article className={`tarjeta-aviso ${variant === 'hu3' ? 'hu3-tarjeta-aviso' : ''}`}>
      <Enlace
        href={destino || '/aviso?id=' + aviso.id}
        className={variant === 'hu3' ? 'hu3-tarjeta-enlace' : undefined}
      >
        <div className={variant === 'hu3' ? 'hu3-tarjeta-portada' : undefined}>
          {foto ? (
            <img src={foto} alt={aviso.title} className="portada-aviso" />
          ) : (
            <div className="portada-aviso sin-foto" aria-label="Fotografía no disponible" />
          )}
          {variant === 'hu3' && aviso.status === 'Vendido' && (
            <span className="hu3-etiqueta-vendido">Vendido</span>
          )}
        </div>
        {variant === 'hu3' ? (
          <div className="hu3-tarjeta-datos">
            <h2>{aviso.title}</h2>
            <p className="hu3-precio">{dinero(aviso.price)}</p>
            <p className="hu3-dato-secundario">
              {aviso.condition} · {aviso.course}
            </p>
            {aviso.status === 'Vendido' && (
              <p className="hu3-tarjeta-vendido">Ya se vendió · Ver avisos similares</p>
            )}
          </div>
        ) : (
          <div className="p-5">
            <p className="neg-ayuda">
              {aviso.category} · {aviso.course}
            </p>
            <h2>{aviso.title}</h2>
            <p className="neg-precio">{dinero(aviso.price)}</p>
            <p>{aviso.condition}</p>
            <span className="neg-estado">{aviso.status}</span>
          </div>
        )}
      </Enlace>
      {children && (
        <div className={variant === 'hu3' ? 'hu3-tarjeta-acciones' : 'p-5'}>{children}</div>
      )}
    </article>
  );
}
