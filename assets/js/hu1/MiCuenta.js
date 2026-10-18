export function iniciarMiCuenta() {
  const datosIniciales = {
    nombres: 'Rosa María',
    apellidos: 'Quispe Ríos',
    correo: '20201234@aloe.ulima.edu.pe',
    telefono: '987 654 321',
    carrera: 'Administración',
    ciclo: 'cuarto',
  };
  let usuario =
    JSON.parse(localStorage.getItem('usuarioDemo') || 'null') || datosIniciales;

  function mostrarUsuario() {
    document.getElementById('nombres').value = usuario.nombres;
    document.getElementById('apellidos').value = usuario.apellidos;
    document.getElementById('correo').value = usuario.correo;
    document.getElementById('telefono').value = usuario.telefono || '';
    document.getElementById('nombrePerfil').textContent =
      usuario.nombres + ' ' + usuario.apellidos;
    document.getElementById('nombreCabecera').textContent =
      usuario.nombres.split(' ')[0] + ' ' + usuario.apellidos.split(' ')[0] + ' ▾';
    document.getElementById('subtitulo').textContent =
      `${usuario.nombres} ${usuario.apellidos} · ${usuario.carrera || 'Administración'}, ${usuario.ciclo || 'cuarto'} ciclo · en el tablón desde marzo de 2026`;
  }

  function mostrarMensaje(texto) {
    const mensaje = document.getElementById('mensaje');
    mensaje.textContent = texto;
    mensaje.classList.remove('hidden');
  }

  mostrarUsuario();
  document.getElementById('perfilForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const nombres = document.getElementById('nombres').value.trim();
    const apellidos = document.getElementById('apellidos').value.trim();
    if (!nombres || !apellidos) {
      alert('Completa tus nombres y apellidos.');
      return;
    }
    usuario.nombres = nombres;
    usuario.apellidos = apellidos;
    usuario.telefono = document.getElementById('telefono').value.trim();
    localStorage.setItem('usuarioDemo', JSON.stringify(usuario));
    mostrarUsuario();
    mostrarMensaje('Datos personales guardados.');
  });
  document.getElementById('descartar').addEventListener('click', mostrarUsuario);

  document.getElementById('claveForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const actual = document.getElementById('actual').value;
    const nueva = document.getElementById('nueva').value;
    const confirmar = document.getElementById('confirmar').value;
    const valido =
      actual !== '' &&
      nueva.length >= 8 &&
      /[A-Z]/.test(nueva) &&
      /\d/.test(nueva) &&
      nueva === confirmar;
    document.getElementById('errorClave').classList.toggle('hidden', valido);
    if (valido) {
      this.reset();
      mostrarMensaje('Contraseña actualizada en esta demostración.');
    }
  });

  document.querySelectorAll('[data-punto]').forEach(function (boton) {
    boton.addEventListener('click', function () {
      document.querySelectorAll('[data-punto]').forEach(function (otro) {
        otro.className = 'rounded-full border border-[#E8DFD8] px-4 py-2 text-sm';
      });
      boton.className =
        'rounded-full border border-[#C1562E] bg-[#FBEBE3] px-4 py-2 text-sm font-bold text-[#9A4223]';
      localStorage.setItem('puntoPreferidoDemo', boton.dataset.punto);
    });
  });

  document.getElementById('foto').addEventListener('change', function () {
    if (!this.files[0]) return;
    const url = URL.createObjectURL(this.files[0]);
    document.getElementById('avatar').style.background = `url("${url}") center / cover`;
  });
  document.getElementById('salir').addEventListener('click', function () {
    sessionStorage.removeItem('correoDemo');
    window.location.href = '/';
  });
  document.getElementById('buscarForm').addEventListener('submit', function (event) {
    event.preventDefault();
    window.location.href = '/catalogo';
  });
}
