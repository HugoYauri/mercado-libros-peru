import { usuarioActivo } from '../compartido/sesion.js';
import { obtenerAviso, guardarAviso } from '../compartido/storage.js';
import { leerNegociaciones, guardarNegociaciones } from '../hu4/ofertas.js';

export const categorias = [
  'Libros de texto',
  'Calculadoras',
  'Instrumentos de dibujo',
  'Apuntes y guías',
  'Laptops y accesorios',
  'Uniformes y mandiles',
  'Material de laboratorio',
];
export const condiciones = [
  'Como nuevo',
  'Muy buen estado',
  'Buen estado',
  'Con marcas de uso',
];

export function exigirPropietario(id) {
  const usuario = usuarioActivo();
  const aviso = obtenerAviso(id);
  if (!usuario || !aviso || aviso.owner !== usuario.correo)
    throw new Error('No puedes modificar esta publicación.');
  return aviso;
}

export function validarFotos(archivos) {
  if (archivos.length > 6) throw new Error('Puedes cargar hasta 6 fotografías.');
  if (
    archivos.some(
      (archivo) =>
        !['image/jpeg', 'image/png'].includes(archivo.type) ||
        archivo.size > 5 * 1024 * 1024,
    )
  )
    throw new Error('Usa fotografías JPG o PNG de hasta 5 MB cada una.');
}

export function validarPublicacion(datos, estado, cantidadFotos) {
  const errores = [];
  if (datos.title.trim().length < (estado === 'Borrador' ? 3 : 15))
    errores.push(
      'El título requiere al menos ' + (estado === 'Borrador' ? 3 : 15) + ' caracteres.',
    );
  if (estado === 'Publicado' && datos.description.trim().length < 20)
    errores.push('La descripción requiere al menos 20 caracteres.');
  if (!categorias.includes(datos.category)) errores.push('Selecciona una categoría.');
  if (!condiciones.includes(datos.condition))
    errores.push('Selecciona el estado del producto.');
  if (!datos.course.trim()) errores.push('Indica el curso asociado.');
  const precio = Number(datos.price);
  const minimo = datos.acceptsOffers ? Number(datos.minimum) : precio;
  if (!Number.isFinite(precio) || precio <= 0)
    errores.push('Ingresa un precio mayor que cero.');
  if (!Number.isFinite(minimo) || minimo <= 0 || minimo > precio)
    errores.push('El mínimo debe ser positivo y no superar el precio.');
  if (estado === 'Publicado' && cantidadFotos < 1)
    errores.push('Agrega al menos una fotografía para publicar.');
  if (cantidadFotos > 6) errores.push('Puedes guardar hasta 6 fotografías.');
  if (
    [precio, minimo].some(
      (valor) => Math.abs(valor * 100 - Math.round(valor * 100)) > 0.00001,
    )
  )
    errores.push('Los importes admiten hasta dos decimales.');
  return errores;
}

export function cambiarEstadoPublicacion(id, estado) {
  const aviso = exigirPropietario(id);
  if (['Reservado', 'Vendido', 'Retirado', 'Eliminado'].includes(aviso.status))
    throw new Error('El estado actual no permite esta acción.');
  if (!['Publicado', 'Pausado', 'Eliminado'].includes(estado))
    throw new Error('Estado no válido.');
  if (estado === 'Publicado' && aviso.status === 'Borrador')
    throw new Error('Abre Editar para completar y publicar el borrador.');
  guardarAviso({ ...aviso, status: estado });
  if (estado !== 'Publicado') {
    const datos = leerNegociaciones();
    datos.ofertas.forEach((oferta) => {
      if (oferta.avisoId === id && oferta.estado === 'Pendiente')
        oferta.estado = 'Cerrada';
    });
    guardarNegociaciones(datos);
  }
}
