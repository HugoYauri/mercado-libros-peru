import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
process.env.DATA_SOURCE = 'seed';
process.env.NODE_ENV = 'test';
const { default: app } = await import('../src/app.js');
let server, base;
before(async () => { server = app.listen(0, '127.0.0.1'); await new Promise(resolve => server.once('listening', resolve)); base = `http://127.0.0.1:${server.address().port}/api`; });
after(() => new Promise(resolve => server.close(resolve)));
test('health comprueba API y declara que no verificó la base', async () => {
  const r = await fetch(`${base}/health`); assert.equal(r.status, 200); const d = await r.json(); assert.equal(d.status, 'ok'); assert.equal(d.databaseVerified, false);
});
test('catálogo filtra y pagina solo avisos publicados', async () => {
  const r = await fetch(`${base}/avisos?categoriaId=libros&orden=precio-asc&limit=1`);
  const d = await r.json(); assert.equal(r.status, 200); assert.equal(d.total, 3); assert.equal(d.items.length, 1); assert.equal(d.items[0].id, 'larson'); assert.equal(d.pages, 3);
});
test('rangos invertidos, precio negativo y página fraccional devuelven 400', async () => {
  for (const query of ['min=100&max=20', 'min=-1', 'page=1.5', 'limit=999', 'condicion=INVALIDO']) assert.equal((await fetch(`${base}/avisos?${query}`)).status, 400);
});
test('borradores y pausados no se revelan; vendidos sí tienen detalle', async () => {
  for (const id of ['borrador', 'pausado', 'inexistente']) assert.equal((await fetch(`${base}/avisos/${id}`)).status, 404);
  const r = await fetch(`${base}/avisos/vendido`); assert.equal(r.status, 200); assert.equal((await r.json()).estado, 'VENDIDO');
});
test('perfil público no filtra datos de contacto o acceso', async () => {
  const r = await fetch(`${base}/usuarios/rosa`); const d = await r.json(); assert.equal(r.status, 200);
  for (const key of ['correo', 'telefono', 'contrasenaHash', 'puntoPreferido']) assert.equal(key in d, false);
});
test('el esqueleto no habilita escrituras ni inicio de sesión real', async () => {
  assert.equal((await fetch(`${base}/avisos`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })).status, 404);
});
