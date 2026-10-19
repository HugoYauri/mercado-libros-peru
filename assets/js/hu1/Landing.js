export function iniciarLanding() {
  document.getElementById('busquedaForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const texto = document.getElementById('busqueda').value.trim();
    if (texto) {
      window.location.href = `/catalogo?q=${encodeURIComponent(texto)}`;
      return;
    }
    const avisos = document.querySelectorAll('#listaAvisos a');
    let encontrados = 0;
    avisos.forEach(function (aviso) {
      const coincide = aviso.textContent.toLowerCase().includes(texto.toLowerCase());
      aviso.classList.toggle('hidden', !coincide);
      if (coincide) encontrados++;
    });
    document.getElementById('sinResultados').classList.toggle('hidden', encontrados > 0);
    document.getElementById('avisos').scrollIntoView({ behavior: 'smooth' });
  });
}
