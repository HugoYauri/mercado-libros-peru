import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { avisos } from '../../assets/js/compartido/storage.js';
import { perfilPublico, usuarioActivo } from '../../assets/js/compartido/sesion.js';
import { reputacion } from '../../assets/js/hu6/reputacion.js';
import Marco, { fechaLegible, useNegociaciones } from '../compartido/Marco.jsx';
import TarjetaAviso from '../compartido/TarjetaAviso.jsx';
import BotonReporte from '../compartido/BotonReporte.jsx';
import '../../assets/css/catalogo.css';

function fechaReciente(fecha) {
  const resultado = new Date(fecha).getTime();
  return Number.isNaN(resultado) ? 0 : resultado;
}

export default function PerfilVendedor() {
  const [parametros] = useSearchParams();
  const correo = parametros.get('correo') || 'rosa.quispe@aloe.ulima.edu.pe';
  const usuario = perfilPublico(correo);
  const [filtro, setFiltro] = useState('Todos');
  const { acuerdos } = useNegociaciones();

  if (!usuario || usuario.bloqueado)
    return (
      <Marco
        catalogo
        titulo="Perfil no disponible"
        descripcion="Este perfil no está disponible para consulta."
      >
        <a href="/catalogo" className="hu3-boton">Volver al catálogo</a>
      </Marco>
    );

  const { recibidas, promedio } = reputacion(correo);
  const productos = avisos()
    .filter(
      (aviso) => aviso.owner === correo && ['Publicado', 'Vendido'].includes(aviso.status),
    )
    .sort((a, b) => fechaReciente(b.published) - fechaReciente(a.published));
  const activos = productos.filter((aviso) => aviso.status === 'Publicado');
  const vendidos = productos.filter((aviso) => aviso.status === 'Vendido');
  const acuerdosCerrados = acuerdos.filter(
    (acuerdo) =>
      acuerdo.estado === 'Cerrado' &&
      (acuerdo.comprador === correo || acuerdo.vendedor === correo),
  ).length;
  const visibles =
    filtro === 'Activos' ? activos : filtro === 'Vendidos' ? vendidos : productos;
  const ultimasResenas = [...recibidas]
    .sort((a, b) => fechaReciente(b.fecha) - fechaReciente(a.fecha))
    .slice(0, 3);
  const esPerfilPropio = usuarioActivo()?.correo === correo;
  const nombre = `${usuario.nombres} ${usuario.apellidos}`;
  const inicial = `${usuario.nombres?.[0] || ''}${usuario.apellidos?.[0] || ''}`.toUpperCase();

  return (
    <Marco
      catalogo
      sinTitulo
      migas={
        <>
          <a href="/catalogo">Catálogo</a>
          <span>›</span>
          <span>Perfil de {nombre}</span>
        </>
      }
    >
      <section className="hu3-perfil-cabecera">
        <div className="hu3-perfil-identidad">
          <span className="hu3-perfil-avatar" aria-hidden="true">{inicial}</span>
          <div>
            <h1>
              {nombre}
              {promedio >= 4.5 && recibidas.length >= 3 && (
                <span className="hu3-insignia-confiable">Vendedor confiable</span>
              )}
            </h1>
            <p>{usuario.carrera} · {usuario.ciclo} ciclo</p>
            <p>Estudiante de la comunidad ULima</p>
            <div className="hu3-reputacion">
              {recibidas.length ? `${promedio.toFixed(1)} ★★★★★` : 'Sin calificaciones todavía'}{' '}
              <small>({recibidas.length} calificaciones recibidas)</small>
            </div>
          </div>
        </div>
        <div className="hu3-estadisticas-perfil">
          <div>
            <strong>{acuerdosCerrados}</strong>
            <span>acuerdos cerrados</span>
          </div>
          <div>
            <strong>{activos.length}</strong>
            <span>avisos activos</span>
          </div>
          {!esPerfilPropio && (
            <div className="hu3-perfil-reporte">
              <BotonReporte
                tipo="Usuario"
                objetivo={correo}
              />
            </div>
          )}
        </div>
      </section>

      <section className="hu3-seccion">
        <div className="hu3-seccion-cabecera">
          <h2>Avisos publicados</h2>
          <div className="hu3-pestanas" aria-label="Filtrar avisos del vendedor">
            {[
              ['Todos', productos.length],
              ['Activos', activos.length],
              ['Vendidos', vendidos.length],
            ].map(([nombreFiltro, cantidad]) => (
              <button
                type="button"
                className="hu3-chip-pestana"
                aria-pressed={filtro === nombreFiltro}
                key={nombreFiltro}
                onClick={() => setFiltro(nombreFiltro)}
              >
                {nombreFiltro} · {cantidad}
              </button>
            ))}
          </div>
        </div>
        {visibles.length ? (
          <div className="hu3-rejilla-productos hu3-rejilla-perfil">
            {visibles.map((aviso) => (
              <TarjetaAviso
                key={aviso.id}
                aviso={aviso}
                variant="hu3"
              />
            ))}
          </div>
        ) : (
          <div className="hu3-estado-vacio hu3-perfil-sin-avisos">
            <h2>No hay avisos en esta sección</h2>
            <p>Las publicaciones del vendedor aparecerán aquí.</p>
          </div>
        )}
      </section>

      <section className="hu3-seccion">
        <div className="hu3-seccion-cabecera">
          <h2>Últimas calificaciones recibidas</h2>
        </div>
        {ultimasResenas.length ? (
          <div className="hu3-resenas-grid">
            {ultimasResenas.map((resena) => (
              <article
                className="hu3-resena"
                key={resena.id}
              >
                <div>
                  <p className="hu3-resena-estrellas" aria-label={`${resena.puntaje} de 5 estrellas`}>
                    {'★'.repeat(resena.puntaje)}
                  </p>
                  <p>{resena.comentario || 'Sin comentario adicional.'}</p>
                  <small>
                    {perfilPublico(resena.autor)?.nombres || 'Estudiante'} ·{' '}
                    {perfilPublico(resena.autor)?.carrera || 'ULima'}
                  </small>
                </div>
                <time dateTime={resena.fecha}>{fechaLegible(resena.fecha)}</time>
              </article>
            ))}
          </div>
        ) : (
          <p className="hu3-resenas-vacias">Este vendedor aún no recibió calificaciones.</p>
        )}
      </section>
    </Marco>
  );
}
