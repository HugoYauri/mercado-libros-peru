import { useEffect, useRef, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { cerrarSesion, usuarioActivo } from '../../assets/js/compartido/sesion.js';
import { leerNegociaciones } from '../../assets/js/hu4/ofertas.js';
import '../../assets/css/negociaciones.css';

export function useNegociaciones() {
  const [datos, setDatos] = useState(leerNegociaciones);
  useEffect(() => {
    const actualizar = () => setDatos(leerNegociaciones());
    window.addEventListener('storage', actualizar);
    window.addEventListener('negociaciones-cambiaron', actualizar);
    return () => {
      window.removeEventListener('storage', actualizar);
      window.removeEventListener('negociaciones-cambiaron', actualizar);
    };
  }, []);
  return datos;
}

export function Privado({ children, administrador = false }) {
  const ubicacion = useLocation();
  const [, actualizar] = useState(0);
  useEffect(() => {
    const revisar = () => actualizar((valor) => valor + 1);
    window.addEventListener('storage', revisar);
    return () => window.removeEventListener('storage', revisar);
  }, []);
  if (!usuarioActivo()) {
    return (
      <Navigate
        replace
        to={`/ingresar?returnTo=${encodeURIComponent(ubicacion.pathname + ubicacion.search)}`}
      />
    );
  }
  if (administrador && usuarioActivo()?.rol !== 'administrador')
    return (
      <Navigate
        replace
        to="/acceso-denegado"
      />
    );
  return children;
}

export function Modal({ titulo, cerrar, children, className = '' }) {
  const dialogo = useRef(null);
  useEffect(() => {
    const elemento = dialogo.current;
    elemento.showModal();
    return () => elemento.close();
  }, []);
  return (
    <dialog
      ref={dialogo}
      className={'neg-modal ' + className}
      onCancel={cerrar}
      aria-labelledby="titulo-modal"
    >
      <div className="neg-fila">
        <h2 id="titulo-modal">{titulo}</h2>
        <button
          type="button"
          onClick={cerrar}
          aria-label="Cerrar ventana"
        >
          ✕
        </button>
      </div>
      {children}
    </dialog>
  );
}

export const dinero = (valor) => `S/ ${Number(valor).toFixed(2)}`;
export const fechaLegible = (valor) => new Date(valor).toLocaleString('es-PE');

export default function Marco({
  titulo,
  descripcion,
  children,
  publicaciones = false,
  migas,
  acciones,
}) {
  const usuario = usuarioActivo();
  const nombre = usuario
    ? `${usuario.nombres.split(' ')[0]} ${usuario.apellidos.split(' ')[0]}`
    : '';
  const iniciales = usuario ? usuario.nombres[0] + usuario.apellidos[0] : '';
  const enlaces = [
    ['/catalogo', 'Catálogo'],
    ['/mis-publicaciones', 'Mis publicaciones'],
    ['/favoritos', 'Favoritos'],
    ['/ofertas', 'Ofertas'],
    ['/acuerdos', 'Acuerdos'],
    ['/calificaciones', 'Calificaciones'],
    ['/mi-cuenta', 'Mi cuenta'],
  ];
  if (usuario?.rol === 'administrador')
    enlaces.push(['/administracion', 'Administración']);
  return (
    <div className={publicaciones ? 'neg-app hu2-app' : 'neg-app'}>
      <header className="neg-cabecera">
        <div className="neg-barra">
          <a
            className="neg-marca"
            href="/"
          >
            {publicaciones ? (
              <span
                className="hu2-logo"
                aria-hidden="true"
              />
            ) : (
              '■ '
            )}
            Tablón ULima
          </a>
          <form action="/catalogo">
            <input
              name="q"
              aria-label="Buscar productos"
              placeholder="Buscar libros, calculadoras, apuntes…"
            />
          </form>
          <a
            className="neg-boton"
            href="/nuevo-aviso"
          >
            Publicar aviso
          </a>
          {usuario && publicaciones ? (
            <div className="hu2-cuenta">
              <span className="hu2-rol">
                {usuario.rol === 'administrador' ? 'Administrador' : 'Usuario'}
              </span>
              <details className="hu2-menu-cuenta">
                <summary>
                  <span
                    className="hu2-avatar"
                    aria-hidden="true"
                  >
                    {iniciales}
                  </span>
                  {nombre} <span aria-hidden="true">⌄</span>
                </summary>
                <div className="hu2-menu-opciones">
                  <a href="/mi-cuenta">Mi cuenta</a>
                  <button
                    type="button"
                    onClick={() => {
                      cerrarSesion();
                      window.location.assign('/');
                    }}
                  >
                    Cerrar sesión
                  </button>
                </div>
              </details>
            </div>
          ) : usuario ? (
            <div>
              <a href="/mi-cuenta">{usuario.correo}</a>
              <button
                className="neg-salir"
                onClick={() => {
                  cerrarSesion();
                  window.location.assign('/');
                }}
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <a href="/ingresar">Ingresar</a>
          )}
        </div>
        <nav
          className="neg-navegacion"
          aria-label="Navegación principal"
        >
          {enlaces.map(([ruta, nombre]) => (
            <a
              key={ruta}
              href={ruta}
              aria-current={
                (publicaciones && ruta === '/mis-publicaciones') ||
                location.pathname.startsWith(ruta)
                  ? 'page'
                  : undefined
              }
            >
              {nombre}
            </a>
          ))}
        </nav>
      </header>
      <main className="neg-contenido">
        {publicaciones ? (
          <>
            {migas && (
              <nav
                className="hu2-migas"
                aria-label="Ruta de navegación"
              >
                {migas}
              </nav>
            )}
            <div className="hu2-titulo-fila">
              <div>
                <h1>{titulo}</h1>
                {descripcion && <p className="neg-subtitulo">{descripcion}</p>}
              </div>
              {acciones}
            </div>
          </>
        ) : (
          <>
            <h1>{titulo}</h1>
            <p className="neg-subtitulo">{descripcion}</p>
          </>
        )}
        {children}
      </main>
      <footer className="neg-pie">
        {publicaciones ? (
          <div className="hu2-pie-interior">
            <span>
              Universidad de Lima · Campus Monterrico · Av. Javier Prado Este 4600
            </span>
            <div>
              <a href="/#normas">Normas del tablón</a>
              <a href="mailto:tablon@ulima.edu.pe">Mesa de ayuda</a>
              <a href="mailto:tablon@ulima.edu.pe">tablon@ulima.edu.pe</a>
            </div>
          </div>
        ) : (
          <>
            Universidad de Lima · Campus Monterrico ·{' '}
            <a href="/#normas">Normas del tablón</a>
          </>
        )}
      </footer>
    </div>
  );
}
