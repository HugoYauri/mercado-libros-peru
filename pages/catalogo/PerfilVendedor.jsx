import { useSearchParams } from 'react-router-dom';
import { avisos } from '../../assets/js/compartido/storage.js';
import { perfilPublico, usuarioActivo } from '../../assets/js/compartido/sesion.js';
import { reputacion } from '../../assets/js/hu6/reputacion.js';
import Marco, { fechaLegible } from '../compartido/Marco.jsx';
import TarjetaAviso from '../compartido/TarjetaAviso.jsx';
import BotonReporte from '../compartido/BotonReporte.jsx';

export default function PerfilVendedor() {
  const [parametros] = useSearchParams();
  const correo = parametros.get('correo') || 'rosa.quispe@aloe.ulima.edu.pe';
  const usuario = perfilPublico(correo);
  if (!usuario || usuario.bloqueado)
    return (
      <Marco titulo="Perfil no disponible">
        <a href="/catalogo">Volver al catálogo</a>
      </Marco>
    );
  const { recibidas, promedio } = reputacion(correo);
  const productos = avisos().filter(
    (aviso) => aviso.owner === correo && ['Publicado', 'Vendido'].includes(aviso.status),
  );
  return (
    <Marco
      titulo={usuario.nombres + ' ' + usuario.apellidos}
      descripcion={usuario.carrera + ' · ciclo ' + usuario.ciclo}
    >
      <section className="neg-tarjeta">
        <h2>Reputación</h2>
        <p className="neg-precio">
          {recibidas.length ? promedio.toFixed(1) + ' ★' : 'Sin calificaciones'}
        </p>
        <p>{recibidas.length} reseñas recibidas</p>
        {usuarioActivo()?.correo !== correo && (
          <div className="neg-acciones">
            <BotonReporte
              tipo="Usuario"
              objetivo={correo}
            />
          </div>
        )}
      </section>
      <h2>Publicaciones del vendedor</h2>
      {!productos.length && (
        <p className="neg-ayuda">No tiene publicaciones disponibles.</p>
      )}
      <div className="rejilla-productos">
        {productos.map((aviso) => (
          <TarjetaAviso
            key={aviso.id}
            aviso={aviso}
          />
        ))}
      </div>
      <h2 className="mt-8">Opiniones de otros estudiantes</h2>
      {recibidas.map((resena) => (
        <article
          key={resena.id}
          className="neg-tarjeta"
        >
          <p>
            {'★'.repeat(resena.puntaje)} ·{' '}
            {perfilPublico(resena.autor)?.nombres || 'Estudiante'}
          </p>
          <p className="mt-3">{resena.comentario || 'Sin comentario adicional.'}</p>
          <time>{fechaLegible(resena.fecha)}</time>
        </article>
      ))}
    </Marco>
  );
}
