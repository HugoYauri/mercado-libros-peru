import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useSession } from "../../hooks/useSession.js";
import { isMock } from "../../services/index.js";
export function SearchBox({ hero = false }) {
  const navigate = useNavigate();
  return (
    <form
      className={`search-box ${hero ? "hero-search" : ""}`}
      onSubmit={(e) => {
        e.preventDefault();
        const q = new FormData(e.currentTarget).get("q");
        navigate(`/catalogo?q=${encodeURIComponent(q)}`);
      }}
    >
      <input
        name="q"
        aria-label="Buscar avisos"
        placeholder="¿Qué estás buscando? Ej. Stewart Cálculo"
        maxLength={120}
      />
      <button className="button" type="submit">
        Buscar
      </button>
    </form>
  );
}
export function Layout() {
  const { user, logout } = useSession();
  const navigate = useNavigate();
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="topbar">
          <Link to="/" className="brand">
            <span className="brand-mark" aria-hidden="true">
              ▤
            </span>
            Tablón ULima
          </Link>
          <SearchBox />
          <div className="account-actions">
            <span className={`role ${user ? "user" : ""}`}>
              {user ? "USUARIO DEMO" : "VISITANTE"}
            </span>
            {user ? (
              <>
                <Link to="/mi-cuenta" className="user-link">
                  {user.nombres}
                </Link>
                <button
                  className="text-button"
                  onClick={async () => {
                    await logout();
                    navigate("/");
                  }}
                >
                  Salir
                </button>
                <Link className="button" to="/publicaciones/nueva">
                  Publicar aviso
                </Link>
              </>
            ) : (
              <>
                <Link to="/login">Ingresar</Link>
                <Link className="button" to="/registro">
                  Crear cuenta
                </Link>
              </>
            )}
          </div>
        </div>
        <nav className="main-nav" aria-label="Navegación principal">
          <NavLink to="/catalogo">Catálogo</NavLink>
          {user ? (
            <>
              <NavLink to="/publicaciones">Mis publicaciones</NavLink>
              <NavLink to="/favoritos">Favoritos</NavLink>
              <NavLink to="/ofertas/enviadas">Ofertas</NavLink>
              <NavLink to="/acuerdos">Acuerdos</NavLink>
              <NavLink to="/mi-cuenta">Mi cuenta</NavLink>
            </>
          ) : (
            <a href="/#como-funciona">Cómo funciona</a>
          )}
        </nav>
      </header>
      {isMock && (
        <div className="demo-bar">
          Proyecto académico · Demostración con datos ficticios
        </div>
      )}
      <main id="contenido">
        <Outlet />
      </main>
      <footer className="site-footer">
        <span>Universidad de Lima · Campus Monterrico</span>
        <span>Proyecto de Programación Web · 2026-2</span>
      </footer>
    </div>
  );
}
