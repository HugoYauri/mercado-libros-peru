import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  guardarAviso,
  obtenerAviso,
  guardarFotos,
  listarFotos,
} from '../../assets/js/compartido/storage.js';
import { usuarioActivo } from '../../assets/js/compartido/sesion.js';
import {
  categorias,
  condiciones,
  exigirPropietario,
  validarFotos,
  validarPublicacion,
} from '../../assets/js/hu2/publicaciones.js';
import Marco from '../compartido/Marco.jsx';
import GaleriaFotografias from './GaleriaFotografias.jsx';
import VistaPreviaAviso from './VistaPreviaAviso.jsx';
import '../../assets/css/publicaciones.css';

// Las reglas siguen en publicaciones.js. Esta relación solo ubica los mensajes en la pantalla.
const palabrasPorCampo = {
  title: ['título'],
  description: ['descripción'],
  category: ['categoría'],
  course: ['curso'],
  condition: ['estado del producto'],
  price: ['precio mayor', 'importes'],
  minimum: ['mínimo'],
  fotos: ['fotografía', 'JPG', 'portada'],
};

const estadosNoEditables = ['Reservado', 'Vendido', 'Retirado', 'Eliminado'];

function puedeEditarAviso(id, aviso, correo) {
  if (!id) return true;
  if (!aviso || aviso.owner !== correo) return false;
  return !estadosNoEditables.includes(aviso.status);
}

function leerDatosFormulario(formulario) {
  const valores = new FormData(formulario);
  return {
    title: valores.get('title') || '',
    description: valores.get('description') || '',
    category: valores.get('category') || '',
    course: valores.get('course') || '',
    condition: valores.get('condition') || '',
    price: valores.get('price') || '',
    acceptsOffers: valores.has('acceptsOffers'),
    minimum: valores.get('minimum') || '',
  };
}

function obtenerEstadoSeleccionado(event, soloFotos, aviso) {
  if (soloFotos) return aviso.status;
  const botonPresionado = event.nativeEvent.submitter;
  if (botonPresionado && botonPresionado.value) return botonPresionado.value;
  return 'Publicado';
}

export default function NuevoAviso({ soloFotos = false, panelFotografias }) {
  const [parametros] = useSearchParams();
  const id = parametros.get('id');
  const existente = id ? obtenerAviso(id) : null;
  const usuario = usuarioActivo();
  const [archivos, setArchivos] = useState([]);
  const [urls, setUrls] = useState([]);
  const [errores, setErrores] = useState([]);
  const [cargando, setCargando] = useState(Boolean(id));
  const [guardando, setGuardando] = useState(false);
  const [errorCarga, setErrorCarga] = useState(false);
  const [quitarPortada, setQuitarPortada] = useState(false);
  const [vista, setVista] = useState({
    title: existente?.title || '',
    price: existente?.price || '',
    course: existente?.course || '',
    condition: existente?.condition || condiciones[0],
    acceptsOffers: existente?.acceptsOffers !== false,
  });
  const propietario = !id || existente?.owner === usuario?.correo;
  const editable = puedeEditarAviso(id, existente, usuario?.correo);
  const imagen = !quitarPortada ? existente?.imagen || '' : '';
  const bloqueado = cargando || guardando || errorCarga;

  // Al editar, carga las fotos que ya estaban guardadas para este aviso.
  useEffect(() => {
    let vigente = true;
    if (id && propietario) {
      listarFotos(id)
        .then((fotos) => {
          if (vigente) setArchivos(fotos);
        })
        .catch(() => {
          if (vigente) {
            setErrorCarga(true);
            setErrores([
              'No se pudieron cargar las fotografías. Recarga antes de guardar.',
            ]);
          }
        })
        .finally(() => {
          if (vigente) setCargando(false);
        });
    } else setCargando(false);
    return () => {
      vigente = false;
    };
  }, [id, propietario]);

  // Crea direcciones temporales para mostrar las fotos y las libera al cambiar la lista.
  useEffect(() => {
    const nuevas = archivos.map((archivo) => URL.createObjectURL(archivo));
    setUrls(nuevas);
    return () => nuevas.forEach((url) => URL.revokeObjectURL(url));
  }, [archivos]);

  function errorCampo(campo) {
    const palabras = palabrasPorCampo[campo] || [];
    const errorEncontrado = errores.find((error) =>
      palabras.some((palabra) => error.includes(palabra)),
    );
    return errorEncontrado || '';
  }

  function actualizarVista(event) {
    const campo = event.target;
    if (!(campo.name in vista)) return;
    const valor = campo.type === 'checkbox' ? campo.checked : campo.value;
    setVista({ ...vista, [campo.name]: valor });
  }

  function agregar(nuevosArchivos) {
    if (bloqueado || nuevosArchivos.length === 0) return;
    const nuevos = [...archivos, ...nuevosArchivos];
    try {
      validarFotos(nuevos);
      if (nuevos.length + (imagen ? 1 : 0) > 6) {
        throw new Error('El máximo es 6 fotografías, incluida la portada de ejemplo.');
      }
      setArchivos(nuevos);
      setErrores([]);
    } catch (problema) {
      setErrores([problema.message]);
    }
  }

  function mover(origen, destino) {
    const ordenados = [...archivos];
    const archivo = ordenados.splice(origen, 1)[0];
    ordenados.splice(destino, 0, archivo);
    setArchivos(ordenados);
  }

  async function guardar(event) {
    event.preventDefault();
    if (!editable || bloqueado) return;
    // En la pantalla de fotos se conservan todos los datos del aviso existente.
    const datos = soloFotos
      ? { ...existente, acceptsOffers: existente.acceptsOffers !== false }
      : leerDatosFormulario(event.currentTarget);
    const estado = obtenerEstadoSeleccionado(event, soloFotos, existente);
    const cantidad = archivos.length + (imagen ? 1 : 0);
    const problemas = validarPublicacion(datos, estado, cantidad);
    if (problemas.length) {
      setErrores(problemas);
      return;
    }
    setGuardando(true);
    try {
      if (id) {
        const actual = exigirPropietario(id);
        if (['Reservado', 'Vendido', 'Retirado', 'Eliminado'].includes(actual.status)) {
          throw new Error('El aviso cambió de estado. Recarga la página.');
        }
      }
      const avisoId = id || crypto.randomUUID();
      validarFotos(archivos);
      await guardarFotos(avisoId, archivos);
      guardarAviso({
        ...existente,
        ...datos,
        id: avisoId,
        owner: usuarioActivo().correo,
        title: datos.title.trim(),
        description: datos.description.trim(),
        course: datos.course.trim(),
        price: Number(datos.price),
        minimum: datos.acceptsOffers ? Number(datos.minimum) : Number(datos.price),
        status: estado,
        imagen,
        published: existente?.published || new Date().toISOString(),
      });
      location.assign('/mis-publicaciones');
    } catch (problema) {
      setErrores([problema.message]);
      setGuardando(false);
    }
  }

  if (!editable || (soloFotos && !existente)) {
    return (
      <Marco
        publicaciones
        titulo="No puedes editar este aviso"
      >
        <p className="hu2-alerta hu2-alerta-error">
          La publicación no existe, pertenece a otra persona o su estado impide editarla.
        </p>
        <a
          className="hu2-enlace"
          href="/mis-publicaciones"
        >
          Volver a mis publicaciones
        </a>
      </Marco>
    );
  }

  const galeria = (
    <GaleriaFotografias
      urls={urls}
      imagen={imagen}
      cargando={cargando}
      deshabilitada={guardando || errorCarga}
      compacta={!soloFotos}
      error={errorCampo('fotos')}
      agregar={agregar}
      quitar={(indice) =>
        setArchivos(archivos.filter((_, posicion) => posicion !== indice))
      }
      quitarPortada={() => setQuitarPortada(true)}
      mover={mover}
    />
  );

  return (
    <Marco
      publicaciones
      titulo={soloFotos ? 'Fotografías del aviso' : id ? 'Editar aviso' : 'Nuevo aviso'}
      descripcion={
        soloFotos
          ? 'Máximo 6 imágenes, JPG o PNG de hasta 5 MB cada una. La primera será la portada.'
          : undefined
      }
      migas={
        <>
          <a href="/mis-publicaciones">Mis publicaciones</a>
          <span aria-hidden="true">›</span>
          {soloFotos ? (
            <>
              <a href={'/nuevo-aviso?id=' + id}>Editar aviso</a>
              <span aria-hidden="true">›</span>
              <span>Fotografías</span>
            </>
          ) : (
            <span>{id ? 'Editar aviso' : 'Nuevo aviso'}</span>
          )}
        </>
      }
    >
      <form
        onSubmit={guardar}
        onChange={actualizarVista}
        noValidate
      >
        {errores.length > 0 && (
          <div
            className="hu2-alerta hu2-alerta-error"
            role="alert"
          >
            <strong>
              {soloFotos
                ? 'No pudimos guardar las fotografías.'
                : 'No pudimos guardar el aviso.'}
            </strong>{' '}
            Revisa los siguientes datos.
            <ul>
              {errores.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        {soloFotos ? (
          <div className="hu2-fotos-distribucion">
            <section
              className="hu2-panel hu2-editor-fotos"
              aria-label="Administrar fotografías"
            >
              {galeria}
              <div className="hu2-fotos-acciones">
                <a
                  className="hu2-enlace"
                  href="/mis-publicaciones"
                >
                  Cancelar
                </a>
                <button
                  className="hu2-boton"
                  disabled={bloqueado}
                >
                  {guardando ? 'Guardando…' : 'Guardar fotografías'}
                </button>
              </div>
            </section>
            <aside className="hu2-columna">{panelFotografias}</aside>
          </div>
        ) : (
          <div className="hu2-formulario">
            <div className="hu2-columna">
              <section className="hu2-panel">
                <h2>1 · Producto</h2>
                <label className="hu2-campo">
                  <span className="hu2-etiqueta">Título del aviso</span>
                  <input
                    name="title"
                    defaultValue={existente?.title || ''}
                    maxLength={120}
                    aria-invalid={Boolean(errorCampo('title'))}
                    aria-describedby="hu2-titulo-ayuda"
                  />
                  <span
                    id="hu2-titulo-ayuda"
                    className={errorCampo('title') ? 'hu2-error-campo' : 'hu2-ayuda'}
                  >
                    {errorCampo('title') ||
                      `Incluye autor y edición: así lo buscan tus compañeros. ${vista.title.length}/120 caracteres.`}
                  </span>
                </label>
                <label className="hu2-campo">
                  <span className="hu2-etiqueta">Descripción</span>
                  <textarea
                    name="description"
                    rows={5}
                    maxLength={2000}
                    defaultValue={existente?.description || ''}
                    aria-invalid={Boolean(errorCampo('description'))}
                    aria-describedby={
                      errorCampo('description') ? 'hu2-descripcion-error' : undefined
                    }
                  />
                  {errorCampo('description') && (
                    <span
                      id="hu2-descripcion-error"
                      className="hu2-error-campo"
                    >
                      {errorCampo('description')}
                    </span>
                  )}
                </label>
                <div className="hu2-campos-dos">
                  <label className="hu2-campo">
                    <span className="hu2-etiqueta">Categoría</span>
                    <select
                      name="category"
                      defaultValue={existente?.category || ''}
                      aria-invalid={Boolean(errorCampo('category'))}
                      aria-describedby={
                        errorCampo('category') ? 'hu2-categoria-error' : undefined
                      }
                    >
                      <option value="">Selecciona</option>
                      {categorias.map((valor) => (
                        <option key={valor}>{valor}</option>
                      ))}
                    </select>
                    {errorCampo('category') && (
                      <span
                        id="hu2-categoria-error"
                        className="hu2-error-campo"
                      >
                        {errorCampo('category')}
                      </span>
                    )}
                  </label>
                  <label className="hu2-campo">
                    <span className="hu2-etiqueta">Curso asociado</span>
                    <input
                      name="course"
                      maxLength={80}
                      defaultValue={existente?.course || ''}
                      aria-invalid={Boolean(errorCampo('course'))}
                      aria-describedby={
                        errorCampo('course') ? 'hu2-curso-error' : undefined
                      }
                    />
                    {errorCampo('course') && (
                      <span
                        id="hu2-curso-error"
                        className="hu2-error-campo"
                      >
                        {errorCampo('course')}
                      </span>
                    )}
                  </label>
                </div>
              </section>
              <section className="hu2-panel">
                <h2>2 · Condición</h2>
                <fieldset className="hu2-condiciones">
                  <legend className="hu2-etiqueta">Estado del producto</legend>
                  <div>
                    {condiciones.map((valor) => (
                      <label key={valor}>
                        <input
                          type="radio"
                          name="condition"
                          value={valor}
                          defaultChecked={vista.condition === valor}
                        />
                        <span>{valor}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <p className="hu2-ayuda">
                  Sé honesto: la calificación después del acuerdo depende de esto.
                </p>
              </section>
            </div>
            <div className="hu2-columna">
              <section className="hu2-panel">
                <h2>3 · Precio</h2>
                <label className="hu2-campo">
                  <span className="hu2-etiqueta">Precio pedido</span>
                  <span className="hu2-monto">
                    <span aria-hidden="true">S/</span>
                    <input
                      name="price"
                      aria-label="Precio pedido en soles"
                      type="number"
                      min="0.01"
                      step="0.01"
                      defaultValue={existente?.price || ''}
                      aria-invalid={Boolean(errorCampo('price'))}
                      aria-describedby={
                        errorCampo('price') ? 'hu2-precio-error' : undefined
                      }
                    />
                  </span>
                  {errorCampo('price') && (
                    <span
                      id="hu2-precio-error"
                      className="hu2-error-campo"
                    >
                      {errorCampo('price')}
                    </span>
                  )}
                </label>
                <label className="hu2-interruptor">
                  <input
                    type="checkbox"
                    name="acceptsOffers"
                    defaultChecked={existente?.acceptsOffers !== false}
                  />
                  <span aria-hidden="true" />
                  Acepto ofertas por un monto menor
                </label>
                <label className="hu2-campo hu2-minimo">
                  <span className="hu2-etiqueta">Monto mínimo que aceptarás</span>
                  <span className="hu2-monto">
                    <span aria-hidden="true">S/</span>
                    <input
                      name="minimum"
                      aria-label="Monto mínimo en soles"
                      type="number"
                      min="0.01"
                      step="0.01"
                      defaultValue={existente?.minimum || ''}
                      aria-invalid={Boolean(errorCampo('minimum'))}
                      aria-describedby={
                        errorCampo('minimum') ? 'hu2-minimo-error' : undefined
                      }
                    />
                  </span>
                  {errorCampo('minimum') && (
                    <span
                      id="hu2-minimo-error"
                      className="hu2-error-campo"
                    >
                      {errorCampo('minimum')}
                    </span>
                  )}
                </label>
                {!vista.acceptsOffers && (
                  <p className="hu2-ayuda">
                    El comprador podrá ofrecer el precio publicado.
                  </p>
                )}
              </section>
              <section
                className={
                  'hu2-panel hu2-panel-fotos' +
                  (errorCampo('fotos') ? ' hu2-panel-error' : '')
                }
              >
                <h2>4 · Fotografías</h2>
                {galeria}
              </section>
            </div>
            <aside className="hu2-columna hu2-lateral-formulario">
              {errores.length > 0 && (
                <section className="hu2-panel hu2-resumen-errores">
                  <h2 className="hu2-etiqueta">Datos por corregir</h2>
                  <ul>
                    {errores.map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                  </ul>
                </section>
              )}
              <VistaPreviaAviso
                titulo={vista.title}
                precio={vista.price}
                condicion={vista.condition}
                curso={vista.course}
                foto={urls[0] || imagen}
              />
              {errores.length === 0 && (
                <section className="hu2-panel hu2-consejo">
                  <h2>Antes de publicar</h2>
                  <p>
                    Toma las fotos con luz natural, muestra la portada y el estado real de
                    las hojas.
                  </p>
                </section>
              )}
              <div className="hu2-panel hu2-guardar">
                <button
                  className="hu2-boton"
                  value="Publicado"
                  disabled={bloqueado}
                >
                  {guardando ? 'Guardando…' : 'Publicar'}
                </button>
                <button
                  className="hu2-boton hu2-boton-secundario"
                  value="Borrador"
                  disabled={bloqueado}
                >
                  Guardar borrador
                </button>
                <a
                  className="hu2-enlace"
                  href="/mis-publicaciones"
                >
                  Cancelar
                </a>
              </div>
            </aside>
          </div>
        )}
      </form>
    </Marco>
  );
}
