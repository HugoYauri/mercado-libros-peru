import test, { beforeEach } from 'node:test';
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

const cuenta = await import('../assets/js/compartido/sesion.js');
const almacen = await import('../assets/js/compartido/storage.js');
const { prepararDemostracion } = await import('../datos/demostracion.js');
const { calificar, reputacion } = await import('../assets/js/hu6/reputacion.js');
const moderacion = await import('../assets/js/hu7/moderacion.js');
const publicaciones = await import('../assets/js/hu2/publicaciones.js');
const { leerNegociaciones } = await import('../assets/js/hu4/ofertas.js');
const rosa = 'rosa.quispe@aloe.ulima.edu.pe';
const diego = 'diego.salazar@aloe.ulima.edu.pe';
const admin = 'admin@aloe.ulima.edu.pe';

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  prepararDemostracion();
});

test('las credenciales son propias y el perfil público no expone la clave', () => {
  assert.throws(() => cuenta.iniciarSesion(rosa, 'Incorrecta123!'));
  cuenta.iniciarSesion(rosa, 'Rosa2026!');
  assert.equal(cuenta.usuarioActivo().correo, rosa);
  assert.equal(cuenta.perfilPublico(rosa).clave, undefined);
  assert.throws(() => cuenta.cambiarClave('Incorrecta', 'Nueva2026!'));
  cuenta.cambiarClave('Rosa2026!', 'Nueva2026!');
  cuenta.cerrarSesion();
  assert.throws(() => cuenta.iniciarSesion(rosa, 'Rosa2026!'));
  cuenta.iniciarSesion(rosa, 'Nueva2026!');
});

test('registro sin escalamiento de rol y recuperación de un solo uso', () => {
  const datos = {
    correo: 'estudiante@aloe.ulima.edu.pe',
    clave: 'Prueba2026!',
    nombres: 'Ana',
    apellidos: 'Pérez',
    carrera: 'Administración',
    ciclo: '3',
    rol: 'administrador',
  };
  cuenta.registrarUsuario(datos);
  assert.equal(cuenta.perfilPublico(datos.correo).rol, 'usuario');
  assert.throws(() => cuenta.registrarUsuario(datos));
  assert.throws(() => cuenta.registrarUsuario({ ...datos, correo: 'otra@gmail.com' }));
  const token = cuenta.solicitarRecuperacion(datos.correo);
  assert.throws(() => cuenta.recuperarClave('invalido', 'Cambio2026!'));
  cuenta.recuperarClave(token, 'Cambio2026!');
  assert.throws(() => cuenta.recuperarClave(token, 'Cambio2026!'));
  cuenta.iniciarSesion(datos.correo, 'Cambio2026!');
});

test('cuatro intentos fallidos bloquean temporalmente el acceso', () => {
  for (let i = 0; i < 4; i++)
    assert.throws(() => cuenta.iniciarSesion(rosa, 'incorrecta'));
  assert.throws(() => cuenta.iniciarSesion(rosa, 'Rosa2026!'), /un minuto/);
});

test('los favoritos pertenecen a cada cuenta', () => {
  cuenta.iniciarSesion(rosa, 'Rosa2026!');
  almacen.alternarFavorito('demo-producto-1');
  assert.ok(almacen.favoritos().includes('demo-producto-1'));
  cuenta.iniciarSesion(diego, 'Diego2026!');
  assert.ok(!almacen.favoritos().includes('demo-producto-1'));
});

test('una publicación solo puede ser gestionada por su propietario', () => {
  cuenta.iniciarSesion(diego, 'Diego2026!');
  assert.throws(() =>
    publicaciones.cambiarEstadoPublicacion('demo-producto-0', 'Eliminado'),
  );
  cuenta.iniciarSesion(rosa, 'Rosa2026!');
  publicaciones.cambiarEstadoPublicacion('demo-producto-0', 'Eliminado');
  assert.equal(almacen.obtenerAviso('demo-producto-0').status, 'Eliminado');
  assert.equal(
    leerNegociaciones().ofertas.find((o) => o.avisoId === 'demo-producto-0').estado,
    'Cerrada',
  );
  assert.throws(() =>
    publicaciones.cambiarEstadoPublicacion('demo-producto-10', 'Publicado'),
  );
});

test('fotos y precios rechazan valores inválidos', () => {
  assert.throws(() => publicaciones.validarFotos([{ type: 'text/plain', size: 10 }]));
  assert.throws(() =>
    publicaciones.validarFotos(Array(7).fill({ type: 'image/png', size: 10 })),
  );
  assert.throws(() =>
    publicaciones.validarFotos([{ type: 'image/png', size: 6 * 1024 * 1024 }]),
  );
  const datos = {
    title: 'Libro universitario completo',
    description: 'Libro conservado para el siguiente ciclo.',
    category: 'Libros de texto',
    condition: 'Buen estado',
    course: 'Cálculo',
    price: 50,
    minimum: 30,
    acceptsOffers: true,
  };
  assert.deepEqual(publicaciones.validarPublicacion(datos, 'Publicado', 1), []);
  assert.ok(
    publicaciones.validarPublicacion({ ...datos, price: 50.123 }, 'Publicado', 1).length,
  );
  assert.ok(publicaciones.validarPublicacion(datos, 'Publicado', 0).length);
});

test('calificar exige un acuerdo cerrado, contraparte y una sola reseña', () => {
  cuenta.iniciarSesion(rosa, 'Rosa2026!');
  assert.throws(() => calificar('demo-acuerdo-1', 5, ''));
  assert.throws(() => calificar('demo-acuerdo-0', 6, ''));
  calificar('demo-acuerdo-0', 3, 'La entrega se completó.');
  assert.throws(() => calificar('demo-acuerdo-0', 4, 'Repetida'));
  assert.equal(reputacion(diego).promedio, 4);
  cuenta.iniciarSesion(admin, 'Admin2026!');
  assert.throws(() => calificar('demo-acuerdo-0', 5, 'No participé'));
});

test('reportes únicos, permisos y resolución con retiro del aviso', () => {
  cuenta.iniciarSesion(diego, 'Diego2026!');
  assert.throws(() => moderacion.retirarAviso('demo-producto-2', 'Motivo suficiente'));
  assert.throws(() =>
    moderacion.reportar('Aviso', 'demo-producto-2', 'Otro', 'Descripción del problema'),
  );
  assert.throws(() =>
    moderacion.reportar('Aviso', 'demo-producto-1', 'Otro', 'Es mi propio aviso'),
  );
  cuenta.iniciarSesion(admin, 'Admin2026!');
  moderacion.resolverReporte(
    'demo-reporte',
    'retirar',
    'Se verificó información incorrecta.',
  );
  assert.equal(almacen.obtenerAviso('demo-producto-2').status, 'Retirado');
  assert.equal(
    moderacion.reportes().find((r) => r.id === 'demo-reporte').estado,
    'Atendido',
  );
  assert.throws(() =>
    moderacion.resolverReporte('demo-reporte', 'descartar', 'Otra resolución.'),
  );
});

test('bloqueo deshabilita ingreso y cancela negociaciones activas, sin borrar ventas', () => {
  cuenta.iniciarSesion(admin, 'Admin2026!');
  moderacion.bloquearUsuario(diego, true, 'Incumplimiento de normas confirmado.');
  assert.throws(() => cuenta.iniciarSesion(diego, 'Diego2026!'), /bloqueada/);
  const acuerdos = leerNegociaciones().acuerdos;
  assert.equal(acuerdos.find((a) => a.id === 'demo-acuerdo-1').estado, 'Cancelado');
  assert.equal(acuerdos.find((a) => a.id === 'demo-acuerdo-0').estado, 'Cerrado');
  moderacion.bloquearUsuario(diego, false, 'Revisión completada y cuenta habilitada.');
  cuenta.iniciarSesion(diego, 'Diego2026!');
  assert.equal(cuenta.usuarioActivo().correo, diego);
});

test('los datos de ejemplo no se duplican al iniciar de nuevo', () => {
  const antes = JSON.stringify(leerNegociaciones());
  const cantidad = almacen.avisos().length;
  prepararDemostracion();
  assert.equal(almacen.avisos().length, cantidad);
  assert.equal(JSON.stringify(leerNegociaciones()), antes);
});
