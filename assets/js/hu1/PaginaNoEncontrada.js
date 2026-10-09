export function iniciarPaginaNoEncontrada() {
document.getElementById("volver").addEventListener("click", function () { if (history.length > 1) history.back(); else window.location.href = "Landing.html"; });
}
