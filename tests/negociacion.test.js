import test from 'node:test';
import assert from 'node:assert/strict';

function memoria() {
  const datos = new Map();
  return {
    getItem: (clave) => datos.get(clave) ?? null,
    setItem: (clave, valor) => datos.set(clave, String(valor)),
    removeItem: (clave) => datos.delete(clave),
    clear: () => datos.clear(),
  };
}

globalThis.localStorage = memoria();
globalThis.sessionStorage = memoria();
globalThis.window = { dispatchEvent() {} };

const {
  iniciarSesion: acceder,
  cerrarSesion,
  registrarUsuario,
} = await import('../assets/js/compartido/sesion.js');
for (const correo of ['prueba.comprador@aloe.ulima.edu.pe', 'otro@aloe.ulima.edu.pe']) {
  registrarUsuario({
    correo,
    clave: 'Prueba2026!',
    nombres: 'Prueba',
    apellidos: 'Estudiante',
    carrera: 'Administración',
    ciclo: '4',
  });
}
function iniciarSesion(correo) {
  acceder(
    correo,
    correo === 'rosa.quispe@aloe.ulima.edu.pe' ? 'Rosa2026!' : 'Prueba2026!',
  );
}
const { obtenerAviso } = await import('../assets/js/compartido/storage.js');
const { enviarOferta, responderOferta, leerNegociaciones } =
  await import('../assets/js/hu4/ofertas.js');
const { actualizarAcuerdo, puntosCampus } = await import('../assets/js/hu5/acuerdos.js');

test('negociación, reserva y entrega con confirmación de ambas partes', () => {
  assert.throws(() => enviarOferta('av-1', 80, ''), /Inicia sesión/);
  iniciarSesion('rosa.quispe@aloe.ulima.edu.pe');
  assert.throws(() => enviarOferta('av-1', 80, ''), /propio aviso/);
  iniciarSesion('prueba.comprador@aloe.ulima.edu.pe');
  for (const monto of [0, -1, NaN, 69, 96, 80.123]) {
    assert.throws(() => enviarOferta('av-1', monto, ''));
  }
  assert.throws(() => enviarOferta('av-5', 100, ''), /disponible/);
  const id = enviarOferta('av-1', 80, 'Puedo recogerlo en el campus.');
  assert.throws(() => enviarOferta('av-1', 85, ''), /activa/);
  assert.throws(() => responderOferta(id, 'aceptar'), /Espera/);
  iniciarSesion('otro@aloe.ulima.edu.pe');
  assert.throws(() => responderOferta(id, 'aceptar'), /acceso/);
  const competidora = enviarOferta('av-1', 82, '');
  iniciarSesion('rosa.quispe@aloe.ulima.edu.pe');
  assert.throws(() => responderOferta(id, 'contraofertar', 80), /distinto/);
  responderOferta(id, 'contraofertar', 90);
  iniciarSesion('prueba.comprador@aloe.ulima.edu.pe');
  responderOferta(id, 'aceptar');
  let datos = leerNegociaciones();
  assert.equal(datos.ofertas.find((item) => item.id === competidora).estado, 'Cerrada');
  assert.equal(obtenerAviso('av-1').status, 'Reservado');
  assert.equal(datos.acuerdos.length, 1);
  const acuerdoId = datos.acuerdos[0].id;
  assert.throws(() => responderOferta(id, 'aceptar'), /terminó/);
  assert.throws(() => actualizarAcuerdo(acuerdoId, 'entregar'), /Ambas partes/);
  assert.throws(
    () =>
      actualizarAcuerdo(acuerdoId, 'coordinar', {
        punto: puntosCampus[0],
        fecha: '2000-01-01',
      }),
    /futuras/,
  );
  const fecha = new Date(Date.now() + 86400000).toISOString();
  assert.throws(
    () => actualizarAcuerdo(acuerdoId, 'coordinar', { punto: 'Fuera del campus', fecha }),
    /campus/,
  );
  actualizarAcuerdo(acuerdoId, 'coordinar', { punto: puntosCampus[0], fecha });
  assert.throws(() => actualizarAcuerdo(acuerdoId, 'aprobar'), /Ya aprobaste/);
  iniciarSesion('otro@aloe.ulima.edu.pe');
  assert.throws(() => actualizarAcuerdo(acuerdoId, 'aprobar'), /acceso/);
  iniciarSesion('rosa.quispe@aloe.ulima.edu.pe');
  actualizarAcuerdo(acuerdoId, 'aprobar');
  actualizarAcuerdo(acuerdoId, 'entregar');
  assert.equal(obtenerAviso('av-1').status, 'Reservado');
  assert.throws(() => actualizarAcuerdo(acuerdoId, 'entregar'), /Ya confirmaste/);
  assert.throws(
    () =>
      actualizarAcuerdo(acuerdoId, 'cancelar', { motivo: 'No puedo asistir al campus.' }),
    /No puedes cancelar/,
  );
  iniciarSesion('prueba.comprador@aloe.ulima.edu.pe');
  actualizarAcuerdo(acuerdoId, 'entregar');
  assert.equal(obtenerAviso('av-1').status, 'Vendido');
  assert.equal(leerNegociaciones().acuerdos[0].estado, 'Cerrado');
  assert.throws(
    () => actualizarAcuerdo(acuerdoId, 'coordinar', { punto: puntosCampus[0], fecha }),
    /terminó/,
  );
});

test('cancelar libera el aviso; retirar y rechazar cierran las ofertas', () => {
  iniciarSesion('prueba.comprador@aloe.ulima.edu.pe');
  const id = enviarOferta('av-2', 100, '');
  iniciarSesion('rosa.quispe@aloe.ulima.edu.pe');
  responderOferta(id, 'aceptar');
  const acuerdo = leerNegociaciones().acuerdos.find((item) => item.ofertaId === id);
  assert.throws(
    () => actualizarAcuerdo(acuerdo.id, 'cancelar', { motivo: 'No' }),
    /10 y 300/,
  );
  actualizarAcuerdo(acuerdo.id, 'cancelar', {
    motivo: 'No podemos coincidir esta semana.',
  });
  assert.equal(obtenerAviso('av-2').status, 'Publicado');
  iniciarSesion('prueba.comprador@aloe.ulima.edu.pe');
  const retirada = enviarOferta('av-2', 100, '');
  responderOferta(retirada, 'retirar');
  assert.equal(
    leerNegociaciones().ofertas.find((item) => item.id === retirada).estado,
    'Retirada',
  );
  const rechazada = enviarOferta('av-2', 100, '');
  iniciarSesion('rosa.quispe@aloe.ulima.edu.pe');
  responderOferta(rechazada, 'rechazar');
  assert.equal(
    leerNegociaciones().ofertas.find((item) => item.id === rechazada).estado,
    'Rechazada',
  );
  cerrarSesion();
});
