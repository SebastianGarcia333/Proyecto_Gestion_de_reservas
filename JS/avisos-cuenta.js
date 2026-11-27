const mostrarAvisoCuenta = (() => {
    const aviso = document.querySelector(".aviso-cuenta");
    const anuncio = document.getElementById("anuncioCuenta");
    const cerrar = aviso.querySelector(".cerrar-aviso");
    let temporizador;
    let focoDeRegreso;

    function ocultar() {
        clearTimeout(temporizador);
        if (aviso.contains(document.activeElement)) focoDeRegreso?.focus();
        aviso.hidden = true;
        anuncio.textContent = "";
    }

    function programarCierre() {
        clearTimeout(temporizador);
        if (aviso.hidden || aviso.matches(":hover, :focus-within")) return;
        temporizador = setTimeout(ocultar, 6000);
    }

    // Dejamos leer el mensaje mientras el puntero o el foco estén sobre el aviso.
    aviso.addEventListener("pointerenter", () => clearTimeout(temporizador));
    aviso.addEventListener("pointerleave", programarCierre);
    aviso.addEventListener("focusin", () => clearTimeout(temporizador));
    aviso.addEventListener("focusout", () => setTimeout(programarCierre, 0));
    cerrar.addEventListener("click", ocultar);
    window.addEventListener("pagehide", ocultar);

    return function (titulo, detalle, siguienteControl) {
        aviso.querySelector(".aviso-titulo").textContent = titulo;
        aviso.querySelector(".aviso-detalle").textContent = detalle;
        focoDeRegreso = siguienteControl;
        aviso.hidden = false;
        anuncio.textContent = titulo + ". " + detalle;
        programarCierre();
    };
})();

if (location.hash === "#sesion-iniciada" && !document.getElementById("formLogin")) {
    history.replaceState(history.state, "", location.pathname + location.search);
    const sesion = window.sesionActual();
    if (sesion) {
        const nombre = sesion.nombre.trim().split(/\s+/)[0];
        mostrarAvisoCuenta("Sesión iniciada", "Hola, " + nombre + ".", document.querySelector(".menu-cuenta summary"));
    }
}
