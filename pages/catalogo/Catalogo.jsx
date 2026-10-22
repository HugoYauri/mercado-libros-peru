import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Marco from '../compartido/Marco.jsx';
import TarjetaAviso from '../compartido/TarjetaAviso.jsx';
import '../../assets/css/catalogo.css';

export default function Catalogo() {
  const ejemplos = [
    {
      id: 1,
      title: 'Cálculo de una variable — Stewart, 8.ª ed.',
      price: 95,
      category: 'Libros de texto',
      course: 'Cálculo I',
      condition: 'Muy buen estado',
    },
    {
      id: 2,
      title: 'Calculadora científica ClassWiz fx-991',
      price: 120,
      category: 'Calculadoras',
      course: 'Física II',
      condition: 'Como nuevo',
    },
    {
      id: 3,
      title: 'Juego de escuadras y escalímetro Faber',
      price: 38,
      category: 'Instrumentos de dibujo',
      course: 'Dibujo técnico',
      condition: 'Buen estado',
    },
    {
      id: 4,
      title: 'Apuntes de Contabilidad General — 2 ciclos',
      price: 25,
      category: 'Apuntes y guías',
      course: 'Contabilidad General',
      condition: 'Con marcas de uso',
    },
    {
      id: 5,
      title: 'Física para ciencias e ingeniería — Serway',
      price: 110,
      category: 'Libros de texto',
      course: 'Física II',
      condition: 'Buen estado',
    },
    {
      id: 6,
      title: 'Mandil de laboratorio talla M',
      price: 45,
      category: 'Uniformes y mandiles',
      course: 'Química General',
      condition: 'Buen estado',
    },
    {
      id: 7,
      title: 'Álgebra lineal — Grossman',
      price: 70,
      category: 'Libros de texto',
      course: 'Álgebra lineal',
      condition: 'Muy buen estado',
    },
    {
      id: 8,
      title: 'Guía de ejercicios de Estadística',
      price: 20,
      category: 'Apuntes y guías',
      course: 'Estadística',
      condition: 'Buen estado',
    },
    {
      id: 9,
      title: 'Calculadora Casio fx-570',
      price: 65,
      category: 'Calculadoras',
      course: 'Cálculo I',
      condition: 'Buen estado',
    },
    {
      id: 10,
      title: 'Tablero de dibujo A3',
      price: 50,
      category: 'Instrumentos de dibujo',
      course: 'Dibujo técnico',
      condition: 'Como nuevo',
    },
    {
      id: 11,
      title: 'Química — Chang, 12.ª ed.',
      price: 80,
      category: 'Libros de texto',
      course: 'Química General',
      condition: 'Buen estado',
    },
    {
      id: 12,
      title: 'Economía — Mankiw',
      price: 75,
      category: 'Libros de texto',
      course: 'Economía',
      condition: 'Muy buen estado',
    },
  ];
  const categorias = [
    'Libros de texto',
    'Apuntes y guías',
    'Calculadoras',
    'Instrumentos de dibujo',
    'Uniformes y mandiles',
  ];
  const condiciones = ['Como nuevo', 'Muy buen estado', 'Buen estado', 'Con marcas de uso'];
  const [parametros] = useSearchParams();
  const inicial = {
    texto: parametros.get('q') || '',
    categoria: parametros.get('categoria') || '',
    curso: '',
    condicion: '',
    minimo: '',
    maximo: '',
  };
  const [filtro, setFiltro] = useState(inicial);
  const [orden, setOrden] = useState('reciente');
  const [guardados, setGuardados] = useState([]);
  const visibles = ejemplos
    .filter(
      (aviso) =>
        aviso.title.toLowerCase().includes(filtro.texto.toLowerCase()) &&
        (!filtro.categoria || aviso.category === filtro.categoria) &&
        (!filtro.curso || aviso.course === filtro.curso) &&
        (!filtro.condicion || aviso.condition === filtro.condicion) &&
        aviso.price >= Number(filtro.minimo || 0) &&
        aviso.price <= Number(filtro.maximo || 250),
    )
    .sort((a, b) =>
      orden === 'menor' ? a.price - b.price : orden === 'mayor' ? b.price - a.price : a.id - b.id,
    );
  function cambiar(campo, valor) {
    setFiltro({ ...filtro, [campo]: valor });
  }
  return (
    <Marco
      historia="hu3"
      busqueda={{ valor: filtro.texto, cambiar: (valor) => cambiar('texto', valor) }}
    >
      <div className="hu3-catalogo-layout">
        <aside className="hu3-filtros" aria-label="Filtros del catálogo">
          <div className="hu3-filtros-titulo">
            <h2>Filtros</h2>
            <button
              className="hu3-enlace"
              onClick={() =>
                setFiltro({
                  texto: '',
                  categoria: '',
                  curso: '',
                  condicion: '',
                  minimo: '',
                  maximo: '',
                })
              }
            >
              Limpiar
            </button>
          </div>
          <fieldset className="hu3-grupo-filtro">
            <legend>Categoría</legend>
            {categorias.map((categoria) => (
              <label className="hu3-opcion-filtro" key={categoria}>
                <input
                  type="checkbox"
                  checked={filtro.categoria === categoria}
                  onChange={() =>
                    cambiar('categoria', filtro.categoria === categoria ? '' : categoria)
                  }
                />
                <span>{categoria}</span>
                <small>{ejemplos.filter((aviso) => aviso.category === categoria).length}</small>
              </label>
            ))}
          </fieldset>
          <label className="hu3-grupo-filtro hu3-curso-filtro">
            Curso asociado
            <select value={filtro.curso} onChange={(event) => cambiar('curso', event.target.value)}>
              <option value="">Todos los cursos</option>
              {[...new Set(ejemplos.map((aviso) => aviso.course))].map((curso) => (
                <option key={curso}>{curso}</option>
              ))}
            </select>
          </label>
          <fieldset className="hu3-grupo-filtro hu3-precio-filtro">
            <legend>Rango de precio</legend>
            <div className="hu3-rangos">
              <input
                type="range"
                aria-label="Precio mínimo"
                min="0"
                max="250"
                value={filtro.minimo || 0}
                onChange={(event) => cambiar('minimo', event.target.value)}
              />
              <input
                type="range"
                aria-label="Precio máximo"
                min="0"
                max="250"
                value={filtro.maximo || 250}
                onChange={(event) => cambiar('maximo', event.target.value)}
              />
            </div>
            <div className="hu3-precio-campos">
              {[
                ['minimo', 'Mínimo'],
                ['maximo', 'Máximo'],
              ].map(([campo, texto]) => (
                <label key={campo}>
                  <span>S/</span>
                  <input
                    type="number"
                    min="0"
                    aria-label={texto}
                    placeholder={texto}
                    value={filtro[campo]}
                    onChange={(event) => cambiar(campo, event.target.value)}
                  />
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset className="hu3-grupo-filtro">
            <legend>Estado del producto</legend>
            {condiciones.map((condicion) => (
              <label className="hu3-opcion-filtro" key={condicion}>
                <input
                  type="checkbox"
                  checked={filtro.condicion === condicion}
                  onChange={() =>
                    cambiar('condicion', filtro.condicion === condicion ? '' : condicion)
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
            {Object.entries(filtro)
              .filter(([, valor]) => valor)
              .map(([campo, valor]) => (
                <button className="hu3-chip" key={campo} onClick={() => cambiar(campo, '')}>
                  {valor} ×
                </button>
              ))}
          </div>
          <div className="hu3-resultados-cabecera">
            <p aria-live="polite">
              <strong>{visibles.length}</strong> avisos encontrados
            </p>
            <label>
              Ordenar por
              <select value={orden} onChange={(event) => setOrden(event.target.value)}>
                <option value="reciente">Más recientes</option>
                <option value="menor">Menor precio</option>
                <option value="mayor">Mayor precio</option>
              </select>
            </label>
          </div>
          {visibles.length ? (
            <div className="hu3-rejilla-productos">
              {visibles.map((aviso) => (
                <TarjetaAviso key={aviso.id} aviso={aviso} variant="hu3">
                  <button
                    className={
                      'hu3-corazon' + (guardados.includes(aviso.id) ? ' hu3-corazon-activo' : '')
                    }
                    aria-label={'Guardar ' + aviso.title}
                    aria-pressed={guardados.includes(aviso.id)}
                    onClick={() =>
                      setGuardados(
                        guardados.includes(aviso.id)
                          ? guardados.filter((id) => id !== aviso.id)
                          : [...guardados, aviso.id],
                      )
                    }
                  >
                    {guardados.includes(aviso.id) ? '♥' : '♡'}
                  </button>
                </TarjetaAviso>
              ))}
            </div>
          ) : (
            <section className="hu3-estado-vacio">
              <h2>No encontramos avisos</h2>
              <p>Prueba otra búsqueda o limpia los filtros.</p>
            </section>
          )}
          <nav className="hu3-paginacion" aria-label="Paginación de ejemplo">
            <button disabled>Anterior</button>
            <span aria-current="page">1</span>
            <button disabled>Siguiente</button>
          </nav>
        </section>
      </div>
    </Marco>
  );
}
