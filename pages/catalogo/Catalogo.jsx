import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  avisos,
  favoritos,
  alternarFavorito,
} from '../../assets/js/compartido/storage.js';
import { perfilPublico, usuarioActivo } from '../../assets/js/compartido/sesion.js';
import { categorias as categoriasDisponibles, condiciones } from '../../assets/js/hu2/publicaciones.js';
import Marco from '../compartido/Marco.jsx';
import TarjetaAviso from '../compartido/TarjetaAviso.jsx';
import '../../assets/css/catalogo.css';

function fechaPublicacion(fecha) {
  if (fecha.includes('/')) {
    const [dia, mes, anio] = fecha.split('/');
    return new Date(Number(anio), Number(mes) - 1, Number(dia)).getTime();
  }
  return new Date(fecha).getTime();
}

function alternarElemento(lista, elemento) {
  return lista.includes(elemento)
    ? lista.filter((actual) => actual !== elemento)
    : [...lista, elemento];
}

function EsqueletoCatalogo() {
  return (
    <div
      className="hu3-catalogo-esqueleto"
      aria-hidden="true"
    >
      <div className="hu3-esqueleto-filtros">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="hu3-esqueleto-resultados">
        <div className="hu3-esqueleto-cabecera"><span /><span /><span /></div>
        <div className="hu3-esqueleto-tarjetas">
          {Array.from({ length: 8 }, (_, indice) => (
            <div
              className="hu3-esqueleto-tarjeta"
              key={indice}
            >
              <span />
              <div><i /><i /><i /><i /></div>
            </div>
          ))}
        </div>
        <p><span /> Buscando avisos…</p>
      </div>
    </div>
  );
}

export default function Catalogo() {
  const [parametros, setParametros] = useSearchParams();
  const [cargando, setCargando] = useState(true);
  const [guardados, setGuardados] = useState(favoritos);
  const [pagina, setPagina] = useState(1);
  const [orden, setOrden] = useState('reciente');
  const [categoriasActivas, setCategoriasActivas] = useState(() => {
    const categoriaInicial = parametros.get('categoria');
    return categoriaInicial ? [categoriaInicial] : [];
  });
  const [curso, setCurso] = useState(parametros.get('curso') || '');
  const [condicionesActivas, setCondicionesActivas] = useState([]);
  const [minimo, setMinimo] = useState('');
  const [maximo, setMaximo] = useState('');
  const [busqueda, setBusqueda] = useState(parametros.get('q') || '');
  const [alertaCreada, setAlertaCreada] = useState(false);

  useEffect(() => {
    const temporizador = setTimeout(() => setCargando(false), 420);
    return () => clearTimeout(temporizador);
  }, []);

  useEffect(() => {
    setPagina(1);
  }, [busqueda, categoriasActivas, curso, condicionesActivas, minimo, maximo, orden]);

  const listaCatalogo = avisos().filter(
    (aviso) =>
      aviso.status === 'Publicado' && !perfilPublico(aviso.owner)?.bloqueado,
  );
  const cursosDisponibles = [...new Set(listaCatalogo.map((aviso) => aviso.course))].sort();
  const precioTope = Math.max(250, ...listaCatalogo.map((aviso) => Number(aviso.price) || 0));
  const precioInvalido =
    (minimo !== '' && Number(minimo) < 0) ||
    (maximo !== '' && Number(maximo) < 0) ||
    (minimo !== '' && maximo !== '' && Number(minimo) > Number(maximo));

  const resultados = listaCatalogo
    .filter((aviso) => {
      const texto = `${aviso.title} ${aviso.description} ${aviso.course}`.toLowerCase();
      return (
        !precioInvalido &&
        texto.includes(busqueda.toLowerCase().trim()) &&
        (!categoriasActivas.length || categoriasActivas.includes(aviso.category)) &&
        (!curso || aviso.course === curso) &&
        (!condicionesActivas.length || condicionesActivas.includes(aviso.condition)) &&
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

  const paginas = Math.max(1, Math.ceil(resultados.length / 12));
  const actual = Math.min(pagina, paginas);
  const visibles = resultados.slice((actual - 1) * 12, actual * 12);
  const sugerencias = useMemo(() => {
    const candidatas = listaCatalogo.filter(
      (aviso) =>
        (!curso || aviso.course === curso) &&
        (!categoriasActivas.length || categoriasActivas.includes(aviso.category)),
    );
    return (candidatas.length ? candidatas : listaCatalogo).slice(0, 4);
  }, [curso, categoriasActivas, listaCatalogo.length]);

  function limpiar() {
    setBusqueda('');
    setCategoriasActivas([]);
    setCurso('');
    setCondicionesActivas([]);
    setMinimo('');
    setMaximo('');
    setAlertaCreada(false);
    setParametros({});
  }

  function buscar(event) {
    event.preventDefault();
    const nuevosParametros = new URLSearchParams(parametros);
    if (busqueda.trim()) nuevosParametros.set('q', busqueda.trim());
    else nuevosParametros.delete('q');
    setParametros(nuevosParametros);
  }

  function quitarBusqueda() {
    setBusqueda('');
    const nuevosParametros = new URLSearchParams(parametros);
    nuevosParametros.delete('q');
    setParametros(nuevosParametros);
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

  function quitarCategoria(categoria) {
    setCategoriasActivas((actuales) => actuales.filter((valor) => valor !== categoria));
  }

  function quitarCondicion(condicion) {
    setCondicionesActivas((actuales) => actuales.filter((valor) => valor !== condicion));
  }

  const rangoActivo = minimo !== '' || maximo !== '';

  return (
    <Marco
      catalogo
      sinTitulo
      busquedaLocal={{ valor: busqueda, cambiar: setBusqueda, buscar }}
    >
      <div className="hu3-catalogo-layout">
        {cargando ? (
          <EsqueletoCatalogo />
        ) : (
          <>
            <aside
              className="hu3-filtros"
              aria-label="Filtros del catálogo"
            >
              <div className="hu3-filtros-titulo">
                <h2>Filtros</h2>
                <button
                  type="button"
                  onClick={limpiar}
                  className="hu3-enlace"
                >
                  Limpiar
                </button>
              </div>

              <fieldset className="hu3-grupo-filtro">
                <legend>Categoría</legend>
                {categoriasDisponibles.map((categoria) => {
                  const cantidad = listaCatalogo.filter(
                    (aviso) => aviso.category === categoria,
                  ).length;
                  return (
                    <label
                      className="hu3-opcion-filtro"
                      key={categoria}
                    >
                      <input
                        type="checkbox"
                        checked={categoriasActivas.includes(categoria)}
                        onChange={() =>
                          setCategoriasActivas((actuales) =>
                            alternarElemento(actuales, categoria),
                          )
                        }
                      />
                      <span>{categoria}</span>
                      <small>{cantidad}</small>
                    </label>
                  );
                })}
              </fieldset>

              <label className="hu3-grupo-filtro hu3-curso-filtro">
                Curso asociado
                <select
                  value={curso}
                  onChange={(event) => setCurso(event.target.value)}
                >
                  <option value="">Todos los cursos</option>
                  {cursosDisponibles.map((valor) => (
                    <option key={valor}>{valor}</option>
                  ))}
                </select>
              </label>

              <fieldset className="hu3-grupo-filtro hu3-precio-filtro">
                <legend>Rango de precio</legend>
                <div className="hu3-rangos">
                  <input
                    aria-label="Precio mínimo del deslizador"
                    type="range"
                    min="0"
                    max={precioTope}
                    step="5"
                    value={Math.min(Number(minimo || 0), Number(maximo || precioTope))}
                    onChange={(event) => setMinimo(event.target.value)}
                  />
                  <input
                    aria-label="Precio máximo del deslizador"
                    type="range"
                    min="0"
                    max={precioTope}
                    step="5"
                    value={Math.max(Number(maximo || precioTope), Number(minimo || 0))}
                    onChange={(event) => setMaximo(event.target.value)}
                  />
                </div>
                <div className="hu3-precio-campos">
                  <label>
                    <span className="hu3-solo-lectores">Precio mínimo en soles</span>
                    <span aria-hidden="true">S/</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="Mínimo"
                      value={minimo}
                      onChange={(event) => setMinimo(event.target.value)}
                    />
                  </label>
                  <label>
                    <span className="hu3-solo-lectores">Precio máximo en soles</span>
                    <span aria-hidden="true">S/</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="Máximo"
                      value={maximo}
                      onChange={(event) => setMaximo(event.target.value)}
                    />
                  </label>
                </div>
              </fieldset>

              <fieldset className="hu3-grupo-filtro">
                <legend>Estado del producto</legend>
                {condiciones.map((condicion) => (
                  <label
                    className="hu3-opcion-filtro"
                    key={condicion}
                  >
                    <input
                      type="checkbox"
                      checked={condicionesActivas.includes(condicion)}
                      onChange={() =>
                        setCondicionesActivas((actuales) =>
                          alternarElemento(actuales, condicion),
                        )
                      }
                    />
                    <span>{condicion}</span>
                  </label>
                ))}
              </fieldset>
            </aside>

            <section className="hu3-resultados">
              <div className="hu3-filtros-activos">
                <span>Filtros activos:</span>
                {busqueda.trim() && (
                  <button
                    type="button"
                    className="hu3-chip"
                    onClick={quitarBusqueda}
                  >
                    {busqueda} <span aria-hidden="true">×</span>
                  </button>
                )}
                {categoriasActivas.map((categoria) => (
                  <button
                    type="button"
                    className="hu3-chip"
                    key={categoria}
                    onClick={() => quitarCategoria(categoria)}
                  >
                    {categoria} <span aria-hidden="true">×</span>
                  </button>
                ))}
                {curso && (
                  <button
                    type="button"
                    className="hu3-chip"
                    onClick={() => setCurso('')}
                  >
                    {curso} <span aria-hidden="true">×</span>
                  </button>
                )}
                {rangoActivo && (
                  <button
                    type="button"
                    className="hu3-chip"
                    onClick={() => {
                      setMinimo('');
                      setMaximo('');
                    }}
                  >
                    S/ {minimo || '0'} – S/ {maximo || precioTope} <span aria-hidden="true">×</span>
                  </button>
                )}
                {condicionesActivas.map((condicion) => (
                  <button
                    type="button"
                    className="hu3-chip"
                    key={condicion}
                    onClick={() => quitarCondicion(condicion)}
                  >
                    {condicion} <span aria-hidden="true">×</span>
                  </button>
                ))}
                {(busqueda || categoriasActivas.length || curso || rangoActivo || condicionesActivas.length) ? (
                  <button
                    type="button"
                    className="hu3-limpiar-todo"
                    onClick={limpiar}
                  >
                    Limpiar todo
                  </button>
                ) : (
                  <span className="hu3-sin-filtros">Ninguno</span>
                )}
              </div>

              <div className="hu3-resultados-cabecera">
                <p aria-live="polite">
                  <strong>{resultados.length}</strong> avisos encontrados
                  {busqueda.trim() && <> para «{busqueda.trim()}»</>}
                </p>
                <label>
                  Ordenar por
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

              {precioInvalido && (
                <p
                  className="hu3-mensaje-error"
                  role="alert"
                >
                  Revisa el rango de precios.
                </p>
              )}

              {visibles.length ? (
                <>
                  <div className="hu3-rejilla-productos">
                    {visibles.map((aviso) => (
                      <TarjetaAviso
                        key={aviso.id}
                        aviso={aviso}
                        variant="hu3"
                      >
                        <button
                          type="button"
                          className={
                            guardados.includes(aviso.id)
                              ? 'hu3-corazon hu3-corazon-activo'
                              : 'hu3-corazon'
                          }
                          aria-label={
                            guardados.includes(aviso.id)
                              ? 'Quitar de favoritos'
                              : 'Guardar en favoritos'
                          }
                          aria-pressed={guardados.includes(aviso.id)}
                          onClick={() => favorito(aviso.id)}
                        >
                          {guardados.includes(aviso.id) ? '♥' : '♥'}
                        </button>
                      </TarjetaAviso>
                    ))}
                  </div>
                  <div className="hu3-paginacion">
                    <p>
                      Mostrando {resultados.length ? (actual - 1) * 12 + 1 : 0}–
                      {Math.min(actual * 12, resultados.length)} de {resultados.length} resultados
                    </p>
                    <nav aria-label="Paginación del catálogo">
                      <button
                        type="button"
                        aria-label="Página anterior"
                        disabled={actual === 1}
                        onClick={() => setPagina(actual - 1)}
                      >
                        ‹
                      </button>
                      {Array.from({ length: paginas }, (_, indice) => (
                        <button
                          type="button"
                          key={indice + 1}
                          aria-current={actual === indice + 1 ? 'page' : undefined}
                          onClick={() => setPagina(indice + 1)}
                        >
                          {indice + 1}
                        </button>
                      ))}
                      <button
                        type="button"
                        aria-label="Página siguiente"
                        disabled={actual === paginas}
                        onClick={() => setPagina(actual + 1)}
                      >
                        ›
                      </button>
                    </nav>
                  </div>
                </>
              ) : (
                <>
                  <section className="hu3-estado-vacio">
                    <span className="hu3-vacio-icono" aria-hidden="true">⌕</span>
                    <h2>Ningún aviso coincide con tu búsqueda</h2>
                    <p>
                      Prueba con menos filtros o amplía el rango de precio. También puedes crear una
                      alerta para esta búsqueda.
                    </p>
                    {alertaCreada && (
                      <p
                        className="hu3-mensaje-exito"
                        role="status"
                      >
                        Alerta de búsqueda preparada para esta sesión.
                      </p>
                    )}
                    <div>
                      <button
                        type="button"
                        className="hu3-boton"
                        onClick={limpiar}
                      >
                        Limpiar filtros
                      </button>
                      <button
                        type="button"
                        className="hu3-boton hu3-boton-borde"
                        onClick={() => setAlertaCreada(true)}
                      >
                        Crear alerta de búsqueda
                      </button>
                    </div>
                  </section>
                  {sugerencias.length > 0 && (
                    <section className="hu3-sugerencias">
                      <h2>Quizá te interese</h2>
                      <div className="hu3-rejilla-productos">
                        {sugerencias.map((aviso) => (
                          <TarjetaAviso
                            key={aviso.id}
                            aviso={aviso}
                            variant="hu3"
                          />
                        ))}
                      </div>
                    </section>
                  )}
                </>
              )}
            </section>
          </>
        )}
      </div>
    </Marco>
  );
}
