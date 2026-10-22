import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';

const servidor = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
const { Pantallas } = await servidor.ssrLoadModule('/App.jsx');
test.after(() => servidor.close());
function abrir(ruta) {
  return renderToString(
    createElement(MemoryRouter, { initialEntries: [ruta] }, createElement(Pantallas)),
  ).replace(/<!--.*?-->/g, '');
}

const rutas = [
  ['/', 'Lo que a un compañero le sobra'],
  ['/ingresar', 'Iniciar sesión'],
  ['/registro', 'Crear cuenta'],
  ['/recuperar-contrasena', 'Ingresa tu correo institucional'],
  ['/mi-cuenta', 'Datos personales'],
  ['/mensajes-acceso', 'Error de credenciales'],
  ['/acceso-denegado', 'Acceso denegado'],
  ['/no-encontrado', '404'],
  ['/mis-publicaciones', 'Mis publicaciones'],
  ['/nuevo-aviso', 'Nuevo aviso'],
  ['/fotografias-aviso', 'Fotografías'],
  ['/catalogo', 'avisos encontrados'],
  ['/aviso', 'Descripción'],
  ['/favoritos', 'Mis favoritos'],
  ['/vendedor', 'Avisos publicados'],
  ['/ofertas', 'Ofertas recibidas'],
  ['/ofertas/1', 'Negociación con María'],
  ['/acuerdos', 'Mis acuerdos'],
  ['/acuerdos/1', 'Datos del encuentro'],
  ['/acuerdos/1?vista=coordinar', 'Coordinar encuentro'],
  ['/acuerdo-generado', '¡Trato cerrado!'],
  ['/calificaciones', 'Tu reputación'],
  ['/administracion/metricas', 'Estados de publicaciones'],
  ['/administracion/reportes', 'Buscar reportes'],
  ['/administracion/reportes/1', 'Información incorrecta'],
  ['/administracion/usuarios', 'Buscar usuarios'],
  ['/ruta-inexistente', '404'],
];
for (const [ruta, texto] of rutas) {
  test(`abre ${ruta} sin sesión y con cabecera/pie compartidos`, () => {
    const html = abrir(ruta);
    assert.ok(html.includes(texto), `No se encontró «${texto}»`);
    assert.equal((html.match(/<header/g) || []).length >= 1, true);
    assert.equal((html.match(/<footer class="(?:neg-pie|hu1-pie-publico)"/g) || []).length, 1);
    if (
      ![
        '/',
        '/ingresar',
        '/registro',
        '/recuperar-contrasena',
        '/mensajes-acceso',
        '/acceso-denegado',
        '/no-encontrado',
        '/ruta-inexistente',
      ].includes(ruta)
    ) {
      assert.ok(
        !html.includes('id="correo-login"'),
        'La HU no debe exigir el formulario de acceso',
      );
    }
  });
}
test('los estados vacíos y vendido se revisan por URL', () => {
  for (const [ruta, texto] of [
    ['/mis-publicaciones?ejemplo=vacio', 'Todavía no publicas nada'],
    ['/favoritos?ejemplo=vacio', 'Aún no tienes favoritos'],
    ['/ofertas?ejemplo=vacio', 'No hay ofertas'],
    ['/acuerdos?ejemplo=vacio', 'Aún no tienes acuerdos'],
    ['/calificaciones?ejemplo=vacio', 'No hay calificaciones'],
    ['/aviso?ejemplo=vendido', 'Este aviso ya se cerró'],
  ])
    assert.ok(abrir(ruta).includes(texto), ruta);
});
test('catálogo filtra su arreglo propio; no cambia Mis publicaciones', () => {
  const html = abrir('/catalogo?q=zzzzzz');
  assert.ok(html.includes('No encontramos avisos'));
  assert.ok(abrir('/mis-publicaciones').includes('Stewart'));
});
test('enlaces internos de la HU activos; enlaces a otra HU solo visuales', () => {
  const html = abrir('/mis-publicaciones');
  assert.match(html, /href="\/nuevo-aviso"/);
  assert.ok(!/href="\/ofertas"/.test(html));
  assert.ok(html.includes('aria-disabled="true"'));
});

async function archivos(carpeta) {
  const entradas = await readdir(carpeta, { withFileTypes: true });
  const grupos = await Promise.all(
    entradas.map((entrada) =>
      entrada.isDirectory()
        ? archivos(path.join(carpeta, entrada.name))
        : path.join(carpeta, entrada.name),
    ),
  );
  return grupos.flat();
}
test('las HU no importan otras HU, cuentas, almacenes ni datos externos', async () => {
  const lista = (await archivos('pages')).filter((archivo) => archivo.endsWith('.jsx'));
  for (const archivo of lista) {
    const codigo = await readFile(archivo, 'utf8');
    assert.doesNotMatch(
      codigo,
      /localStorage|sessionStorage|indexedDB|document\.cookie|useContext|useReducer|fetch\(/,
      archivo,
    );
    const grupo = archivo.split(path.sep)[1];
    for (const coincidencia of codigo.matchAll(/from ['"]([^'"]+)['"]/g)) {
      const modulo = coincidencia[1];
      if (!modulo.startsWith('.')) continue;
      const destino = path.normalize(path.join(path.dirname(archivo), modulo));
      if (destino.startsWith('pages' + path.sep)) {
        assert.ok(
          [grupo, 'compartido'].includes(destino.split(path.sep)[1]),
          `${archivo} depende de ${destino}`,
        );
      } else
        assert.ok(
          destino.startsWith('assets/css') || destino === 'assets/js/compartido/rutas.js',
          `${archivo}: ${destino}`,
        );
    }
  }
});
