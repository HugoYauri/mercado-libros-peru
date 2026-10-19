import {
  usuarioActivo,
  usuarios,
  guardarUsuarios,
  perfilPublico,
} from '../compartido/sesion.js';
import { avisos, obtenerAviso, guardarAviso } from '../compartido/storage.js';
import { leerNegociaciones, guardarNegociaciones } from '../hu4/ofertas.js';

export function exigirAdministrador() {
  if (usuarioActivo()?.rol !== 'administrador')
    throw new Error('Solo el administrador puede realizar esta acción.');
}

export function reportes() {
  return JSON.parse(localStorage.getItem('tablon_reportes_v3') || '[]');
}

export function reportar(tipo, objetivo, motivo, detalle) {
  const usuario = usuarioActivo();
  if (!usuario) throw new Error('Inicia sesión para reportar.');
  if (!['Aviso', 'Usuario'].includes(tipo)) throw new Error('Tipo de reporte no válido.');
  const propietario =
    tipo === 'Aviso' ? obtenerAviso(objetivo)?.owner : perfilPublico(objetivo)?.correo;
  if (!propietario) throw new Error('No se encontró el aviso o usuario.');
  if (propietario === usuario.correo)
    throw new Error('No puedes reportarte ni reportar tu propio aviso.');
  if (!motivo || detalle.trim().length < 10 || detalle.length > 500)
    throw new Error('Selecciona un motivo y escribe entre 10 y 500 caracteres.');
  const lista = reportes();
  if (
    lista.some(
      (item) =>
        item.autor === usuario.correo &&
        item.objetivo === objetivo &&
        item.tipo === tipo &&
        item.estado === 'Pendiente',
    )
  )
    throw new Error('Ya tienes un reporte pendiente para este elemento.');
  lista.unshift({
    id: crypto.randomUUID(),
    autor: usuario.correo,
    tipo,
    objetivo,
    motivo,
    detalle: detalle.trim(),
    estado: 'Pendiente',
    fecha: new Date().toISOString(),
    resolucion: '',
  });
  localStorage.setItem('tablon_reportes_v3', JSON.stringify(lista));
}

function cerrarNegociaciones(filtro) {
  const datos = leerNegociaciones();
  datos.ofertas.forEach((oferta) => {
    if (filtro(oferta) && oferta.estado === 'Pendiente') oferta.estado = 'Cerrada';
  });
  datos.acuerdos.forEach((acuerdo) => {
    if (filtro(acuerdo) && !['Cancelado', 'Cerrado'].includes(acuerdo.estado)) {
      acuerdo.estado = 'Cancelado';
      acuerdo.motivo =
        'Cancelado por moderación. Contacta a la administración si hay una entrega en curso.';
      const aviso = obtenerAviso(acuerdo.avisoId);
      if (aviso?.status === 'Reservado') guardarAviso({ ...aviso, status: 'Publicado' });
    }
  });
  guardarNegociaciones(datos);
}

export function retirarAviso(id, motivo) {
  exigirAdministrador();
  if (!motivo || motivo.trim().length < 10)
    throw new Error('Explica el motivo de la moderación (mínimo 10 caracteres).');
  const aviso = obtenerAviso(id);
  if (!aviso) throw new Error('El aviso no existe.');
  cerrarNegociaciones((registro) => registro.avisoId === id);
  guardarAviso({ ...aviso, status: 'Retirado', motivoModeracion: motivo.trim() });
}

export function bloquearUsuario(correo, bloqueado, motivo) {
  exigirAdministrador();
  if (!motivo || motivo.trim().length < 10)
    throw new Error('Explica el motivo de la moderación (mínimo 10 caracteres).');
  const lista = usuarios();
  const usuario = lista.find((item) => item.correo === correo);
  if (!usuario || usuario.rol === 'administrador')
    throw new Error('No se puede modificar esta cuenta.');
  usuario.bloqueado = bloqueado;
  usuario.motivoModeracion = motivo.trim();
  guardarUsuarios(lista);
  if (bloqueado) {
    cerrarNegociaciones(
      (registro) => registro.comprador === correo || registro.vendedor === correo,
    );
    avisos()
      .filter(
        (aviso) =>
          aviso.owner === correo && ['Publicado', 'Reservado'].includes(aviso.status),
      )
      .forEach((aviso) => guardarAviso({ ...aviso, status: 'Pausado' }));
  }
}

export function resolverReporte(id, accion, resolucion) {
  exigirAdministrador();
  if (resolucion.trim().length < 10)
    throw new Error('Escribe una resolución de al menos 10 caracteres.');
  const lista = reportes();
  const reporte = lista.find((item) => item.id === id);
  if (!reporte || reporte.estado !== 'Pendiente')
    throw new Error('El reporte ya fue atendido o no existe.');
  if (accion === 'retirar') {
    if (reporte.tipo !== 'Aviso')
      throw new Error('Este reporte no corresponde a un aviso.');
    retirarAviso(reporte.objetivo, resolucion);
  } else if (accion === 'bloquear') {
    const correo =
      reporte.tipo === 'Usuario'
        ? reporte.objetivo
        : obtenerAviso(reporte.objetivo)?.owner;
    bloquearUsuario(correo, true, resolucion);
  } else if (accion !== 'descartar') throw new Error('Acción no válida.');
  reporte.estado = accion === 'descartar' ? 'Descartado' : 'Atendido';
  reporte.resolucion = resolucion.trim();
  reporte.accion = accion;
  reporte.resueltoPor = usuarioActivo().correo;
  reporte.resueltoEn = new Date().toISOString();
  localStorage.setItem('tablon_reportes_v3', JSON.stringify(lista));
}
