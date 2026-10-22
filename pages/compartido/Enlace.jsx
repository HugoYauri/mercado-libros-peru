import { Link, useLocation } from 'react-router-dom';
import { historiaDeRuta } from '../../assets/js/compartido/rutas.js';

export default function Enlace({ href = '', children, ...opciones }) {
  const { pathname } = useLocation();
  if (!href.startsWith('/') && !href.startsWith('#'))
    return (
      <a {...opciones} href={href}>
        {children}
      </a>
    );
  const ruta = href.split(/[?#]/)[0] || pathname;
  if (historiaDeRuta(ruta) !== historiaDeRuta(pathname))
    return (
      <a {...opciones} aria-disabled="true" title="Referencia visual de otra HU">
        {children}
      </a>
    );
  if (href.includes('#'))
    return (
      <a {...opciones} href={href}>
        {children}
      </a>
    );
  return (
    <Link {...opciones} to={href}>
      {children}
    </Link>
  );
}
