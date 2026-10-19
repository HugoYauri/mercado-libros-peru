import { obtenerAviso, guardarAviso } from '../compartido/storage.js';
import {
  leerNegociaciones,
  guardarNegociaciones,
  exigirUsuario,
  esParticipante,
} from '../hu4/ofertas.js';

export const puntosCampus = [
  'Biblioteca, ingreso principal',
  'Pabellón W, primer piso',
  'Cafetería central',
  'Ingreso principal del campus',
];

export function actualizarAcuerdo(id, accion, campos = {}) {
  const correo = exigirUsuario();
  const datos = leerNegociaciones();
  const acuerdo = datos.acuerdos.find((item) => item.id === id);
  if (!acuerdo || !esParticipante(acuerdo, correo))
    throw new Error('No tienes acceso a este acuerdo.');
  if (['Cancelado', 'Cerrado'].includes(acuerdo.estado))
    throw new Error('El acuerdo ya terminó.');

  if (accion === 'coordinar') {
    if (acuerdo.confirmaciones.length)
      throw new Error('La entrega ya comenzó; no puedes cambiar el horario.');
    if (!puntosCampus.includes(campos.punto))
      throw new Error('Selecciona un punto dentro del campus.');
    const fecha = new Date(campos.fecha);
    if (!Number.isFinite(fecha.getTime()) || fecha.getTime() <= Date.now()) {
      throw new Error('Elige una fecha y hora futuras.');
    }
    acuerdo.punto = campos.punto;
    acuerdo.fecha = fecha.toISOString();
    acuerdo.propuestoPor = correo;
    acuerdo.aprobaciones = [correo];
    acuerdo.estado = 'Por confirmar horario';
  } else if (accion === 'aprobar') {
    if (!acuerdo.fecha || new Date(acuerdo.fecha).getTime() <= Date.now())
      throw new Error('Primero coordinen un horario futuro.');
    if (acuerdo.aprobaciones.includes(correo))
      throw new Error('Ya aprobaste este horario. Falta la otra persona.');
    acuerdo.aprobaciones.push(correo);
    acuerdo.estado = 'Coordinado';
  } else if (accion === 'entregar') {
    if (acuerdo.aprobaciones.length !== 2)
      throw new Error('Ambas partes deben aprobar el punto y horario.');
    if (acuerdo.confirmaciones.includes(correo))
      throw new Error('Ya confirmaste tu parte de la entrega.');
    acuerdo.confirmaciones.push(correo);
    acuerdo.estado = acuerdo.confirmaciones.length === 2 ? 'Cerrado' : 'Entrega parcial';
    if (acuerdo.estado === 'Cerrado') {
      const aviso = obtenerAviso(acuerdo.avisoId);
      if (aviso) guardarAviso({ ...aviso, status: 'Vendido' });
    }
  } else if (accion === 'cancelar') {
    if (acuerdo.confirmaciones.length)
      throw new Error(
        'No puedes cancelar una entrega que una de las partes ya confirmó.',
      );
    const motivo = (campos.motivo || '').trim();
    if (motivo.length < 10 || motivo.length > 300)
      throw new Error('Escribe un motivo de entre 10 y 300 caracteres.');
    acuerdo.motivo = motivo;
    acuerdo.estado = 'Cancelado';
    const aviso = obtenerAviso(acuerdo.avisoId);
    if (aviso?.status === 'Reservado') guardarAviso({ ...aviso, status: 'Publicado' });
  } else {
    throw new Error('Acción no válida.');
  }
  guardarNegociaciones(datos);
}
