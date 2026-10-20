import { usuarioActivo } from '../../assets/js/compartido/sesion.js';
import Marco from '../compartido/Marco.jsx';
import '../../assets/css/cuenta.css';

// Las pantallas privadas reutilizan la cabecera de las demás historias de usuario.
export default function MarcoCuenta({ children, privado = false, clase = '' }) {
  const usuario = usuarioActivo();
  if (privado && usuario) {
    return (
      <Marco
        cuenta
        sinTitulo
      >
        <div className={clase}>{children}</div>
      </Marco>
    );
  }

  return (
    <div className="hu1-app hu1-publico">
      <header className="hu1-cabecera-publica">
        <div className="hu1-barra-publica">
          <a
            className="hu1-marca"
            href="/"
          >
            <span
              className="hu1-logo"
              aria-hidden="true"
            />
            Tablón ULima
          </a>
          <nav aria-label="Navegación principal">
            <a href="/catalogo">Catálogo</a>
            <a href="/#como-funciona">Cómo funciona</a>
            <a href="/#normas">Normas del tablón</a>
            <a href="mailto:tablon@ulima.edu.pe">Ayuda</a>
          </nav>
          <div className="hu1-acceso-publico">
            {usuario ? (
              <a
                className="hu1-boton"
                href="/mi-cuenta"
              >
                Mi cuenta
              </a>
            ) : (
              <>
                <span className="hu1-visitante">Visitante</span>
                {location.pathname !== '/ingresar' && (
                  <a
                    className="hu1-enlace"
                    href="/ingresar"
                  >
                    Ingresar
                  </a>
                )}
                {location.pathname !== '/registro' && (
                  <a
                    className="hu1-boton"
                    href="/registro"
                  >
                    Crear cuenta
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      </header>
      <main className={'hu1-contenido-publico ' + clase}>{children}</main>
      <footer className="hu1-pie-publico">
        <div className="hu1-pie-interior">
          <span>
            Universidad de Lima · Campus Monterrico · Av. Javier Prado Este 4600
          </span>
          <div>
            <a href="/#normas">Normas del tablón</a>
            <a href="mailto:tablon@ulima.edu.pe">Mesa de ayuda</a>
            <a href="mailto:tablon@ulima.edu.pe">tablon@ulima.edu.pe</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
