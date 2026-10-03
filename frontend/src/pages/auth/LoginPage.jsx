import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSession } from "../../hooks/useSession.js";
import { isMock } from "../../services/index.js";
export function LoginPage() {
  const { loginDemo } = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const [id, setId] = useState("diego");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await loginDemo(id);
      const from = location.state?.from;
      navigate(
        from?.pathname ? `${from.pathname}${from.search || ""}` : "/catalogo",
        { replace: true },
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="page-container auth-layout">
      <div className="auth-side">
        <p className="eyebrow">UN NUEVO CICLO PARA TUS LIBROS</p>
        <h1>
          Tu comunidad,
          <br />
          tu próximo libro.
        </h1>
        <p>
          Un mismo usuario puede comprar, vender y coordinar sus entregas dentro
          del campus.
        </p>
        <div className="book book-one">
          TABLÓN
          <br />
          <small>ULIMA</small>
        </div>
      </div>
      <section className="panel auth-form">
        <h2>Iniciar sesión</h2>
        <p>
          El acceso real con correo institucional y contraseña se construirá en
          HU-1.
        </p>
        {isMock ? (
          <>
            <div className="notice info">
              Acceso de demostración. No solicita ni valida contraseñas y no
              autoriza operaciones en el servidor.
            </div>
            <form onSubmit={submit}>
              <label>
                Cuenta de demostración
                <select value={id} onChange={(e) => setId(e.target.value)}>
                  <option value="diego">Diego Vargas · comprador</option>
                  <option value="rosa">Rosa Quispe · vendedora</option>
                  <option value="lucia">Lucía Ramírez · compradora</option>
                  <option value="sin-actividad">
                    Cuenta sin actividad · estados vacíos
                  </option>
                </select>
              </label>
              {error && (
                <p className="field-error" role="alert">
                  {error}
                </p>
              )}
              <button className="button full" disabled={busy}>
                {busy ? "Ingresando…" : "Entrar a la demostración"}
              </button>
            </form>
          </>
        ) : (
          <div className="notice">
            La API del esqueleto solo permite lecturas públicas. El inicio de
            sesión REST está pendiente.
          </div>
        )}
        <div className="auth-links">
          <Link to="/registro">Crear cuenta</Link>
          <Link to="/recuperar-contrasena">Recuperar contraseña</Link>
        </div>
      </section>
    </div>
  );
}
