import { usuarioActivo } from '../compartido/sesion.js';
import { leerNegociaciones, esParticipante } from '../hu4/ofertas.js';

export function calificaciones() {
  return JSON.parse(localStorage.getItem('tablon_calificaciones_v3') || '[]');
}

export function calificar(acuerdoId, puntaje, comentario) {
  const usuario = usuarioActivo();
  if (!usuario) throw new Error('Inicia sesión para calificar.');
  const acuerdo = leerNegociaciones().acuerdos.find((item) => item.id === acuerdoId);
  if (
    !acuerdo ||
    acuerdo.estado !== 'Cerrado' ||
    !esParticipante(acuerdo, usuario.correo)
  ) {
    throw new Error('Solo puedes calificar a la contraparte de un acuerdo cerrado.');
  }
  const valor = Number(puntaje);
  if (!Number.isInteger(valor) || valor < 1 || valor > 5)
    throw new Error('Selecciona entre 1 y 5 estrellas.');
  if (comentario.trim().length > 300)
    throw new Error('El comentario admite hasta 300 caracteres.');
  const lista = calificaciones();
  if (lista.some((item) => item.acuerdoId === acuerdoId && item.autor === usuario.correo))
    throw new Error('Ya calificaste este acuerdo.');
  lista.unshift({
    id: crypto.randomUUID(),
    acuerdoId,
    autor: usuario.correo,
    destinatario:
      acuerdo.comprador === usuario.correo ? acuerdo.vendedor : acuerdo.comprador,
    puntaje: valor,
    comentario: comentario.trim(),
    fecha: new Date().toISOString(),
  });
  localStorage.setItem('tablon_calificaciones_v3', JSON.stringify(lista));
}

export function reputacion(correo) {
  const recibidas = calificaciones().filter((item) => item.destinatario === correo);
  const promedio = recibidas.length
    ? recibidas.reduce((total, item) => total + item.puntaje, 0) / recibidas.length
    : 0;
  return { recibidas, promedio };
}
