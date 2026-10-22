import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Marco from '../compartido/Marco.jsx';
import Enlace from '../compartido/Enlace.jsx';
import GaleriaFotografias from './GaleriaFotografias.jsx';
import VistaPreviaAviso from './VistaPreviaAviso.jsx';
import '../../assets/css/publicaciones.css';

export default function NuevoAviso() {
  const ejemplos = [
    {
      title: 'Cálculo de una variable — Stewart, 8.ª ed.',
      description:
        'Usado un ciclo en Cálculo I. Tapa firme, sin hojas sueltas y con anotaciones a lápiz.',
      category: 'Libros de texto',
      course: 'Cálculo I',
      condition: 'Muy buen estado',
      price: 95,
      minimum: 70,
      acceptsOffers: true,
    },
  ];
  const categorias = [
    'Libros de texto',
    'Calculadoras',
    'Instrumentos de dibujo',
    'Apuntes y guías',
  ];
  const condiciones = ['Como nuevo', 'Muy buen estado', 'Buen estado', 'Con marcas de uso'];
  const errores = [
    'Completa título y descripción.',
    'Indica categoría, curso, estado y precio.',
    'Agrega al menos una fotografía.',
  ];
  const [parametros] = useSearchParams();
  const [aviso, setAviso] = useState(
    parametros.has('id')
      ? ejemplos[0]
      : {
          title: '',
          description: '',
          category: '',
          course: '',
          condition: 'Buen estado',
          price: '',
          minimum: '',
          acceptsOffers: true,
        },
  );
  const [fotos, setFotos] = useState(
    parametros.has('id') ? [{ nombre: 'Portada', imagen: '' }] : [],
  );
  const [mensaje, setMensaje] = useState('');
  const [invalido, setInvalido] = useState(parametros.get('ejemplo') === 'errores');
  function guardar(event) {
    event.preventDefault();
    const borrador = event.nativeEvent.submitter.value === 'Borrador';
    if (
      !borrador &&
      (!fotos.length || (aviso.acceptsOffers && Number(aviso.minimum) > Number(aviso.price)))
    ) {
      setInvalido(true);
      return;
    }
    setInvalido(false);
    setMensaje(borrador ? 'Borrador de ejemplo preparado.' : 'Publicación de ejemplo preparada.');
  }
  return (
    <Marco
      historia="hu2"
      titulo={parametros.has('id') ? 'Editar aviso' : 'Nuevo aviso'}
      migas={
        <>
          <Enlace href="/mis-publicaciones">Mis publicaciones</Enlace>
          <span>›</span>
          <span>Nuevo aviso</span>
        </>
      }
    >
      <form
        onSubmit={guardar}
        onInvalid={() => setInvalido(true)}
        onChange={(event) => {
          const campo = event.target;
          if (campo.name)
            setAviso({
              ...aviso,
              [campo.name]: campo.type === 'checkbox' ? campo.checked : campo.value,
            });
        }}
      >
        {invalido && (
          <div className="hu2-alerta hu2-alerta-error" role="alert">
            <strong>No pudimos guardar el aviso.</strong>
            <ul>
              {errores.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        {mensaje && (
          <p className="hu2-alerta hu2-alerta-exito" role="status">
            {mensaje}
          </p>
        )}
        <div className="hu2-formulario">
          <div className="hu2-columna">
            <section className="hu2-panel">
              <h2>1 · Producto</h2>
              <label className="hu2-campo">
                <span className="hu2-etiqueta">Título del aviso</span>
                <input
                  name="title"
                  defaultValue={aviso.title}
                  minLength={15}
                  maxLength={120}
                  required
                />
                <span className="hu2-ayuda">
                  Incluye autor y edición: así lo buscan tus compañeros.
                </span>
              </label>
              <label className="hu2-campo">
                <span className="hu2-etiqueta">Descripción</span>
                <textarea
                  name="description"
                  defaultValue={aviso.description}
                  rows={5}
                  minLength={20}
                  required
                />
              </label>
              <div className="hu2-campos-dos">
                <label className="hu2-campo">
                  <span className="hu2-etiqueta">Categoría</span>
                  <select name="category" defaultValue={aviso.category} required>
                    <option value="">Selecciona</option>
                    {categorias.map((categoria) => (
                      <option key={categoria}>{categoria}</option>
                    ))}
                  </select>
                </label>
                <label className="hu2-campo">
                  <span className="hu2-etiqueta">Curso asociado</span>
                  <input name="course" defaultValue={aviso.course} required />
                </label>
              </div>
            </section>
            <section className="hu2-panel">
              <h2>2 · Condición</h2>
              <fieldset className="hu2-condiciones">
                <legend className="hu2-etiqueta">Estado del producto</legend>
                {condiciones.map((condicion) => (
                  <label
                    key={condicion}
                    className={aviso.condition === condicion ? 'hu2-condicion-activa' : ''}
                  >
                    <input
                      type="radio"
                      name="condition"
                      value={condicion}
                      defaultChecked={aviso.condition === condicion}
                    />
                    {condicion}
                  </label>
                ))}
              </fieldset>
              <p className="hu2-ayuda">Sé honesto al describir el estado del material.</p>
            </section>
          </div>
          <div className="hu2-columna">
            <section className="hu2-panel">
              <h2>3 · Precio</h2>
              <label className="hu2-campo">
                <span className="hu2-etiqueta">Precio pedido</span>
                <span className="hu2-monto">
                  <span>S/</span>
                  <input
                    name="price"
                    type="number"
                    min="0.01"
                    step="0.01"
                    defaultValue={aviso.price}
                    required
                  />
                </span>
              </label>
              <label className="hu2-interruptor">
                <input type="checkbox" name="acceptsOffers" defaultChecked={aviso.acceptsOffers} />
                <span>Acepto ofertas por un monto menor</span>
              </label>
              <label className="hu2-campo">
                <span className="hu2-etiqueta">Monto mínimo que aceptarás</span>
                <input
                  name="minimum"
                  type="number"
                  min="0.01"
                  max={aviso.price || undefined}
                  step="0.01"
                  defaultValue={aviso.minimum}
                  disabled={!aviso.acceptsOffers}
                  required={aviso.acceptsOffers}
                />
              </label>
            </section>
            <section className="hu2-panel">
              <h2>4 · Fotografías</h2>
              <GaleriaFotografias compacta cambiar={setFotos} fotos={fotos} />
            </section>
          </div>
          <aside className="hu2-columna hu2-lateral-formulario">
            <VistaPreviaAviso
              titulo={aviso.title}
              precio={aviso.price}
              condicion={aviso.condition}
              curso={aviso.course}
              foto={fotos[0]?.imagen}
            />
            <section className="hu2-panel hu2-consejo">
              <h2>Antes de publicar</h2>
              <p>Toma las fotos con luz natural y muestra el estado real de las hojas.</p>
            </section>
            <div className="hu2-panel hu2-guardar">
              <button className="hu2-boton" value="Publicado">
                Publicar
              </button>
              <button className="hu2-boton hu2-boton-secundario" value="Borrador" formNoValidate>
                Guardar borrador
              </button>
              <Enlace className="hu2-enlace" href="/mis-publicaciones">
                Cancelar
              </Enlace>
            </div>
          </aside>
        </div>
      </form>
    </Marco>
  );
}
