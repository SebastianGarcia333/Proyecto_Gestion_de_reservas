// Inicio de sesión: valida el formulario y compara con las cuentas de registro.js
(function () {
    const CLAVE_SESION = "pasionViajera_sesion";
    const form = document.getElementById("formLogin");
    if (!form) return;

    const campoCorreo = document.getElementById("correoLogin");
    const campoClave = document.getElementById("contrasenaLogin");

    function mostrarError(campo, mensaje) {
        campo.setAttribute("aria-invalid", "true");
        document.getElementById("error-" + campo.id).textContent = mensaje;
    }

    function limpiarError(campo) {
        campo.removeAttribute("aria-invalid");
        document.getElementById("error-" + campo.id).textContent = "";
    }

    form.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const correo = campoCorreo.value.trim().toLowerCase();
        const contrasena = campoClave.value;
        let primerError = null;

        limpiarError(campoCorreo);
        limpiarError(campoClave);

        // 1. Campos vacíos
        if (correo === "") {
            mostrarError(campoCorreo, "Escribe tu correo.");
            primerError = campoCorreo;
        }
        if (contrasena === "") {
            mostrarError(campoClave, "Escribe tu contraseña.");
            primerError = primerError || campoClave;
        }
        if (primerError) {
            primerError.focus();
            return;
        }

        // 2. Formato del correo
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
            mostrarError(campoCorreo, "Escribe un correo válido.");
            campoCorreo.focus();
            return;
        }

        // 3. Autenticación contra los usuarios guardados
        let usuario;
        try {
            usuario = obtenerUsuarios().find(
                (cuenta) => cuenta.correo.trim().toLowerCase() === correo && cuenta.contrasena === contrasena
            );
        } catch {
            mostrarError(campoCorreo, "No pudimos leer las cuentas guardadas en este navegador.");
            campoCorreo.focus();
            return;
        }

        if (!usuario) {
            mostrarError(campoClave, "Correo o contraseña incorrectos.");
            campoClave.focus();
            return;
        }

        // 4. Sesión iniciada: se guarda solo lo necesario
        try {
            localStorage.setItem(CLAVE_SESION, JSON.stringify({ nombre: usuario.nombre, correo }));
        } catch {
            mostrarError(campoCorreo, "No pudimos guardar tu sesión en este navegador.");
            campoCorreo.focus();
            return;
        }

        // Inicio consume esta marca al llegar, así el saludo no se repite al recargar.
        window.location.href = "../index.html#sesion-iniciada";
    });

    campoCorreo.addEventListener("input", () => limpiarError(campoCorreo));
    campoClave.addEventListener("input", () => limpiarError(campoClave));
})();
