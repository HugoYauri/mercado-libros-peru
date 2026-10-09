(function () {
    const T = window.Tablon;
    let filtro = "Todos";
    const lista = document.getElementById("lista");

    function renderizar() {
        const misAvisos = T.avisos().filter((aviso) => aviso.owner === T.correoActivo());
        const visibles = filtro === "Todos" ? misAvisos : misAvisos.filter((aviso) => aviso.status === filtro);
        document.getElementById("resumen").textContent = `${misAvisos.length} avisos · gestiona el estado y edita tus publicaciones`;
        document.getElementById("vacio").classList.toggle("hidden", misAvisos.length > 0);
        lista.innerHTML = visibles.map((aviso) => `<article class="flex flex-wrap items-center gap-4 rounded-xl border border-[#E8DFD8] bg-white p-4"><div class="foto-ejemplo h-20 w-20 rounded-lg"></div><div class="min-w-[220px] flex-1"><h2 class="font-extrabold">${T.escapar(aviso.title)}</h2><p class="mt-1 text-sm text-[#7A6A62]">${T.escapar(aviso.category)} · ${T.escapar(aviso.course)} · ${T.escapar(aviso.condition)}</p><p class="mt-2 text-lg font-extrabold">${T.formatoPrecio(aviso.price)} <span class="ml-2 rounded-full bg-[#F1EDE9] px-3 py-1 text-xs font-bold">${T.escapar(aviso.status)}</span></p></div><div class="flex flex-wrap gap-2"><a href="NuevoAviso.html?id=${encodeURIComponent(aviso.id)}" class="rounded-lg border border-[#C1562E] px-4 py-2 text-sm font-bold text-[#C1562E]">Editar</a><button data-estado="${T.escapar(aviso.id)}" class="rounded-lg border border-[#E8DFD8] px-4 py-2 text-sm font-bold">${aviso.status === "Publicado" ? "Pausar" : "Publicar"}</button><button data-vendido="${T.escapar(aviso.id)}" class="rounded-lg border border-[#E8DFD8] px-4 py-2 text-sm font-bold">Vendido</button></div></article>`).join("");
        document.getElementById("vacio").classList.toggle("hidden", visibles.length > 0 || misAvisos.length > 0);
    }

    document.getElementById("filtros").addEventListener("click", (event) => {
        const boton = event.target.closest("[data-filtro]");
        if (!boton) return;
        filtro = boton.dataset.filtro;
        document.querySelectorAll("[data-filtro]").forEach((item) => item.className = item === boton ? "rounded-full bg-[#C1562E] px-4 py-2 text-sm font-bold text-white" : "rounded-full border border-[#E8DFD8] bg-white px-4 py-2 text-sm");
        renderizar();
    });
    lista.addEventListener("click", (event) => {
        const cambiar = event.target.closest("[data-estado], [data-vendido]");
        if (!cambiar) return;
        const aviso = T.obtenerAviso(cambiar.dataset.estado || cambiar.dataset.vendido);
        if (!aviso) return;
        aviso.status = cambiar.hasAttribute("data-vendido") ? "Vendido" : (aviso.status === "Publicado" ? "Pausado" : "Publicado");
        T.guardarAviso(aviso);
        renderizar();
    });
    document.getElementById("buscarForm").addEventListener("submit", (event) => { event.preventDefault(); window.location.href = `../HU3_Catalogo/Catalogo.html?q=${encodeURIComponent(document.getElementById("buscar").value)}`; });
    renderizar();
}());
