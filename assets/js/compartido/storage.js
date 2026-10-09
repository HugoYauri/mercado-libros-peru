(function () {
    const CLAVE_AVISOS = "tablon_avisos_v1";
    const CLAVE_FAVORITOS = "tablon_favoritos_v1";
    const CLAVE_USUARIO = "usuarioDemo";
    const CLAVE_SESION = "correoDemo";

    const avisosIniciales = window.TABLON_AVISOS_INICIALES || [];

    function leer(clave, alternativa) {
        try {
            const valor = localStorage.getItem(clave);
            return valor ? JSON.parse(valor) : alternativa;
        } catch (error) {
            return alternativa;
        }
    }

    function guardar(clave, valor) {
        localStorage.setItem(clave, JSON.stringify(valor));
    }

    function avisos() {
        const valor = leer(CLAVE_AVISOS, null);
        if (Array.isArray(valor)) return valor;
        guardar(CLAVE_AVISOS, avisosIniciales);
        return avisosIniciales.slice();
    }

    function guardarAvisos(lista) { guardar(CLAVE_AVISOS, lista); }
    function obtenerAviso(id) { return avisos().find((aviso) => aviso.id === id); }
    function guardarAviso(aviso) {
        const lista = avisos();
        const indice = lista.findIndex((item) => item.id === aviso.id);
        if (indice < 0) lista.unshift(aviso); else lista[indice] = aviso;
        guardarAvisos(lista);
    }
    function usuarioActivo() {
        const correo = sessionStorage.getItem(CLAVE_SESION);
        return correo ? (leer(CLAVE_USUARIO, null) || { correo, nombres: "Rosa María", apellidos: "Quispe Ríos", carrera: "Administración", ciclo: "Cuarto" }) : null;
    }
    function correoActivo() {
        const sesion = sessionStorage.getItem(CLAVE_SESION);
        if (sesion) return sesion;
        return (leer(CLAVE_USUARIO, null) || {}).correo || "rosa.quispe@aloe.ulima.edu.pe";
    }
    function favoritos() { return leer(CLAVE_FAVORITOS, []); }
    function alternarFavorito(id) {
        const lista = favoritos();
        const nueva = lista.includes(id) ? lista.filter((item) => item !== id) : [...lista, id];
        guardar(CLAVE_FAVORITOS, nueva);
        return nueva.includes(id);
    }
    function esFavorito(id) { return favoritos().includes(id); }
    function formatoPrecio(precio) { return `S/ ${Number(precio).toFixed(2)}`; }
    function escapar(texto) {
        return String(texto ?? "").replace(/[&<>"']/g, (caracter) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[caracter]);
    }

    window.Tablon = { avisos, guardarAvisos, obtenerAviso, guardarAviso, usuarioActivo, correoActivo, favoritos, alternarFavorito, esFavorito, formatoPrecio, escapar };
}());
