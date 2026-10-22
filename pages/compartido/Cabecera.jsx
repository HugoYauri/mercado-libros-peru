import { useLocation } from 'react-router-dom';
import Enlace from './Enlace.jsx';

export default function Cabecera({ historia, publico = false, visitante = false, busqueda }) {
  const { pathname } = useLocation();
  const enlaces = [
    ['/catalogo', 'Catálogo'],
    ['/mis-publicaciones', 'Mis publicaciones'],
    ['/favoritos', 'Favoritos'],
    ['/ofertas', 'Ofertas'],
    ['/acuerdos', 'Acuerdos'],
    ['/calificaciones', 'Calificaciones'],
    ['/mi-cuenta', 'Mi cuenta'],
  ];
  if (historia === 'hu7') enlaces.push(['/administracion', 'Administración']);
  if (publico)
    return (
      <header className="hu1-cabecera-publica">
        <div className="hu1-barra-publica">
          <Enlace className="hu1-marca" href="/">
            <span className="hu1-logo" aria-hidden="true" />
            Tablón ULima
          </Enlace>
          <nav aria-label="Navegación principal">
            <Enlace href="/#avisos">Catálogo</Enlace>
            <Enlace href="/#como-funciona">Cómo funciona</Enlace>
            <Enlace href="/#normas">Normas del tablón</Enlace>
            <Enlace href="mailto:tablon@ulima.edu.pe">Ayuda</Enlace>
          </nav>
          <div className="hu1-acceso-publico">
            <span className="hu1-visitante">Visitante</span>
            {pathname !== '/ingresar' && (
              <Enlace className="hu1-enlace" href="/ingresar">
                Ingresar
              </Enlace>
            )}
            {pathname !== '/registro' && (
              <Enlace className="hu1-boton" href="/registro">
                Crear cuenta
              </Enlace>
            )}
          </div>
        </div>
      </header>
    );
  return (
    <header className="neg-cabecera">
      <div className="neg-barra">
        <Enlace className="neg-marca" href="/">
          <span className={historia + '-logo'} aria-hidden="true" />
          Tablón ULima
        </Enlace>
        <form onSubmit={(event) => event.preventDefault()}>
          <input
            aria-label="Buscar en esta pantalla"
            placeholder="Buscar libros, calculadoras, apuntes…"
            value={busqueda?.valor}
            onChange={busqueda ? (event) => busqueda.cambiar(event.target.value) : undefined}
          />
        </form>
        {visitante ? (
          <nav className="hu3-visitante-enlaces">
            <span className="hu3-rol-visitante">Visitante</span>
            <Enlace href="/ingresar">Ingresar</Enlace>
            <Enlace className="neg-boton" href="/registro">
              Crear cuenta
            </Enlace>
          </nav>
        ) : (
          <>
            <Enlace className="neg-boton" href="/nuevo-aviso">
              Publicar aviso
            </Enlace>
            <div className={historia + '-cuenta'}>
              <span className={historia + '-rol'}>
                {historia === 'hu7' ? 'Administrador' : 'Usuario'}
              </span>
              <details className={historia + '-menu-cuenta'}>
                <summary>
                  <span className={historia + '-avatar'} aria-hidden="true">
                    EE
                  </span>
                  Estudiante de ejemplo ▾
                </summary>
                <div className={historia + '-menu-opciones'}>
                  <Enlace href="/mi-cuenta">Mi cuenta</Enlace>
                  <button type="button" onClick={() => window.location.reload()}>
                    Reiniciar ejemplo
                  </button>
                </div>
              </details>
            </div>
          </>
        )}
      </div>
      {!visitante && (
        <nav className="neg-navegacion" aria-label="Navegación principal">
          {enlaces.map(([ruta, nombre]) => (
            <Enlace
              key={ruta}
              href={ruta}
              aria-current={
                pathname.startsWith(ruta) ||
                (ruta === '/mis-publicaciones' && historia === 'hu2') ||
                (ruta === '/catalogo' && historia === 'hu3' && pathname !== '/favoritos')
                  ? 'page'
                  : undefined
              }
            >
              {nombre}
            </Enlace>
          ))}
        </nav>
      )}
    </header>
  );
}
