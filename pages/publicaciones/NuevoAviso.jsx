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

export default function NuevoAviso({ soloFotos = false }) {
  const [parametros] = useSearchParams();
  const id = parametros.get('id');
  const existente = id ? obtenerAviso(id) : null;
  const [archivos, setArchivos] = useState([]);
  const [urls, setUrls] = useState([]);
  const [errores, setErrores] = useState([]);
  const [cargando, setCargando] = useState(Boolean(id));
  const [guardando, setGuardando] = useState(false);
  const [errorCarga, setErrorCarga] = useState(false);
  const [quitarPortada, setQuitarPortada] = useState(false);
  const propietario = !id || existente?.owner === usuarioActivo()?.correo;
  const editable =
    propietario &&
    (!id ||
      (existente &&
        !['Reservado', 'Vendido', 'Retirado', 'Eliminado'].includes(existente.status)));

  useEffect(() => {
    let vigente = true;
    if (id && propietario)
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
    else setCargando(false);
    return () => {
      vigente = false;
    };
  }, [id, propietario]);

  useEffect(() => {
    const nuevas = archivos.map((archivo) => URL.createObjectURL(archivo));
    setUrls(nuevas);
    return () => nuevas.forEach((url) => URL.revokeObjectURL(url));
  }, [archivos]);

  function agregar(event) {
    const nuevos = [...archivos, ...Array.from(event.target.files || [])];
    try {
      validarFotos(nuevos);
      if (nuevos.length + (existente?.imagen && !quitarPortada ? 1 : 0) > 6)
        throw new Error('El máximo es 6 fotografías, incluida la portada de ejemplo.');
      setArchivos(nuevos);
      setErrores([]);
    } catch (problema) {
      setErrores([problema.message]);
    }
    event.target.value = '';
  }

  function mover(indice) {
    const ordenados = [...archivos];
    [ordenados[indice - 1], ordenados[indice]] = [
      ordenados[indice],
      ordenados[indice - 1],
    ];
    setArchivos(ordenados);
  }

  async function guardar(event) {
    event.preventDefault();
    if (!editable || guardando || cargando || errorCarga) return;
    const datos = Object.fromEntries(new FormData(event.currentTarget));
    datos.acceptsOffers = datos.acceptsOffers === 'on';
    const estado = soloFotos
      ? existente.status
      : event.nativeEvent.submitter?.value || 'Publicado';
    const cantidad = archivos.length + (existente?.imagen && !quitarPortada ? 1 : 0);
    const problemas = validarPublicacion(datos, estado, cantidad);
    if (problemas.length) {
      setErrores(problemas);
      return;
    }
    setGuardando(true);
    try {
      if (id) {
        const actual = exigirPropietario(id);
        if (['Reservado', 'Vendido', 'Retirado', 'Eliminado'].includes(actual.status))
          throw new Error('El aviso cambió de estado. Recarga la página.');
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
        imagen: quitarPortada ? '' : existente?.imagen || '',
        published: existente?.published || new Date().toISOString(),
      });
      location.assign('/mis-publicaciones');
    } catch (problema) {
      setErrores([problema.message]);
      setGuardando(false);
    }
  }

  if (!editable || (soloFotos && !existente))
    return (
      <Marco titulo="No puedes editar este aviso">
        <p className="neg-error">
          La publicación no existe, pertenece a otra persona o su estado impide editarla.
        </p>
        <a href="/mis-publicaciones">Volver</a>
      </Marco>
    );
  return (
    <Marco
      titulo={soloFotos ? 'Fotografías del aviso' : id ? 'Editar aviso' : 'Nuevo aviso'}
      descripcion="Completa la información y revisa las fotografías antes de publicar."
    >
      <form
        onSubmit={guardar}
        noValidate
        className="neg-tarjeta"
      >
        {errores.length > 0 && (
          <div
            className="neg-error"
            role="alert"
          >
            <h2>Revisa los siguientes campos</h2>
            <ul>
              {errores.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        <div className={soloFotos ? 'hidden' : 'rejilla-dos'}>
          <div>
            <label>
              Título
              <input
                name="title"
                defaultValue={existente?.title || ''}
                maxLength={120}
              />
            </label>
            <label>
              Descripción
              <textarea
                name="description"
                rows={5}
                maxLength={2000}
                defaultValue={existente?.description || ''}
              />
            </label>
            <label>
              Categoría
              <select
                name="category"
                defaultValue={existente?.category || ''}
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map((valor) => (
                  <option key={valor}>{valor}</option>
                ))}
              </select>
            </label>
            <label>
              Curso asociado
              <input
                name="course"
                defaultValue={existente?.course || ''}
                maxLength={80}
              />
            </label>
          </div>
          <div>
            <label>
              Estado del producto
              <select
                name="condition"
                defaultValue={existente?.condition || condiciones[0]}
              >
                {condiciones.map((valor) => (
                  <option key={valor}>{valor}</option>
                ))}
              </select>
            </label>
            <label>
              Precio en soles
              <input
                name="price"
                type="number"
                min="0.01"
                step="0.01"
                defaultValue={existente?.price || ''}
              />
            </label>
            <label className="casilla">
              <input
                type="checkbox"
                name="acceptsOffers"
                defaultChecked={existente?.acceptsOffers !== false}
              />{' '}
              Acepto ofertas por debajo del precio
            </label>
            <label>
              Monto mínimo de oferta
              <input
                name="minimum"
                type="number"
                min="0.01"
                step="0.01"
                defaultValue={existente?.minimum || ''}
              />
            </label>
            <p className="neg-ayuda">
              Si no aceptas rebajas, el comprador podrá ofrecer el precio publicado.
            </p>
          </div>
        </div>
        <section id="fotografias">
          <h2>Carga de fotografías</h2>
          <p className="neg-ayuda">
            Hasta 6 archivos JPG o PNG de 5 MB cada uno. La primera fotografía será la
            portada.
          </p>
          <label>
            Seleccionar fotografías
            <input
              type="file"
              accept="image/jpeg,image/png"
              multiple
              onChange={agregar}
              disabled={cargando || guardando}
            />
          </label>
          {cargando && <p role="status">Cargando fotografías…</p>}
          {existente?.imagen && !quitarPortada && (
            <div className="neg-tarjeta">
              <img
                src={existente.imagen}
                alt="Portada de ejemplo"
                width="100"
              />
              <button
                type="button"
                onClick={() => setQuitarPortada(true)}
              >
                Quitar portada de ejemplo
              </button>
            </div>
          )}
          <div className="galeria-fotos">
            {urls.map((url, indice) => (
              <figure key={url}>
                <img
                  src={url}
                  alt={'Fotografía ' + (indice + 1)}
                />
                <figcaption>
                  {indice === 0 ? 'Portada' : 'Fotografía ' + (indice + 1)}
                </figcaption>
                <div className="neg-acciones">
                  {indice > 0 && (
                    <button
                      type="button"
                      onClick={() => mover(indice)}
                    >
                      Mover antes
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setArchivos(archivos.filter((_, i) => i !== indice))}
                  >
                    Quitar
                  </button>
                </div>
              </figure>
            ))}
          </div>
        </section>
        <div className="neg-acciones">
          <button
            className="neg-boton"
            value="Publicado"
            disabled={cargando || guardando}
          >
            {guardando ? 'Guardando…' : soloFotos ? 'Guardar fotografías' : 'Publicar'}
          </button>
          {!soloFotos && (
            <button
              className="neg-secundario"
              value="Borrador"
              disabled={cargando || guardando}
            >
              Guardar borrador
            </button>
          )}
          <a href="/mis-publicaciones">Cancelar</a>
        </div>
      </form>
    </Marco>
  );
}
