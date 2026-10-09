export function iniciarRecuperarContrasena() {
function mostrarPaso(numero) {
            [1, 2, 3].forEach(function (paso) {
                document.getElementById("paso" + paso).classList.toggle("hidden", paso !== numero);
                const barra = document.getElementById("barra" + paso);
                barra.classList.toggle("border-[#C1562E]", paso === numero);
                barra.classList.toggle("text-[#C1562E]", paso === numero);
                barra.classList.toggle("font-bold", paso === numero);
                barra.classList.toggle("border-[#E8DFD8]", paso !== numero);
            });
        }

        document.getElementById("correoForm").addEventListener("submit", function (event) {
            event.preventDefault();
            const correo = document.getElementById("correo").value.trim();
            const valido = /^[^\s@]+@aloe\.ulima\.edu\.pe$/i.test(correo);
            document.getElementById("errorCorreo").classList.toggle("hidden", valido);
            if (!valido) return;
            document.getElementById("correoEnviado").textContent = correo;
            mostrarPaso(2);
        });

        document.getElementById("abrirEnlace").addEventListener("click", function () { mostrarPaso(3); });
        document.getElementById("mostrarClave").addEventListener("click", function () {
            const campo = document.getElementById("nuevaClave");
            const visible = campo.type === "text";
            campo.type = visible ? "password" : "text";
            this.textContent = visible ? "Mostrar" : "Ocultar";
        });

        document.getElementById("nuevaClaveForm").addEventListener("submit", function (event) {
            event.preventDefault();
            const clave = document.getElementById("nuevaClave").value;
            const repetida = document.getElementById("repetirClave").value;
            const valido = clave.length >= 8 && /[A-Z]/.test(clave) && /\d/.test(clave) && clave === repetida;
            document.getElementById("errorClave").classList.toggle("hidden", valido);
            if (!valido) return;
            document.getElementById("paso3").classList.add("hidden");
            document.getElementById("pasoFinal").classList.remove("hidden");
        });
}
