// Inicio de sesión: valida el formulario y compara con las cuentas de registro.js
(function () {
    const CLAVE_USUARIOS = "pasionViajera_usuarios"; // la misma que usa registro.js
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

    function leerUsuarios() {
        try {
            const usuarios = JSON.parse(localStorage.getItem(CLAVE_USUARIOS));
            return Array.isArray(usuarios) ? usuarios : [];
        } catch {
            return [];
        }
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
        const usuario = leerUsuarios().find(
            (u) => u.correo === correo && u.contrasena === contrasena
        );

        if (!usuario) {
            mostrarError(campoClave, "Correo o contraseña incorrectos.");
            campoClave.focus();
            return;
        }

        // 4. Sesión iniciada: se guarda solo lo necesario
        localStorage.setItem(CLAVE_SESION, JSON.stringify({
            nombre: usuario.nombre,
            correo: usuario.correo
        }));

        alert("¡Inicio de sesión exitoso! Bienvenido/a, " + usuario.nombre.split(" ")[0] + ".");
        window.location.href = "../index.html";
    });

    campoCorreo.addEventListener("input", () => limpiarError(campoCorreo));
    campoClave.addEventListener("input", () => limpiarError(campoClave));
})();