(function () {
    const T = window.Tablon;
    const formulario = document.getElementById("avisoForm");
    const parametros = new URLSearchParams(location.search);
    const idExistente = parametros.get("id");
    let archivosSeleccionados = [];
    let avisoActual = idExistente ? T.obtenerAviso(idExistente) : null;

    const campos = { title: document.getElementById("titulo"), description: document.getElementById("descripcion"), category: document.getElementById("categoria"), course: document.getElementById("curso"), price: document.getElementById("precio"), minimum: document.getElementById("minimo") };

    if (avisoActual) {
        campos.title.value = avisoActual.title;
        campos.description.value = avisoActual.description;
        campos.category.value = avisoActual.category;
        campos.course.value = avisoActual.course;
        campos.price.value = avisoActual.price;
        campos.minimum.value = avisoActual.minimum;
        const radio = document.querySelector(`[name="condicion"][value="${CSS.escape(avisoActual.condition)}"]`);
        if (radio) radio.checked = true;
        document.getElementById("editarFotos").classList.remove("hidden");
        document.getElementById("editarFotos").href = `FotografiasAviso.html?id=${encodeURIComponent(avisoActual.id)}`;
    }

    function actualizarVista() {
        document.getElementById("prevTitulo").textContent = campos.title.value || "Título del aviso";
        document.getElementById("prevPrecio").textContent = T.formatoPrecio(campos.price.value || 0);
        const condicion = document.querySelector('[name="condicion"]:checked').value;
        document.getElementById("prevMeta").textContent = `${condicion} · ${campos.course.value || "Curso asociado"}`;
    }
    formulario.addEventListener("input", actualizarVista);
    formulario.addEventListener("change", actualizarVista);

    document.getElementById("fotos").addEventListener("change", (event) => {
        archivosSeleccionados = Array.from(event.target.files || []);
        const validos = archivosSeleccionados.filter((file) => ["image/jpeg", "image/png"].includes(file.type) && file.size <= 5 * 1024 * 1024);
        if (validos.length !== archivosSeleccionados.length || validos.length > 6) {
            document.getElementById("errores").textContent = "Elige hasta 6 fotografías JPG o PNG de máximo 5 MB cada una.";
            document.getElementById("errores").classList.remove("hidden");
            archivosSeleccionados = validos.slice(0, 6);
        } else document.getElementById("errores").classList.add("hidden");
        const contenedor = document.getElementById("previsualizacion");
        contenedor.innerHTML = "";
        archivosSeleccionados.forEach((file, index) => {
            const imagen = document.createElement("img");
            imagen.src = URL.createObjectURL(file);
            imagen.alt = `Fotografía ${index + 1}: ${file.name}`;
            imagen.className = "h-20 w-20 rounded-lg border border-[#E8DFD8] object-cover";
            contenedor.appendChild(imagen);
        });
        if (archivosSeleccionados[0]) {
            const principal = document.getElementById("fotoPrincipal");
            principal.innerHTML = "";
            principal.classList.remove("foto-ejemplo");
            const imagen = document.createElement("img");
            imagen.src = URL.createObjectURL(archivosSeleccionados[0]);
            imagen.alt = "Vista previa del producto";
            imagen.className = "h-full w-full object-cover";
            principal.appendChild(imagen);
        }
    });

    async function guardar(estado) {
        const titulo = campos.title.value.trim();
        const precio = Number(campos.price.value);
        const minimo = Number(campos.minimum.value);
        const errores = [];
        if (estado === "Publicado" && titulo.length < 15) errores.push("El título debe tener al menos 15 caracteres.");
        if (!Number.isFinite(precio) || precio <= 0) errores.push("Ingresa un precio válido.");
        if (!Number.isFinite(minimo) || minimo <= 0 || minimo > precio) errores.push("El mínimo debe ser mayor que cero y no superar el precio pedido.");
        if (estado === "Publicado" && !archivosSeleccionados.length && !avisoActual) errores.push("Agrega al menos una fotografía para publicar.");
        const alerta = document.getElementById("errores");
        if (errores.length) { alerta.textContent = errores.join(" "); alerta.classList.remove("hidden"); return; }
        const aviso = { ...(avisoActual || {}), id: avisoActual?.id || `av-${Date.now()}`, owner: T.correoActivo(), ...Object.fromEntries(Object.entries(campos).map(([key, campo]) => [key, campo.value.trim()])), title: titulo, price: precio, minimum: minimo, condition: document.querySelector('[name="condicion"]:checked').value, status: estado, published: avisoActual?.published || new Date().toLocaleDateString("es-PE") };
        try {
            if (archivosSeleccionados.length) await window.TablonFotos.guardar(aviso.id, archivosSeleccionados);
            T.guardarAviso(aviso);
            window.location.href = "MisPublicaciones.html";
        } catch (error) {
            alerta.textContent = "No se pudieron guardar las fotografías en este navegador. Abre el proyecto desde un servidor estático local y vuelve a intentarlo.";
            alerta.classList.remove("hidden");
        }
    }
    formulario.addEventListener("submit", (event) => { event.preventDefault(); guardar("Publicado"); });
    document.getElementById("borrador").addEventListener("click", () => guardar("Borrador"));
    document.getElementById("buscarForm").addEventListener("submit", (event) => { event.preventDefault(); window.location.href = `../HU3_Catalogo/Catalogo.html?q=${encodeURIComponent(document.getElementById("buscar").value)}`; });
    actualizarVista();
}());
