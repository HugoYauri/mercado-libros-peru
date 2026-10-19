export function iniciarCatalogo() {
  const T = window.Tablon;
  const parametros = new URLSearchParams(location.search);
  const q = parametros.get('q') || '';
  document.getElementById('categoria').value = parametros.get('categoria') || '';
  document.getElementById('curso').value = parametros.get('curso') || '';
  document.getElementById('buscar').value = q;
  function renderizar() {
    const texto = document.getElementById('buscar').value.trim().toLowerCase();
    const categoria = document.getElementById('categoria').value;
    const curso = document.getElementById('curso').value.trim().toLowerCase();
    const maximo = Number(document.getElementById('maximo').value) || Infinity;
    let resultados = T.avisos().filter(
      (aviso) =>
        aviso.status === 'Publicado' &&
        `${aviso.title} ${aviso.description} ${aviso.course}`
          .toLowerCase()
          .includes(texto) &&
        (!categoria || aviso.category === categoria) &&
        aviso.course.toLowerCase().includes(curso) &&
        Number(aviso.price) <= maximo,
    );
    if (document.getElementById('orden').value === 'precio')
      resultados.sort((a, b) => a.price - b.price);
    document.getElementById('cantidad').textContent =
      `${resultados.length} avisos encontrados`;
    document.getElementById('resultados').classList.toggle('hidden', !resultados.length);
    document
      .getElementById('sinResultados')
      .classList.toggle('hidden', resultados.length > 0);
    document.getElementById('resultados').innerHTML = resultados
      .map(
        (aviso) =>
          `
        <article class="overflow-hidden rounded-xl border border-[#E8DFD8] bg-white">
          <a
            href="/aviso?id=${encodeURIComponent(aviso.id)}"
            class="block"
          >
            <div
              class="foto-ejemplo flex h-48 items-center justify-center text-sm text-[#7A6A62]"
            >
              Fotografía del producto
            </div>
            <div class="p-4">
              <p class="text-xs font-bold text-[#7A6A62]">${T.escapar(aviso.category)} · ${T.escapar(aviso.course)}</p>
              <h2 class="mt-2 font-extrabold">${T.escapar(aviso.title)}</h2>
              <p class="mt-2 text-xl font-extrabold">${T.formatoPrecio(aviso.price)}</p>
              <p class="text-sm text-[#7A6A62]">${T.escapar(aviso.condition)}</p>
            </div>
          </a>
          <div class="flex justify-between border-t border-[#E8DFD8] px-4 py-3">
            <a
              href="/aviso?id=${encodeURIComponent(aviso.id)}"
              class="text-sm font-bold text-[#C1562E]"
            >
              Ver detalle
            </a>
            <button
              data-favorito="${T.escapar(aviso.id)}"
              class="font-bold text-[#C1562E]"
            >
              ${T.esFavorito(aviso.id) ? '♥ Guardado' : '♡ Guardar'}
            </button>
          </div>
        </article>
      `,
      )
      .join('');
    document.getElementById('activos').innerHTML = [
      texto && `Búsqueda: ${T.escapar(texto)}`,
      categoria && T.escapar(categoria),
      curso && `Curso: ${T.escapar(curso)}`,
      maximo !== Infinity && `Hasta ${T.formatoPrecio(maximo)}`,
    ]
      .filter(Boolean)
      .map(
        (etiqueta) =>
          `
        <span class="rounded-full bg-[#FBEBE3] px-3 py-1 text-xs font-bold">${etiqueta}</span>
      `,
      )
      .join('');
  }
  ['buscar', 'categoria', 'curso', 'maximo', 'orden'].forEach((id) =>
    document.getElementById(id).addEventListener('input', renderizar),
  );
  document.getElementById('buscarForm').addEventListener('submit', (event) => {
    event.preventDefault();
    renderizar();
  });
  function limpiar() {
    document.getElementById('buscar').value = '';
    document.getElementById('categoria').value = '';
    document.getElementById('curso').value = '';
    document.getElementById('maximo').value = '';
    document.getElementById('orden').value = 'reciente';
    renderizar();
  }
  document.getElementById('limpiar').addEventListener('click', limpiar);
  document.getElementById('limpiarVacio').addEventListener('click', limpiar);
  document.getElementById('resultados').addEventListener('click', (event) => {
    const boton = event.target.closest('[data-favorito]');
    if (!boton) return;
    if (!T.usuarioActivo())
      return window.location.assign(
        `/ingresar?returnTo=${encodeURIComponent(location.pathname + location.search)}`,
      );
    T.alternarFavorito(boton.dataset.favorito);
    renderizar();
  });
  renderizar();
}
