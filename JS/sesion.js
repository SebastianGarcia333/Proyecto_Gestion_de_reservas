(function () {
    const CLAVE_SESION = "pasionViajera_sesion";
    const entrar = document.querySelector("a.btn-sesion");
    const menu = document.querySelector(".menu-cuenta");
    const resumen = menu.querySelector("summary");

    function obtenerSesion() {
        try {
            const sesion = JSON.parse(localStorage.getItem(CLAVE_SESION));
            if (typeof sesion?.nombre !== "string" || !sesion.nombre.trim() ||
                typeof sesion.correo !== "string" || !sesion.correo.trim()) return null;
            return sesion;
        } catch {
            return null;
        }
    }

    function actualizarMenu() {
        const sesion = obtenerSesion();
        entrar.hidden = Boolean(sesion);
        menu.hidden = !sesion;
        menu.open = false;
        menu.querySelector(".nombre-corto").textContent = sesion ? sesion.nombre.trim().split(/\s+/)[0] : "";
        menu.querySelector(".nombre-cuenta").textContent = sesion?.nombre || "";
        document.dispatchEvent(new Event("cambioDeSesion"));
    }

    menu.querySelector(".cerrar-sesion").addEventListener("click", () => {
        localStorage.removeItem(CLAVE_SESION);
        actualizarMenu();
        entrar.focus();
    });
    document.addEventListener("click", (evento) => {
        if (menu.open && !menu.contains(evento.target)) menu.open = false;
    });
    document.addEventListener("keydown", (evento) => {
        if (menu.open && evento.key === "Escape") {
            menu.open = false;
            resumen.focus();
        }
    });

    // Si el viajero sale en otra pestaña, también se actualiza Contáctanos.
    window.addEventListener("storage", (evento) => {
        if (evento.key === CLAVE_SESION || evento.key === null) actualizarMenu();
    });
    window.addEventListener("pageshow", (evento) => {
        if (evento.persisted) actualizarMenu();
    });
    window.sesionActual = obtenerSesion;
    actualizarMenu();
})();
