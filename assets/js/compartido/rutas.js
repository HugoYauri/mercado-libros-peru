// Los marcadores antiguos también abren las nuevas direcciones.
const rutasAnteriores = {
  Landing: '/',
  IniciarSesion: '/ingresar',
  Registro: '/registro',
  RecuperarContrasena: '/recuperar-contrasena',
  MiCuenta: '/mi-cuenta',
  MensajesAcceso: '/mensajes-acceso',
  AccesoDenegado: '/acceso-denegado',
  PaginaNoEncontrada: '/no-encontrado',
  MisPublicaciones: '/mis-publicaciones',
  NuevoAviso: '/nuevo-aviso',
  FotografiasAviso: '/fotografias-aviso',
  Catalogo: '/catalogo',
  DetalleAviso: '/aviso',
  Favoritos: '/favoritos',
  PerfilVendedor: '/vendedor',
};

export function limpiarDireccionAnterior() {
  const nombre = location.pathname
    .split('/')
    .pop()
    .replace(/\.html$/i, '');
  const nuevaRuta = rutasAnteriores[nombre];
  if (nuevaRuta) {
    history.replaceState(null, '', nuevaRuta + location.search + location.hash);
  }
}

export function historiaDeRuta(ruta) {
  if (/^\/(mis-publicaciones|nuevo-aviso|fotografias-aviso)(\/|$)/.test(ruta)) return 'hu2';
  if (/^\/(catalogo|aviso|vendedor|favoritos)(\/|$)/.test(ruta)) return 'hu3';
  if (ruta.startsWith('/ofertas')) return 'hu4';
  if (/^\/(acuerdos|acuerdo-generado)(\/|$)/.test(ruta)) return 'hu5';
  if (ruta.startsWith('/calificaciones')) return 'hu6';
  if (ruta.startsWith('/administracion')) return 'hu7';
  return 'hu1';
}
