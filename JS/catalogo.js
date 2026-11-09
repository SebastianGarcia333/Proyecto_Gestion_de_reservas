// Filtrado visual del catálogo. La persistencia se añadirá en la rama develop.
(() => {
    const catalogo = document.getElementById("catalogo");
    const filtros = catalogo.querySelector(".filtros-destinos");
    const botones = filtros.querySelectorAll("[data-filtro]");
    const resultados = document.getElementById("catalogoResultados");
    const vacio = document.getElementById("catalogoVacio");

    function filtrar(categoria) {
        let cantidad = 0;

        catalogo.querySelectorAll(".destino-card").forEach((tarjeta) => {
            const visible = categoria === "todos" || tarjeta.dataset.categoria === categoria;
            tarjeta.hidden = !visible;
            if (visible) cantidad++;
        });

        botones.forEach((boton) => {
            const seleccionado = boton.dataset.filtro === categoria;
            boton.setAttribute("aria-pressed", String(seleccionado));
            boton.classList.toggle("activo", seleccionado);
        });

        const detalle = categoria === "todos" ? "para descubrir" : `de ${categoria.toLowerCase()}`;
        resultados.textContent = `${cantidad} ${cantidad === 1 ? "destino" : "destinos"} ${detalle}`;
        vacio.hidden = cantidad > 0;
    }

    botones.forEach((boton) => {
        boton.addEventListener("click", () => filtrar(boton.dataset.filtro));
    });

    document.getElementById("catalogoVerTodos").addEventListener("click", () => {
        filtrar("todos");
        // El botón del estado vacío desaparece: devolver el foco a un control visible.
        botones[0].focus();
    });

    filtros.hidden = false;
    filtrar("todos");
})();
