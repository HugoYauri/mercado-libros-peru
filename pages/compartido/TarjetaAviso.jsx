import { useEffect, useState } from 'react';
import { listarFotos } from '../../assets/js/compartido/storage.js';
import { dinero } from './Marco.jsx';

export default function TarjetaAviso({ aviso, children, variant = '' }) {
  const imagenDemo = variant === 'hu3' && aviso.imagen === '/imagenes/libro.svg';
  const [foto, setFoto] = useState(imagenDemo ? '' : aviso.imagen || '');
  useEffect(() => {
    let activo = true;
    let url = '';
    listarFotos(aviso.id)
      .then((fotos) => {
        if (!activo || !fotos.length) return;
        url = URL.createObjectURL(fotos[0]);
        setFoto(url);
      })
      .catch(() => {});
    return () => {
      activo = false;
      if (url) URL.revokeObjectURL(url);
    };
  }, [aviso.id]);
  return (
    <article className={`tarjeta-aviso ${variant === 'hu3' ? 'hu3-tarjeta-aviso' : ''}`}>
      <a
        href={'/aviso?id=' + aviso.id}
        className={variant === 'hu3' ? 'hu3-tarjeta-enlace' : undefined}
      >
        <div className={variant === 'hu3' ? 'hu3-tarjeta-portada' : undefined}>
          {foto ? (
            <img
              src={foto}
              alt={aviso.title}
              className="portada-aviso"
            />
          ) : (
            <div
              className="portada-aviso sin-foto"
              aria-label="Fotografía no disponible"
            />
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
      </a>
      {children && (
        <div className={variant === 'hu3' ? 'hu3-tarjeta-acciones' : 'p-5'}>
          {children}
        </div>
      )}
    </article>
  );
}
