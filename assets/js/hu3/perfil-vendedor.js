export function iniciarPerfilVendedor() {

    const T = window.Tablon;
    const avisos = T.avisos().filter((aviso) => aviso.owner === "rosa.quispe@aloe.ulima.edu.pe");
    document.getElementById("conteo").textContent = `${avisos.filter((aviso) => aviso.status === "Publicado").length} activos · ${avisos.filter((aviso) => aviso.status === "Vendido").length} vendidos`;
    document.getElementById("avisos").innerHTML = avisos.filter((aviso) => aviso.status !== "Borrador").map((aviso) => `<a href="DetalleAviso.html?id=${encodeURIComponent(aviso.id)}" class="overflow-hidden rounded-xl border border-[#E8DFD8] bg-white"><div class="foto-ejemplo h-40"></div><div class="p-4"><h3 class="font-extrabold">${T.escapar(aviso.title)}</h3><p class="mt-2 text-xl font-extrabold">${T.formatoPrecio(aviso.price)}</p><p class="text-sm text-[#7A6A62]">${T.escapar(aviso.condition)} · ${T.escapar(aviso.status)}</p></div></a>`).join("") || `<p class="rounded-xl border border-[#E8DFD8] bg-white p-6 text-[#7A6A62]">No hay avisos publicados.</p>`;

}
