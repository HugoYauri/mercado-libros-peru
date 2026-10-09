export function iniciarRegistro() {
const correo = document.getElementById("correo");
        const contrasena = document.getElementById("contrasena");
        const confirmar = document.getElementById("confirmar");

        function marcarCampo(campo, valido) {
            campo.style.borderColor = valido ? "#2E7D5B" : "#B4322B";
        }

        function validarFormulario() {
            const correoValido = /^[^\s@]+@aloe\.ulima\.edu\.pe$/i.test(correo.value.trim());
            const claveValida = contrasena.value.length >= 8 && /[A-Z]/.test(contrasena.value) && /\d/.test(contrasena.value);
            const coincide = confirmar.value !== "" && confirmar.value === contrasena.value;
            marcarCampo(correo, correoValido);
            marcarCampo(contrasena, claveValida);
            marcarCampo(confirmar, coincide);
            document.getElementById("errorCorreo").classList.toggle("hidden", correoValido);
            document.getElementById("errorConfirmar").classList.toggle("hidden", coincide);
            const ayuda = document.getElementById("ayudaContrasena");
            ayuda.textContent = claveValida ? "Cumple los 8 caracteres, una mayúscula y un número." : "Mínimo 8 caracteres, una mayúscula y un número.";
            ayuda.className = "mt-1 text-sm " + (claveValida ? "text-[#2E7D5B]" : "text-[#B4322B]");

            const errores = [!correoValido, !claveValida, !coincide].filter(Boolean).length;
            const resumen = document.getElementById("resumenErrores");
            resumen.classList.toggle("hidden", errores === 0);
            document.getElementById("cantidadErrores").textContent = `Revisa ${errores} ${errores === 1 ? "campo" : "campos"}.`;
            return errores === 0;
        }

        [correo, contrasena, confirmar].forEach(function (campo) { campo.addEventListener("input", validarFormulario); });
        validarFormulario();

        document.getElementById("registroForm").addEventListener("submit", function (event) {
            event.preventDefault();
            const datosCompletos = document.getElementById("nombres").value.trim() && document.getElementById("apellidos").value.trim();
            if (!validarFormulario() || !datosCompletos || !document.getElementById("normas").checked) {
                if (!datosCompletos) alert("Completa tus nombres y apellidos.");
                if (!document.getElementById("normas").checked) alert("Debes aceptar las normas para crear tu cuenta.");
                return;
            }
            const usuario = {
                nombres: document.getElementById("nombres").value.trim(),
                apellidos: document.getElementById("apellidos").value.trim(),
                correo: correo.value.trim(),
                carrera: document.getElementById("carrera").value,
                ciclo: document.getElementById("ciclo").value
            };
            localStorage.setItem("usuarioDemo", JSON.stringify(usuario));
            document.getElementById("correoConfirmacion").textContent = usuario.correo;
            document.getElementById("modalExito").classList.replace("hidden", "flex");
        });

        document.getElementById("reenviar").addEventListener("click", function () { document.getElementById("mensajeReenvio").classList.remove("hidden"); });
}
