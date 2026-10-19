import { obtenerAviso, guardarAviso } from '../compartido/storage.js';
import { usuarioActivo, perfilPublico } from '../compartido/sesion.js';

const CLAVE = 'tablon_negociaciones_v2';

export function leerNegociaciones() {
  const contenido = localStorage.getItem(CLAVE);
  return contenido ? JSON.parse(contenido) : { ofertas: [], acuerdos: [] };
}

export function guardarNegociaciones(datos) {
  localStorage.setItem(CLAVE, JSON.stringify(datos));
  window.dispatchEvent(new Event('negociaciones-cambiaron'));
}

export function exigirUsuario() {
  const usuario = usuarioActivo();
  if (!usuario) throw new Error('Inicia sesión para continuar.');
  return usuario.correo;
}

export function esParticipante(registro, correo) {
  return registro.comprador === correo || registro.vendedor === correo;
}

export function exigirDisponible(aviso) {
  if (!aviso || aviso.status !== 'Publicado' || perfilPublico(aviso.owner)?.bloqueado) {
    throw new Error('Este aviso ya no está disponible para negociar.');
  }
}

function validarMonto(valor, aviso) {
  const monto = Number(valor);
  if (
    !Number.isFinite(monto) ||
    monto <= 0 ||
    Math.abs(monto * 100 - Math.round(monto * 100)) > 0.00001
  ) {
    throw new Error('Ingresa un monto positivo con un máximo de dos decimales.');
  }
  const minimo =
    aviso.acceptsOffers === false
      ? Number(aviso.price)
      : Number(aviso.minimum || aviso.price);
  if (monto < minimo || monto > Number(aviso.price)) {
    throw new Error(
      `El monto debe estar entre S/ ${aviso.minimum || aviso.price} y S/ ${aviso.price}.`,
    );
  }
  return monto;
}

function evento(autor, texto, monto) {
  return {
    id: crypto.randomUUID(),
    autor,
    texto,
    monto,
    fecha: new Date().toISOString(),
  };
}

export function enviarOferta(idAviso, valor, mensaje) {
  const correo = exigirUsuario();
  const aviso = obtenerAviso(idAviso);
  exigirDisponible(aviso);
  if (aviso.owner === correo) throw new Error('No puedes ofertar por tu propio aviso.');
  const monto = validarMonto(valor, aviso);
  const datos = leerNegociaciones();
  if (
    datos.ofertas.some(
      (oferta) =>
        oferta.avisoId === idAviso &&
        oferta.comprador === correo &&
        oferta.estado === 'Pendiente',
    )
  ) {
    throw new Error('Ya tienes una oferta activa para este aviso. Revísala en Ofertas.');
  }
  const oferta = {
    id: crypto.randomUUID(),
    avisoId: idAviso,
    titulo: aviso.title,
    comprador: correo,
    vendedor: aviso.owner,
    monto,
    estado: 'Pendiente',
    turno: aviso.owner,
    historial: [evento(correo, mensaje.trim() || 'Oferta enviada', monto)],
  };
  datos.ofertas.unshift(oferta);
  guardarNegociaciones(datos);
  return oferta.id;
}

export function responderOferta(id, accion, valor, mensaje = '') {
  const correo = exigirUsuario();
  const datos = leerNegociaciones();
  const oferta = datos.ofertas.find((item) => item.id === id);
  if (!oferta || !esParticipante(oferta, correo))
    throw new Error('No tienes acceso a esta oferta.');
  if (oferta.estado !== 'Pendiente') throw new Error('Esta negociación ya terminó.');
  if (accion === 'retirar') {
    if (correo !== oferta.comprador)
      throw new Error('Solo el comprador puede retirar su oferta.');
    oferta.estado = 'Retirada';
    oferta.historial.push(evento(correo, 'Oferta retirada'));
    guardarNegociaciones(datos);
    return;
  }
  if (oferta.turno !== correo) throw new Error('Espera la respuesta de la otra persona.');
  const aviso = obtenerAviso(oferta.avisoId);
  exigirDisponible(aviso);

  if (accion === 'contraofertar') {
    const monto = validarMonto(valor, aviso);
    if (monto === oferta.monto)
      throw new Error('La contraoferta debe proponer un monto distinto.');
    oferta.monto = monto;
    oferta.turno = correo === oferta.comprador ? oferta.vendedor : oferta.comprador;
    oferta.historial.push(
      evento(correo, mensaje.trim() || 'Contraoferta enviada', monto),
    );
  } else if (accion === 'rechazar') {
    oferta.estado = 'Rechazada';
    oferta.historial.push(evento(correo, 'Propuesta rechazada'));
  } else if (accion === 'aceptar') {
    validarMonto(oferta.monto, aviso);
    if (
      datos.acuerdos.some(
        (item) =>
          item.avisoId === aviso.id && !['Cancelado', 'Cerrado'].includes(item.estado),
      )
    ) {
      throw new Error('El aviso ya tiene un acuerdo activo.');
    }
    oferta.estado = 'Aceptada';
    oferta.historial.push(evento(correo, 'Propuesta aceptada', oferta.monto));
    datos.acuerdos.unshift({
      id: crypto.randomUUID(),
      ofertaId: oferta.id,
      avisoId: aviso.id,
      titulo: aviso.title,
      comprador: oferta.comprador,
      vendedor: oferta.vendedor,
      monto: oferta.monto,
      estado: 'Por coordinar',
      punto: '',
      fecha: '',
      propuestoPor: '',
      aprobaciones: [],
      confirmaciones: [],
      motivo: '',
    });
    datos.ofertas.forEach((otra) => {
      if (otra.avisoId === aviso.id && otra.id !== id && otra.estado === 'Pendiente') {
        otra.estado = 'Cerrada';
        otra.historial.push(
          evento(correo, 'El aviso fue reservado mediante otra oferta.'),
        );
      }
    });
    guardarAviso({ ...aviso, status: 'Reservado' });
  } else {
    throw new Error('Acción no válida.');
  }
  guardarNegociaciones(datos);
}
