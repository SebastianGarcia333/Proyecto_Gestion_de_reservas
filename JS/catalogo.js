// Las cinco cards originales permanecen en HTML. Solo añadimos las del administrador.
(() => {
    const catalogo = document.getElementById("catalogo");
    const filtros = catalogo.querySelector(".filtros-destinos");
    const botones = filtros.querySelectorAll("[data-filtro]");
    const resultados = document.getElementById("catalogoResultados");
    const vacio = document.getElementById("catalogoVacio");
    const aviso = document.getElementById("catalogoAviso");
    const grid = document.getElementById("destinosGrid");
    const claveDestinos = "pasionViajera.destinos"; // La misma clave que usa crud.js.
    let categoriaActual = "todos";

    function crearCard(d) {
        const tarjeta = document.createElement("article");
        tarjeta.className = "destino-card destino-agregado";
        tarjeta.dataset.categoria = d.categoria;
        // Esta estructura es fija. Los datos del formulario se asignan con textContent.
        tarjeta.innerHTML = '<img class="destino-img" loading="lazy">' +
            '<div class="destino-cuerpo"><p class="destino-categoria"></p>' +
            '<h2></h2><p class="destino-detalle"></p>' +
            '<p class="destino-precio"><small>Desde</small> <span></span></p>' +
            '<a href="contactenos.html" class="btn-destino">Consultar viaje <span aria-hidden="true">→</span></a></div>';
        tarjeta.querySelector("img").src = d.imagen || "../Img/Paisaje.jpg";
        tarjeta.querySelector("img").alt = d.imagen ? "Imagen de " + d.nombre : "Paisaje de viaje";
        tarjeta.querySelector(".destino-categoria").textContent = d.categoria;
        tarjeta.querySelector("h2").textContent = d.nombre;
        tarjeta.querySelector(".destino-detalle").textContent = d.duracion + " días · " + d.descripcion;
        tarjeta.querySelector(".destino-precio span").textContent = "$ " + d.precio.toLocaleString("es-CO");
        return tarjeta;
    }

    function cargarDestinos() {
        try {
            const texto = localStorage.getItem(claveDestinos);
            const guardados = texto === null ? [] : JSON.parse(texto);
            if (!Array.isArray(guardados)) throw new Error("Datos inválidos");
            const nuevos = document.createDocumentFragment();
            const ids = new Set();
            for (const d of guardados) {
                if (!d || typeof d.id !== "string" || !/^D\d{1,12}$/.test(d.id) || ids.has(d.id) ||
                    typeof d.nombre !== "string" || typeof d.descripcion !== "string" ||
                    !["Playa", "Ciudad", "Montaña", "Naturaleza", "Cultura"].includes(d.categoria) ||
                    !Number.isInteger(d.duracion) || d.duracion <= 0 ||
                    !Number.isFinite(d.precio) || d.precio <= 0 ||
                    typeof d.imagen !== "string" ||
                    (d.imagen !== "" && !/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(d.imagen))) {
                    throw new Error("Datos inválidos");
                }
                ids.add(d.id);
                nuevos.append(crearCard(d));
            }
            // Reemplazar solo las agregadas evita duplicados y conserva el HTML original.
            grid.querySelectorAll(".destino-agregado").forEach((tarjeta) => tarjeta.remove());
            grid.append(nuevos);
            aviso.hidden = true;
        } catch {
            aviso.textContent = "No se pudieron cargar los destinos del administrador. Los cinco destinos originales siguen disponibles.";
            aviso.hidden = false;
        }
        filtrar(categoriaActual);
    }

    function filtrar(categoria) {
        categoriaActual = categoria;
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
    cargarDestinos();

    window.addEventListener("storage", (evento) => {
        if (evento.key === claveDestinos || evento.key === null) cargarDestinos();
    });
    window.addEventListener("pageshow", (evento) => {
        if (evento.persisted) cargarDestinos();
    });
})();
