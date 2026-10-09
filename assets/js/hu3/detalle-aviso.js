(function () {
    const T = window.Tablon;
    const id = new URLSearchParams(location.search).get("id");
    const aviso = T.obtenerAviso(id);
    const contenido = document.getElementById("contenido");
    if (!aviso) {
        contenido.innerHTML = `<section class="rounded-xl border border-[#E8DFD8] bg-white p-10 text-center lg:col-span-2"><p class="text-6xl font-extrabold text-[#C1562E]">404</p><h1 class="mt-3 text-2xl font-extrabold">Este aviso ya no está en el tablón</h1><a href="Catalogo.html" class="mt-5 inline-block rounded-lg bg-[#C1562E] px-5 py-3 font-bold text-white">Ir al catálogo</a></section>`;
        return;
    }
    document.title = `${aviso.title} · Tablón ULima`;
    document.getElementById("miga").textContent = `${aviso.category} › ${aviso.course}`;
    document.getElementById("descripcion").textContent = aviso.description;
    const vendido = aviso.status === "Vendido";
    contenido.innerHTML = `<section><div id="galeria" class="foto-ejemplo flex min-h-[390px] items-center justify-center overflow-hidden rounded-xl text-[#7A6A62]">Fotografía principal del producto</div><div id="miniaturas" class="mt-3 flex gap-3"></div></section><section><span class="rounded-full ${vendido ? "bg-[#E5F4EC] text-[#2E7D5B]" : "bg-[#EAF2FA] text-[#3B6FA8]"} px-3 py-1 text-xs font-bold">${vendido ? "Vendido" : "Publicado"}</span><h1 class="mt-4 text-3xl font-extrabold">${T.escapar(aviso.title)}</h1><p class="mt-3 text-3xl font-extrabold">${T.formatoPrecio(aviso.price)}</p><p class="mt-1 text-sm text-[#7A6A62]">Acepta ofertas desde ${T.formatoPrecio(aviso.minimum)}</p><div class="mt-4 flex gap-2"><span class="rounded-full bg-[#FBEBE3] px-3 py-1 text-sm">${T.escapar(aviso.condition)}</span><span class="rounded-full bg-[#FBEBE3] px-3 py-1 text-sm">${T.escapar(aviso.course)}</span></div><div class="mt-6 rounded-xl border border-[#E8DFD8] bg-white p-5">${vendido ? `<p class="font-bold">Este aviso ya se cerró y no acepta ofertas.</p><a href="Catalogo.html?curso=${encodeURIComponent(aviso.course)}" class="mt-4 inline-block font-bold text-[#C1562E]">Ver avisos similares</a>` : `<p class="text-sm text-[#7A6A62]">Para ofertar o guardar este aviso, inicia sesión con tu correo institucional.</p><div class="mt-4 flex flex-wrap gap-3"><button id="ofertar" class="rounded-lg bg-[#C1562E] px-5 py-3 font-bold text-white">Ingresar para ofertar</button><button id="favorito" class="rounded-lg border border-[#C1562E] px-5 py-3 font-bold text-[#C1562E]">${T.esFavorito(aviso.id) ? "♥ Guardado" : "♡ Guardar en favoritos"}</button></div>`}</div><div class="mt-5 rounded-xl border border-[#E8DFD8] bg-white p-5"><p class="text-xs font-extrabold tracking-[.15em] text-[#7A6A62]">VENDEDORA</p><div class="mt-3 flex items-center gap-3"><span class="flex h-12 w-12 items-center justify-center rounded-full bg-[#FBEBE3] font-bold text-[#9A4223]">RQ</span><div><p class="font-extrabold">Rosa María Quispe Ríos</p><p class="text-sm text-[#7A6A62]">Administración · cuarto ciclo</p></div></div><p class="mt-3 text-sm">4.8 ★★★★★ · 12 acuerdos cerrados</p><a href="PerfilVendedor.html" class="mt-3 inline-block font-bold text-[#C1562E]">Ver perfil y sus avisos →</a></div></section>`;
    const button = document.getElementById("favorito");
    if (button) button.addEventListener("click", () => {
        if (!T.usuarioActivo()) return window.location.assign(`../HU1_CuentaAcceso/IniciarSesion.html?returnTo=${encodeURIComponent(location.pathname + location.search)}`);
        const guardado = T.alternarFavorito(aviso.id);
        button.textContent = guardado ? "♥ Guardado" : "♡ Guardar en favoritos";
    });
    const ofertar = document.getElementById("ofertar");
    if (ofertar) ofertar.addEventListener("click", () => window.location.assign(`../HU1_CuentaAcceso/IniciarSesion.html?returnTo=${encodeURIComponent(location.pathname + location.search)}`));
    document.getElementById("buscarForm").addEventListener("submit", (event) => { event.preventDefault(); window.location.href = `Catalogo.html?q=${encodeURIComponent(document.getElementById("buscar").value)}`; });
    window.TablonFotos.listar(aviso.id).then((fotos) => {
        if (!fotos.length) return;
        const galeria = document.getElementById("galeria");
        galeria.className = "flex min-h-[390px] items-center justify-center overflow-hidden rounded-xl bg-white";
        galeria.innerHTML = `<img src="${URL.createObjectURL(fotos[0])}" alt="${T.escapar(aviso.title)}" class="max-h-[500px] w-full rounded-xl object-contain">`;
        document.getElementById("miniaturas").innerHTML = fotos.map((foto, index) => `<img src="${URL.createObjectURL(foto)}" alt="Fotografía ${index + 1}" class="h-20 w-20 rounded-lg border border-[#E8DFD8] object-cover">`).join("");
    }).catch(() => {});
}());
