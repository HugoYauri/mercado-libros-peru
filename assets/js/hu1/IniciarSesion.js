export function iniciarIniciarSesion() {
const contrasena = document.getElementById("contrasena");
        const botonMostrar = document.getElementById("mostrarContrasena");
        let intentos = 0;

        botonMostrar.addEventListener("click", function () {
            const visible = contrasena.type === "text";
            contrasena.type = visible ? "password" : "text";
            botonMostrar.textContent = visible ? "Mostrar" : "Ocultar";
        });

        document.getElementById("loginForm").addEventListener("submit", function (event) {
            event.preventDefault();
            const correo = document.getElementById("correo").value.trim().toLowerCase();
            const clave = contrasena.value;
            const correoValido = /^[^\s@]+@aloe\.ulima\.edu\.pe$/.test(correo);
            const claveValida = clave.length >= 8 && /[A-Z]/.test(clave) && /\d/.test(clave);
            const error = document.getElementById("errorCredenciales");

            if (!correoValido || !claveValida) {
                intentos++;
                document.getElementById("intentosRestantes").textContent = `Te quedan ${Math.max(0, 4 - intentos)} intentos antes del bloqueo temporal.`;
                error.classList.remove("hidden");
                return;
            }

            error.classList.add("hidden");
            const boton = document.getElementById("ingresar");
            boton.disabled = true;
            boton.textContent = "Verificando...";
            sessionStorage.setItem("correoDemo", correo);
            const destino = new URLSearchParams(window.location.search).get("returnTo");
            setTimeout(function () {
                if (destino) {
                    const urlDestino = new URL(destino, window.location.href);
                    window.location.href = urlDestino.origin === window.location.origin ? urlDestino.href : "MiCuenta.html";
                } else window.location.href = "MiCuenta.html";
            }, 500);
        });
}
