import { usuariosIniciales } from '../../../datos/usuarios.js';

const CLAVE_USUARIOS = 'tablon_usuarios_v3';
const CLAVE_SESION = 'correoDemo';

// Autenticación local para la entrega de frontend. El backend reemplazará este módulo.
export function usuarios() {
  const guardados = localStorage.getItem(CLAVE_USUARIOS);
  if (guardados) return JSON.parse(guardados);
  const iniciales = usuariosIniciales.map((usuario) => ({ ...usuario }));
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(iniciales));
  return iniciales;
}

export function guardarUsuarios(lista) {
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(lista));
}

export function perfilPublico(correo) {
  const usuario = usuarios().find((item) => item.correo === correo);
  if (!usuario) return null;
  const { clave, ...perfil } = usuario;
  return perfil;
}

export function usuarioActivo() {
  const correo = sessionStorage.getItem(CLAVE_SESION);
  const usuario = perfilPublico(correo);
  if (!usuario || usuario.bloqueado) return null;
  return usuario;
}

export function leerUsuario() {
  return usuarioActivo();
}

export function correoActivo() {
  return usuarioActivo()?.correo || '';
}

export function claveValida(clave) {
  return (
    typeof clave === 'string' &&
    clave.length >= 8 &&
    /[A-Z]/.test(clave) &&
    /[0-9]/.test(clave)
  );
}

export function iniciarSesion(correo, clave) {
  const normalizado = correo.trim().toLowerCase(); //limpia los espacios
  const intentosClave = 'tablon_intentos_' + normalizado;
  const intentos = JSON.parse(
    localStorage.getItem(intentosClave) || '{"cantidad":0,"hasta":0}',
  );
  const bloqueoActivo = intentos.hasta > Date.now();
  if (bloqueoActivo) {
    throw new Error('Demasiados intentos. Espera un minuto antes de volver a ingresar.');
  }

  const usuario = usuarios().find((item) => item.correo === normalizado);
  const credencialesIncorrectas = !usuario || usuario.clave !== clave;
  if (credencialesIncorrectas) {
    const bloqueoAnteriorVencido = Boolean(intentos.hasta);
    const cantidadIntentos = bloqueoAnteriorVencido ? 1 : intentos.cantidad + 1;
    const fechaDesbloqueo =
      cantidadIntentos >= 4 ? Date.now() + 60000 : 0;

    localStorage.setItem(
      intentosClave,
      JSON.stringify({
        cantidad: cantidadIntentos,
        hasta: fechaDesbloqueo,
      }),
    );
    throw new Error('Correo o contraseña incorrectos.');
  }

  if (usuario.bloqueado) {
    throw new Error('Esta cuenta está bloqueada. Contacta a la administración.');
  }

  localStorage.removeItem(intentosClave);
  sessionStorage.setItem(CLAVE_SESION, normalizado);
  return perfilPublico(normalizado);
}

export function cerrarSesion() {
  sessionStorage.removeItem(CLAVE_SESION);
}

export function registrarUsuario(datos) {
  const correo = datos.correo.trim().toLowerCase();
  if (!/^[^\s@]+@aloe\.ulima\.edu\.pe$/.test(correo))
    throw new Error('Usa tu correo institucional @aloe.ulima.edu.pe.');
  if (!claveValida(datos.clave))
    throw new Error('La contraseña requiere 8 caracteres, una mayúscula y un número.');
  if (
    !datos.nombres.trim() ||
    !datos.apellidos.trim() ||
    !datos.carrera ||
    !datos.ciclo
  ) {
    throw new Error('Completa todos los datos personales y académicos.');
  }
  const lista = usuarios();
  if (lista.some((item) => item.correo === correo))
    throw new Error('Ya existe una cuenta con ese correo.');
  lista.push({
    correo,
    clave: datos.clave,
    nombres: datos.nombres.trim(),
    apellidos: datos.apellidos.trim(),
    carrera: datos.carrera,
    ciclo: datos.ciclo,
    telefono: '',
    rol: 'usuario',
    bloqueado: false,
  });
  guardarUsuarios(lista);
}

export function guardarUsuario(datos) {
  const activo = usuarioActivo();
  if (!activo) throw new Error('Inicia sesión para guardar tus datos.');
  if (!datos.nombres.trim() || !datos.apellidos.trim())
    throw new Error('Completa nombres y apellidos.');
  if (datos.telefono && !/^\d{9}$/.test(datos.telefono))
    throw new Error('El teléfono debe contener 9 dígitos.');
  const lista = usuarios().map((item) =>
    item.correo === activo.correo
      ? {
          ...item,
          nombres: datos.nombres.trim(),
          apellidos: datos.apellidos.trim(),
          telefono: datos.telefono,
          carrera: datos.carrera,
          ciclo: datos.ciclo,
        }
      : item,
  );
  guardarUsuarios(lista);
}

export function cambiarClave(actual, nueva) {
  const activo = usuarioActivo();
  if (!activo) throw new Error('Inicia sesión para cambiar la contraseña.');
  const lista = usuarios();
  const usuario = lista.find((item) => item.correo === activo.correo);
  if (usuario.clave !== actual) throw new Error('La contraseña actual no coincide.');
  if (!claveValida(nueva))
    throw new Error(
      'La nueva contraseña requiere 8 caracteres, una mayúscula y un número.',
    );
  usuario.clave = nueva;
  guardarUsuarios(lista);
}

export function solicitarRecuperacion(correo) {
  const normalizado = correo.trim().toLowerCase();
  if (!usuarios().some((item) => item.correo === normalizado && !item.bloqueado)) {
    throw new Error('No hay una cuenta activa con ese correo.');
  }
  const token = crypto.randomUUID();
  sessionStorage.setItem(
    'tablon_recuperacion',
    JSON.stringify({
      correo: normalizado,
      token,
      vence: Date.now() + 15 * 60 * 1000,
    }),
  );
  return token;
}

export function recuperarClave(token, nueva) {
  const solicitud = JSON.parse(sessionStorage.getItem('tablon_recuperacion') || 'null');
  if (!solicitud || solicitud.token !== token || solicitud.vence < Date.now())
    throw new Error('El enlace venció. Solicita otro.');
  if (!claveValida(nueva))
    throw new Error(
      'La nueva contraseña requiere 8 caracteres, una mayúscula y un número.',
    );
  const lista = usuarios();
  const usuario = lista.find((item) => item.correo === solicitud.correo);
  if (!usuario || usuario.bloqueado) throw new Error('La cuenta no está disponible.');
  usuario.clave = nueva;
  guardarUsuarios(lista);
  sessionStorage.removeItem('tablon_recuperacion');
}
