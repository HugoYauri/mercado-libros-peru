export function iniciarFotografiasAviso() {

    const id = new URLSearchParams(location.search).get("id");
    const aviso = window.Tablon.obtenerAviso(id);
    const mensaje = document.getElementById("mensaje");
    let archivos = [];
    document.getElementById("avisoTitulo").textContent = aviso ? aviso.title : "Aviso no encontrado";
    document.getElementById("volver").href = aviso ? `NuevoAviso.html?id=${encodeURIComponent(id)}` : "MisPublicaciones.html";
    function mostrar(texto, error) {
        mensaje.textContent = texto;
        mensaje.className = `mt-3 rounded-lg p-3 text-sm ${error ? "border border-[#B4322B] bg-[#F9ECE9] text-[#B4322B]" : "border border-[#2E7D5B] bg-[#E5F4EC] text-[#2E7D5B]"}`;
    }
    async function renderizar() {
        const galeria = document.getElementById("galeria");
        galeria.innerHTML = "";
        if (!id) return;
        try {
            const existentes = await window.TablonFotos.listar(id);
            existentes.forEach((archivo, index) => {
                const url = URL.createObjectURL(archivo);
                const figure = document.createElement("figure");
                figure.className = "overflow-hidden rounded-xl border border-[#E8DFD8] bg-white";
                figure.innerHTML = `<img src="${url}" alt="Fotografía ${index + 1}" class="h-48 w-full object-cover"><figcaption class="flex items-center justify-between p-3 text-sm"><span>${index === 0 ? "Portada" : `Fotografía ${index + 1}`}</span><button data-quitar="${index}" class="font-bold text-[#B4322B]">Quitar</button></figcaption>`;
                galeria.appendChild(figure);
            });
        } catch (error) { mostrar("No se pudo leer la galería. Abre el proyecto desde un servidor estático local.", true); }
    }
    document.getElementById("fotos").addEventListener("change", (event) => {
        archivos = Array.from(event.target.files || []);
        if (archivos.length > 6 || archivos.some((file) => !["image/jpeg", "image/png"].includes(file.type) || file.size > 5 * 1024 * 1024)) {
            mostrar("Selecciona hasta 6 imágenes JPG o PNG de máximo 5 MB cada una.", true);
            archivos = [];
        } else mostrar(`${archivos.length} fotografía(s) lista(s) para guardar.`, false);
    });
    document.getElementById("galeria").addEventListener("click", async (event) => {
        const boton = event.target.closest("[data-quitar]");
        if (!boton) return;
        const existentes = await window.TablonFotos.listar(id);
        const nuevos = existentes.filter((_, index) => index !== Number(boton.dataset.quitar));
        await window.TablonFotos.guardar(id, nuevos);
        renderizar();
    });
    document.getElementById("guardar").addEventListener("click", async () => {
        if (!aviso) return mostrar("No encontramos ese aviso.", true);
        try {
            const anteriores = await window.TablonFotos.listar(id);
            const total = anteriores.length + archivos.length;
            if (total > 6) return mostrar("El aviso admite hasta 6 fotografías. Quita una antes de agregar más.", true);
            await window.TablonFotos.guardar(id, [...anteriores, ...archivos]);
            mostrar("Fotografías guardadas. La primera será la portada.", false);
            archivos = [];
            document.getElementById("fotos").value = "";
            renderizar();
        } catch (error) { mostrar("No se pudieron guardar las fotografías. Inténtalo desde un servidor estático local.", true); }
    });
    renderizar();

}
