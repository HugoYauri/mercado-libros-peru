import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Marco, { dinero } from '../compartido/Marco.jsx';
import Enlace from '../compartido/Enlace.jsx';
import ModalesPublicacion from './ModalesPublicacion.jsx';
import '../../assets/css/publicaciones.css';

export default function MisPublicaciones() {
  const ejemplos = [
    {
      id: 1,
      titulo: 'Cálculo de una variable — Stewart, 8.ª ed.',
      datos: 'Libros de texto · Cálculo I · Muy buen estado',
      precio: 95,
      estado: 'Publicado',
      ofertas: '4 ofertas',
      fecha: '18/08/2026',
    },
    {
      id: 2,
      titulo: 'Calculadora científica ClassWiz fx-991',
      datos: 'Calculadoras · Física II · Como nuevo',
      precio: 120,
      estado: 'Publicado',
      ofertas: '3 ofertas',
      fecha: '22/08/2026',
    },
    {
      id: 3,
      titulo: 'Juego de escuadras y escalímetro Faber',
      datos: 'Instrumentos de dibujo · Dibujo técnico · Buen estado',
      precio: 38,
      estado: 'Pausado',
      ofertas: '2 ofertas',
      fecha: '10/08/2026',
    },
    {
      id: 4,
      titulo: 'Apuntes de Contabilidad General — 2 ciclos',
      datos: 'Apuntes y guías · Contabilidad General · Con marcas de uso',
      precio: 25,
      estado: 'Publicado',
      ofertas: 'Sin ofertas',
      fecha: '29/08/2026',
    },
    {
      id: 5,
      titulo: 'Mandil de laboratorio talla M',
      datos: 'Uniformes y mandiles · Química General · Buen estado',
      precio: 45,
      estado: 'Borrador',
      ofertas: '—',
      fecha: 'Sin publicar',
    },
    {
      id: 6,
      titulo: 'Física para ciencias e ingeniería — Serway, tomo I',
      datos: 'Libros de texto · Física II · Buen estado',
      precio: 110,
      estado: 'Vendido',
      ofertas: 'Cerrado con 1',
      fecha: '05/08/2026',
    },
  ];
  const estados = [
    ['Todos', 'Todos'],
    ['Publicado', 'Publicados'],
    ['Pausado', 'Pausados'],
    ['Borrador', 'Borradores'],
    ['Vendido', 'Vendidos'],
  ];
  const [parametros] = useSearchParams();
  const [avisos, setAvisos] = useState(parametros.get('ejemplo') === 'vacio' ? [] : ejemplos);
  const [filtro, setFiltro] = useState({ estado: 'Todos', texto: '' });
  const [seleccion, setSeleccion] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const visibles = avisos.filter(
    (aviso) =>
      (filtro.estado === 'Todos' || aviso.estado === filtro.estado) &&
      aviso.titulo.toLowerCase().includes(filtro.texto.toLowerCase()),
  );

  function confirmar(estado) {
    setAvisos(
      estado === 'Eliminado'
        ? avisos.filter((aviso) => aviso.id !== seleccion.id)
        : avisos.map((aviso) => (aviso.id === seleccion.id ? { ...aviso, estado } : aviso)),
    );
    setSeleccion(null);
    setMensaje(
      estado === 'Eliminado' ? 'Aviso de ejemplo eliminado.' : 'Estado de ejemplo actualizado.',
    );
  }
  return (
    <Marco
      historia="hu2"
      titulo="Mis publicaciones"
      descripcion={avisos.length + ' avisos · 9 ofertas por responder'}
      acciones={
        <Enlace className="hu2-boton" href="/nuevo-aviso">
          Nuevo aviso
        </Enlace>
      }
    >
      <div className="hu2-herramientas">
        <div className="hu2-filtros" aria-label="Filtrar por estado">
          {estados.map(([valor, texto]) => (
            <button
              key={valor}
              className={'hu2-chip' + (filtro.estado === valor ? ' hu2-chip-activo' : '')}
              aria-pressed={filtro.estado === valor}
              onClick={() => setFiltro({ ...filtro, estado: valor })}
            >
              {texto} ·{' '}
              {valor === 'Todos'
                ? avisos.length
                : avisos.filter((aviso) => aviso.estado === valor).length}
            </button>
          ))}
        </div>
        <input
          className="hu2-buscar-propios"
          aria-label="Buscar en mis avisos"
          placeholder="Buscar en mis avisos…"
          value={filtro.texto}
          onChange={(event) => setFiltro({ ...filtro, texto: event.target.value })}
        />
      </div>
      {mensaje && (
        <p className="hu2-alerta hu2-alerta-exito" role="status">
          {mensaje}
        </p>
      )}
      {visibles.length ? (
        <>
          <div className="hu2-tabla-contenedor">
            <table className="hu2-tabla">
              <thead>
                <tr>
                  {['Foto', 'Aviso', 'Precio', 'Estado', 'Ofertas', 'Publicado', 'Acciones'].map(
                    (titulo) => (
                      <th key={titulo} scope="col">
                        {titulo}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {visibles.map((aviso) => (
                  <tr key={aviso.id} className={'hu2-fila-' + aviso.estado.toLowerCase()}>
                    <td>
                      <div className="hu2-miniatura-lista hu2-sin-foto">
                        {aviso.estado === 'Borrador' && 'sin foto'}
                      </div>
                    </td>
                    <td className="hu2-celda-aviso">
                      <h2>{aviso.titulo}</h2>
                      <p>{aviso.datos}</p>
                    </td>
                    <td className="hu2-precio">{dinero(aviso.precio)}</td>
                    <td>
                      <span className={'hu2-estado hu2-estado-' + aviso.estado.toLowerCase()}>
                        {aviso.estado}
                      </span>
                    </td>
                    <td>
                      <span className="hu2-enlace">{aviso.ofertas}</span>
                    </td>
                    <td className="hu2-fecha">{aviso.fecha}</td>
                    <td className="hu2-celda-acciones">
                      <details className="hu2-menu-acciones">
                        <summary>Acciones ▾</summary>
                        <div className="hu2-menu-opciones">
                          <Enlace href={'/nuevo-aviso?id=' + aviso.id}>Editar aviso</Enlace>
                          <Enlace href="/fotografias-aviso">Fotografías</Enlace>
                          <button
                            onClick={() =>
                              setSeleccion({
                                ...aviso,
                                estado: aviso.estado === 'Publicado' ? 'Pausado' : 'Publicado',
                              })
                            }
                          >
                            Cambiar estado
                          </button>
                          <button
                            className="hu2-texto-error"
                            onClick={() => setSeleccion({ ...aviso, estado: 'Eliminado' })}
                          >
                            Eliminar aviso
                          </button>
                        </div>
                      </details>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <nav className="hu2-paginacion" aria-label="Paginación de ejemplo">
            <p>
              Mostrando {visibles.length} de {avisos.length} avisos
            </p>
            <button disabled aria-label="Página anterior">
              ‹
            </button>
            <span aria-current="page">1</span>
            <button disabled aria-label="Página siguiente">
              ›
            </button>
          </nav>
        </>
      ) : (
        <section className="hu2-vacio hu2-panel">
          <span className="hu2-vacio-icono" />
          <h2>
            {avisos.length
              ? 'No encontramos publicaciones con estos filtros'
              : 'Todavía no publicas nada'}
          </h2>
          <p>Ese libro del ciclo pasado le puede servir a alguien esta semana.</p>
          <Enlace className="hu2-boton" href="/nuevo-aviso">
            Crear mi primer aviso
          </Enlace>
          <button className="hu2-enlace" onClick={() => setFiltro({ estado: 'Todos', texto: '' })}>
            Limpiar filtros
          </button>
        </section>
      )}
      {seleccion && (
        <ModalesPublicacion
          seleccion={seleccion}
          cerrar={() => setSeleccion(null)}
          confirmar={confirmar}
        />
      )}
    </Marco>
  );
}
