export function iniciarMensajesAcceso() {
  document.querySelectorAll('[data-mostrar]').forEach(function (boton) {
    boton.addEventListener('click', function () {
      const campo = document.getElementById(boton.dataset.mostrar);
      const visible = campo.type === 'text';
      campo.type = visible ? 'password' : 'text';
      boton.textContent = visible ? 'Mostrar' : 'Ocultar';
    });
  });
  document.getElementById('reenviar').addEventListener('click', function () {
    document.getElementById('reenviado').classList.remove('hidden');
  });
}
