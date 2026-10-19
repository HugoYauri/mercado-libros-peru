import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  avisos,
  favoritos,
  alternarFavorito,
} from '../../assets/js/compartido/storage.js';
import { usuarioActivo, perfilPublico } from '../../assets/js/compartido/sesion.js';
import { categorias, condiciones } from '../../assets/js/hu2/publicaciones.js';
import Marco from '../compartido/Marco.jsx';
import TarjetaAviso from '../compartido/TarjetaAviso.jsx';

function fechaPublicacion(fecha) {
  if (fecha.includes('/')) {
    const [dia, mes, anio] = fecha.split('/');
    return new Date(Number(anio), Number(mes) - 1, Number(dia)).getTime();
  }
  return new Date(fecha).getTime();
}

export default function Catalogo() {
  const [parametros, setParametros] = useSearchParams();
  const [cargando, setCargando] = useState(true);
  const [guardados, setGuardados] = useState(favoritos);
  const [pagina, setPagina] = useState(1);
  const [orden, setOrden] = useState('reciente');
  const [categoria, setCategoria] = useState(parametros.get('categoria') || '');
  const [curso, setCurso] = useState(parametros.get('curso') || '');
  const [condicion, setCondicion] = useState('');
  const [minimo, setMinimo] = useState('');
  const [maximo, setMaximo] = useState('');
  const [busqueda, setBusqueda] = useState(parametros.get('q') || '');

  useEffect(() => {
    const temporizador = setTimeout(() => setCargando(false), 300);
    return () => clearTimeout(temporizador);
  }, []);
  useEffect(() => {
    setPagina(1);
  }, [busqueda, categoria, curso, condicion, minimo, maximo, orden]);

  const precioInvalido =
    (minimo !== '' && Number(minimo) < 0) ||
    (maximo !== '' && Number(maximo) < 0) ||
    (minimo !== '' && maximo !== '' && Number(minimo) > Number(maximo));
  const resultados = avisos()
    .filter((aviso) => {
      return (
        !precioInvalido &&
        aviso.status === 'Publicado' &&
        !perfilPublico(aviso.owner)?.bloqueado &&
        (aviso.title + ' ' + aviso.description + ' ' + aviso.course)
          .toLowerCase()
          .includes(busqueda.toLowerCase().trim()) &&
        (!categoria || aviso.category === categoria) &&
        aviso.course.toLowerCase().includes(curso.toLowerCase().trim()) &&
        (!condicion || aviso.condition === condicion) &&
        (minimo === '' || Number(aviso.price) >= Number(minimo)) &&
        (maximo === '' || Number(aviso.price) <= Number(maximo))
      );
    })
    .sort((a, b) =>
      orden === 'menor'
        ? a.price - b.price
        : orden === 'mayor'
          ? b.price - a.price
          : fechaPublicacion(b.published) - fechaPublicacion(a.published),
    );
  const paginas = Math.max(1, Math.ceil(resultados.length / 6));
  const actual = Math.min(pagina, paginas);
  const visibles = resultados.slice((actual - 1) * 6, actual * 6);

  function limpiar() {
    setBusqueda('');
    setCategoria('');
    setCurso('');
    setCondicion('');
    setMinimo('');
    setMaximo('');
    setParametros({});
  }

  function favorito(id) {
    if (!usuarioActivo()) {
      location.assign(
        '/ingresar?returnTo=' + encodeURIComponent(location.pathname + location.search),
      );
      return;
    }
    alternarFavorito(id);
    setGuardados(favoritos());
  }

  return (
    <Marco
      titulo="Catálogo"
      descripcion="Encuentra libros y materiales publicados por estudiantes."
    >
      <div className="catalogo-distribucion">
        <aside className="neg-tarjeta filtros-catalogo">
          <div className="neg-fila">
            <h2>Filtros</h2>
            <button
              className="neg-enlace"
              onClick={limpiar}
            >
              Limpiar
            </button>
          </div>
          <label>
            Buscar
            <input
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
              placeholder="Título o palabra clave"
            />
          </label>
          <label>
            Categoría
            <select
              value={categoria}
              onChange={(event) => setCategoria(event.target.value)}
            >
              <option value="">Todas</option>
              {categorias.map((valor) => (
                <option key={valor}>{valor}</option>
              ))}
            </select>
          </label>
          <label>
            Curso
            <input
              value={curso}
              onChange={(event) => setCurso(event.target.value)}
            />
          </label>
          <label>
            Estado del producto
            <select
              value={condicion}
              onChange={(event) => setCondicion(event.target.value)}
            >
              <option value="">Todos</option>
              {condiciones.map((valor) => (
                <option key={valor}>{valor}</option>
              ))}
            </select>
          </label>
          <label>
            Precio mínimo
            <input
              type="number"
              min="0"
              value={minimo}
              onChange={(event) => setMinimo(event.target.value)}
            />
          </label>
          <label>
            Precio máximo
            <input
              type="number"
              min="0"
              value={maximo}
              onChange={(event) => setMaximo(event.target.value)}
            />
          </label>
          {precioInvalido && (
            <p
              className="neg-error"
              role="alert"
            >
              Revisa el rango de precios.
            </p>
          )}
        </aside>
        <section>
          <div className="neg-fila">
            <p aria-live="polite">{resultados.length} avisos encontrados</p>
            <label>
              Ordenar
              <select
                value={orden}
                onChange={(event) => setOrden(event.target.value)}
              >
                <option value="reciente">Más recientes</option>
                <option value="menor">Menor precio</option>
                <option value="mayor">Mayor precio</option>
              </select>
            </label>
          </div>
          {cargando ? (
            <div
              role="status"
              aria-label="Cargando catálogo"
              className="rejilla-productos"
            >
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  className="esqueleto"
                />
              ))}
            </div>
          ) : visibles.length ? (
            <>
              <div className="rejilla-productos">
                {visibles.map((aviso) => (
                  <TarjetaAviso
                    key={aviso.id}
                    aviso={aviso}
                  >
                    <button
                      className="neg-secundario"
                      onClick={() => favorito(aviso.id)}
                    >
                      {guardados.includes(aviso.id) ? '♥ Guardado' : '♡ Guardar'}
                    </button>
                  </TarjetaAviso>
                ))}
              </div>
              <nav
                className="neg-acciones"
                aria-label="Paginación"
              >
                <button
                  className="neg-secundario"
                  disabled={actual === 1}
                  onClick={() => setPagina(actual - 1)}
                >
                  Anterior
                </button>
                <span>
                  Página {actual} de {paginas}
                </span>
                <button
                  className="neg-secundario"
                  disabled={actual === paginas}
                  onClick={() => setPagina(actual + 1)}
                >
                  Siguiente
                </button>
              </nav>
            </>
          ) : (
            <section className="neg-tarjeta neg-vacio">
              <h2>Ningún aviso coincide con tu búsqueda</h2>
              <p className="neg-ayuda">Prueba con menos filtros o amplía tu búsqueda.</p>
              <button
                className="neg-boton"
                onClick={limpiar}
              >
                Limpiar filtros
              </button>
            </section>
          )}
        </section>
      </div>
    </Marco>
  );
}
