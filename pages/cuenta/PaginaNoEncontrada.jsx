import Enlace from '../compartido/Enlace.jsx';
import MarcoCuenta from './MarcoCuenta.jsx';

export default function PaginaNoEncontrada() {
  function volver() {
    if (window.history.length > 1) window.history.back();
    else window.location.assign('/');
  }
  return (
    <MarcoCuenta clase="hu1-estado-pagina">
      <section>
        <p className="hu1-numero-404">404</p>
        <h1>Este aviso ya no está en el tablón</h1>
        <p className="hu1-intro">
          Puede que el vendedor lo haya retirado o que el enlace esté mal escrito. Busca algo
          parecido en el catálogo.
        </p>
        <div className="hu1-acciones">
          <Enlace className="hu1-boton" href="/#avisos">
            Ir al catálogo
          </Enlace>
          <button className="hu1-enlace" onClick={volver}>
            Volver atrás
          </button>
        </div>
      </section>
    </MarcoCuenta>
  );
}
