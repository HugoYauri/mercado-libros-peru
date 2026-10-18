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
