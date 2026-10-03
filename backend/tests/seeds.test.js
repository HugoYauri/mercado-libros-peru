import { test } from 'node:test';
import assert from 'node:assert/strict';
import seeds from '../../shared/seeds/demo.json' with { type: 'json' };
import { consultarCatalogo } from '../../shared/contracts/domain.js';
test('semillas mantienen una oferta activa por comprador y aviso', () => {
  const keys = seeds.ofertas.filter(o => ['ENVIADA', 'CONTRAOFERTADA'].includes(o.estado)).map(o => `${o.compradorId}:${o.avisoId}`);
  assert.equal(new Set(keys).size, keys.length);
});
test('aceptación genera acuerdo; vendido requiere ambas entregas', () => {
  for (const o of seeds.ofertas.filter(o => o.estado === 'ACEPTADA')) assert.equal(seeds.acuerdos.filter(a => a.ofertaId === o.id).length, 1);
  for (const a of seeds.acuerdos) {
    const aviso = seeds.avisos.find(v => v.id === a.avisoId);
    assert.ok(aviso); assert.equal(aviso.vendedorId, a.vendedorId);
    assert.equal(aviso.estado === 'VENDIDO', !!(a.entregaCompradorEn && a.entregaVendedorEn));
  }
});
test('casos vacíos y favoritos vendidos existen para desarrollar interfaces', () => {
  assert.equal(consultarCatalogo(seeds.avisos, { q: 'inexistente-xyz' }).total, 0);
  assert.ok(seeds.usuarios.some(u => u.id === 'sin-actividad'));
  assert.ok(seeds.favoritos.some(f => seeds.avisos.find(a => a.id === f.avisoId)?.estado === 'VENDIDO'));
});
