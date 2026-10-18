import { useEffect, useState } from 'react';
import { listarFotos } from '../../assets/js/compartido/storage.js';
import { dinero } from './Marco.jsx';

export default function TarjetaAviso({ aviso, children }) {
  const [foto, setFoto] = useState(aviso.imagen || '');
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
    <article className="tarjeta-aviso">
      <a href={'/aviso?id=' + aviso.id}>
        {foto ? (
          <img
            src={foto}
            alt={aviso.title}
            className="portada-aviso"
          />
        ) : (
          <div className="portada-aviso sin-foto">Sin fotografía</div>
        )}
        <div className="p-5">
          <p className="neg-ayuda">
            {aviso.category} · {aviso.course}
          </p>
          <h2>{aviso.title}</h2>
          <p className="neg-precio">{dinero(aviso.price)}</p>
          <p>{aviso.condition}</p>
          <span className="neg-estado">{aviso.status}</span>
        </div>
      </a>
      {children && <div className="p-5">{children}</div>}
    </article>
  );
}
