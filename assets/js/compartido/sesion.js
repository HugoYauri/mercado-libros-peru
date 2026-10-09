import { usuarioInicial } from '../../../datos/iniciales.js';

const CLAVE_USUARIO = 'usuarioDemo';
const CLAVE_SESION = 'correoDemo';

export function leerUsuario() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_USUARIO)) || usuarioInicial;
  } catch {
    return usuarioInicial;
  }
}

export function guardarUsuario(usuario) {
  localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
}

export function usuarioActivo() {
  const correo = sessionStorage.getItem(CLAVE_SESION);
  return correo ? { ...leerUsuario(), correo } : null;
}

export function correoActivo() {
  return sessionStorage.getItem(CLAVE_SESION) || leerUsuario().correo;
}

export function iniciarSesion(correo) {
  sessionStorage.setItem(CLAVE_SESION, correo);
}

export function cerrarSesion() {
  sessionStorage.removeItem(CLAVE_SESION);
}
