// El botón del nav pasa a "Cerrar sesión".
(function () {
    const CLAVE_SESION = "pasionViajera_sesion";

    function obtenerSesion() {
        try {
            const sesion = JSON.parse(localStorage.getItem(CLAVE_SESION));
            return sesion && typeof sesion.correo === "string" ? sesion : null;
        } catch {
            return null;
        }
    }

    function cerrarSesion() {
        localStorage.removeItem(CLAVE_SESION);
        window.location.reload();
    }

    // Por si otras partes necesitan saber si hay sesión
    window.sesionActual = obtenerSesion;

    const boton = document.querySelector(".btn-sesion");
    const sesion = obtenerSesion();
    if (!boton || !sesion) return;

    const primerNombre = sesion.nombre.split(" ")[0];
    const texto = boton.querySelector(".btn-sesion-texto");

    boton.classList.add("con-sesion");
    boton.removeAttribute("aria-current");
    boton.setAttribute("href", "#");
    boton.setAttribute("title", "Cerrar sesión de " + primerNombre);
    boton.setAttribute("aria-label", "Cerrar sesión de " + primerNombre);
    if (texto) texto.textContent = primerNombre;

    boton.addEventListener("click", (evento) => {
        evento.preventDefault();
        cerrarSesion();
    });
})();