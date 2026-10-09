import { avisosIniciales } from '../../../datos/iniciales.js';
import { usuarioActivo, correoActivo } from './sesion.js';

const CLAVE_AVISOS = 'tablon_avisos_v1';
const CLAVE_FAVORITOS = 'tablon_favoritos_v1';

function leer(clave, alternativa) {
  try {
    const valor = localStorage.getItem(clave);
    return valor ? JSON.parse(valor) : alternativa;
  } catch {
    return alternativa;
  }
}

function guardar(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

function avisos() {
  const valor = leer(CLAVE_AVISOS, null);
  if (Array.isArray(valor)) return valor;
  guardar(CLAVE_AVISOS, avisosIniciales);
  return avisosIniciales.slice();
}

function guardarAvisos(lista) { guardar(CLAVE_AVISOS, lista); }
function obtenerAviso(id) { return avisos().find((aviso) => aviso.id === id); }
function guardarAviso(aviso) {
  const lista = avisos();
  const indice = lista.findIndex((item) => item.id === aviso.id);
  if (indice < 0) lista.unshift(aviso); else lista[indice] = aviso;
  guardarAvisos(lista);
}

function favoritos() { return leer(CLAVE_FAVORITOS, []); }
function alternarFavorito(id) {
  const lista = favoritos();
  const nueva = lista.includes(id) ? lista.filter((item) => item !== id) : [...lista, id];
  guardar(CLAVE_FAVORITOS, nueva);
  return nueva.includes(id);
}
function esFavorito(id) { return favoritos().includes(id); }
function formatoPrecio(precio) { return `S/ ${Number(precio).toFixed(2)}`; }
function escapar(texto) {
  return String(texto ?? '').replace(/[&<>"']/g, (caracter) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[caracter]);
}

// Fotografías: archivos binarios en IndexedDB, separados de los datos pequeños.
const NOMBRE_BD = 'tablon_ulima_local';
const ALMACEN = 'fotos';

function abrirBD() {
  return new Promise((resolve, reject) => {
    const solicitud = indexedDB.open(NOMBRE_BD, 1);
    solicitud.onupgradeneeded = () => {
      const db = solicitud.result;
      if (!db.objectStoreNames.contains(ALMACEN)) db.createObjectStore(ALMACEN, { keyPath: 'id' });
    };
    solicitud.onsuccess = () => resolve(solicitud.result);
    solicitud.onerror = () => reject(solicitud.error);
  });
}

async function guardarFotos(idAviso, archivos) {
  const db = await abrirBD();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ALMACEN, 'readwrite');
    const store = tx.objectStore(ALMACEN);
    const indice = store.openCursor();
    indice.onsuccess = () => {
      const cursor = indice.result;
      if (!cursor) {
        archivos.forEach((archivo, orden) => store.put({ id: `${idAviso}-${orden}`, idAviso, orden, archivo }));
        return;
      }
      if (cursor.value.idAviso === idAviso) cursor.delete();
      cursor.continue();
    };
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

async function listarFotos(idAviso) {
  const db = await abrirBD();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ALMACEN, 'readonly');
    const req = tx.objectStore(ALMACEN).getAll();
    req.onsuccess = () => resolve(req.result.filter((foto) => foto.idAviso === idAviso)
      .sort((a, b) => a.orden - b.orden).map((foto) => foto.archivo));
    req.onerror = () => reject(req.error);
    tx.oncomplete = () => db.close();
  });
}

// La lógica heredada de cada HU llama estas funciones hasta que se convierta a estado React.
window.Tablon = { avisos, guardarAvisos, obtenerAviso, guardarAviso, usuarioActivo,
  correoActivo, favoritos, alternarFavorito, esFavorito, formatoPrecio, escapar };
window.TablonFotos = { guardar: guardarFotos, listar: listarFotos };

export { avisos, guardarAviso, obtenerAviso, favoritos, alternarFavorito, guardarFotos, listarFotos };
