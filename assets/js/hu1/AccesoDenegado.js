export function iniciarAccesoDenegado() {
document.getElementById("buscarForm").addEventListener("submit", function (event) { event.preventDefault(); window.location.href = "../HU3_Catalogo/Catalogo.html"; });
}
