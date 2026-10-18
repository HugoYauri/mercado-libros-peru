export function iniciarFavoritos() {
  const T = window.Tablon;
  const lista = document.getElementById('lista');
  const usuario = T.usuarioActivo();
  if (!usuario) {
    document.getElementById('tituloVacio').textContent =
      'Inicia sesión para ver tus favoritos';
    document.getElementById('textoVacio').textContent =
      'Guarda avisos del catálogo y los encontrarás aquí cuando regreses.';
    document.getElementById('accionVacio').textContent = 'Iniciar sesión';
    document.getElementById('accionVacio').href = '/ingresar?returnTo=/favoritos';
    document.getElementById('vacio').classList.remove('hidden');
    return;
  }
  const guardados = T.favoritos()
    .map((id) => T.obtenerAviso(id))
    .filter(Boolean);
  document.getElementById('resumen').textContent = `${guardados.length} avisos guardados`;
  if (!guardados.length) document.getElementById('vacio').classList.remove('hidden');
  lista.innerHTML = guardados
    .map(
      (aviso) =>
        `
        <article class="overflow-hidden rounded-xl border border-[#E8DFD8] bg-white">
          <a href="/aviso?id=${encodeURIComponent(aviso.id)}">
            <div
              class="foto-ejemplo flex h-40 items-center justify-center text-sm text-[#7A6A62]"
            >
              Fotografía del producto
            </div>
            <div class="p-4">
              <h2 class="font-extrabold">${T.escapar(aviso.title)}</h2>
              <p class="mt-2 text-xl font-extrabold">${T.formatoPrecio(aviso.price)}</p>
              <p class="text-sm text-[#7A6A62]">${T.escapar(aviso.status)} · ${T.escapar(aviso.condition)}</p>
            </div>
          </a>
          <div class="flex justify-between border-t border-[#E8DFD8] p-4">
            <a
              href="/aviso?id=${encodeURIComponent(aviso.id)}"
              class="font-bold text-[#C1562E]"
            >
              Ver aviso
            </a>
            <button
              data-quitar="${T.escapar(aviso.id)}"
              class="text-sm font-bold text-[#B4322B]"
            >
              Quitar
            </button>
          </div>
        </article>
      `,
    )
    .join('');
  lista.addEventListener('click', (event) => {
    const boton = event.target.closest('[data-quitar]');
    if (!boton) return;
    T.alternarFavorito(boton.dataset.quitar);
    location.reload();
  });
}
