// Mi viaje usa su propia clave; no guardamos la selección en la colección del administrador.
(() => {
    const claveCarrito = "pasionViajera.carrito";
    const claveDestinos = "pasionViajera.destinos";
    const maximoPersonas = 9;
    const panel = document.getElementById("panelViaje");
    const imagenPredeterminada = new URL("../Img/Paisaje.jpg", document.currentScript.src).href;
    let carrito = [];
    let mensajeActual = "";
    let mensajeEsError = false;
    let botonOrigen = null;

    function obtener(id) {
        return document.getElementById(id);
    }

    function formatoPrecio(numero) {
        return "$ " + numero.toLocaleString("es-CO", { maximumFractionDigits: 2 });
    }

    // El aviso se muestra donde estamos trabajando: dentro del panel o debajo del header.
    function mostrarAviso(texto, esError = false) {
        mensajeActual = texto;
        mensajeEsError = esError;
        const panelAbierto = panel && panel.matches(".show, .showing");
        document.querySelectorAll("[data-aviso-carrito]").forEach((aviso) => {
            const dentroDelPanel = panel && panel.contains(aviso);
            aviso.hidden = texto === "" || Boolean(dentroDelPanel) !== Boolean(panelAbierto);
            aviso.textContent = texto;
            aviso.dataset.error = String(esError);
            aviso.setAttribute("role", esError ? "alert" : "status");
        });
    }

    function fechaValida(fecha) {
        if (fecha === "") return true;
        if (typeof fecha !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return false;
        const dia = new Date(fecha + "T00:00:00Z");
        return !Number.isNaN(dia.getTime()) && dia.toISOString().slice(0, 10) === fecha;
    }

    function imagenValida(imagen) {
        if (imagen === "") return true;
        if (typeof imagen !== "string") return false;
        try {
            const url = new URL(imagen);
            return url.protocol === "https:" || url.protocol === "http:";
        } catch {
            return false;
        }
    }

    // Una fecha antigua sigue siendo legible. No borramos un viaje porque hayan pasado los días.
    function destinoValido(d) {
        return d && typeof d.id === "string" &&
            /^(san-andres|la-guajira|santa-marta|cartagena|eje-cafetero|D\d{1,12})$/.test(d.id) &&
            typeof d.nombre === "string" && d.nombre.trim() !== "" &&
            typeof d.descripcion === "string" &&
            ["Playa", "Ciudad", "Montaña", "Naturaleza", "Cultura"].includes(d.categoria) &&
            Number.isInteger(d.duracion) && d.duracion > 0 &&
            Number.isFinite(d.precio) && d.precio > 0 && imagenValida(d.imagen) &&
            Number.isInteger(d.personas) && d.personas >= 1 && d.personas <= maximoPersonas &&
            fechaValida(d.fecha);
    }

    function cargarCarrito() {
        try {
            const texto = localStorage.getItem(claveCarrito);
            const guardados = texto === null ? [] : JSON.parse(texto);
            if (!Array.isArray(guardados)) throw new Error("Selección inválida");
            const ids = new Set();
            let total = 0;
            for (const d of guardados) {
                if (!destinoValido(d) || ids.has(d.id)) throw new Error("Destino inválido");
                ids.add(d.id);
                total += d.precio * d.personas;
            }
            if (!Number.isFinite(total)) throw new Error("Total inválido");
            carrito = guardados;
            mostrarAviso("");
            return true;
        } catch {
            mostrarAviso("No se pudo leer tu viaje guardado. Revisa el almacenamiento del navegador; los datos no se han reemplazado.", true);
            return false;
        }
    }

    // Primero guardamos. Si el navegador lo rechaza, la selección que se ve no cambia.
    function guardarCarrito(nuevoCarrito) {
        let total = 0;
        for (const d of nuevoCarrito) total += d.precio * d.personas;
        if (!Number.isFinite(total)) {
            mostrarAviso("El importe de este viaje es demasiado grande. Revisa el precio del destino.", true);
            return false;
        }
        try {
            localStorage.setItem(claveCarrito, JSON.stringify(nuevoCarrito));
            carrito = nuevoCarrito;
            dibujarCarrito();
            return true;
        } catch {
            mostrarAviso("No se pudo guardar tu cambio. El almacenamiento está lleno o bloqueado; tu selección anterior se conserva.", true);
            return false;
        }
    }

    function buscarIndice(id) {
        return carrito.findIndex((destino) => destino.id === id);
    }

    // Las fotos subidas ya están guardadas por crud.js. Leerlas aquí evita duplicar su tamaño.
    function cargarImagenesAdministrador() {
        const imagenes = {};
        try {
            const guardados = JSON.parse(localStorage.getItem(claveDestinos) || "[]");
            if (Array.isArray(guardados)) {
                for (const d of guardados) {
                    if (d && /^D\d{1,12}$/.test(d.id) && typeof d.imagen === "string" &&
                        /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(d.imagen)) {
                        imagenes[d.id] = d.imagen;
                    }
                }
            }
        } catch {
            // Si esa colección no se puede leer, la reserva conserva sus datos y usa la foto de respaldo.
        }
        return imagenes;
    }

    function crearItem(d, esPagina, imagenes) {
        const item = document.createElement("li");
        item.className = "viaje-item";
        item.dataset.id = d.id;
        const informacion = '<img class="viaje-item-imagen" loading="lazy">' +
            '<div class="viaje-item-info"><p class="viaje-item-meta"></p><h3></h3>' +
            '<p class="viaje-item-descripcion"></p><p class="viaje-item-precio"></p></div>';
        // Las etiquetas son fijas; los textos del administrador se asignan debajo con textContent.
        item.innerHTML = (esPagina ? informacion : '<div class="viaje-item-cabecera">' + informacion + '</div>') +
            '<div class="viaje-item-controles"><div class="campo-viaje">' +
            '<span class="campo-viaje-etiqueta">Personas</span><div class="selector-cantidad" role="group">' +
            '<button type="button" data-accion="restar">−</button><output></output>' +
            '<button type="button" data-accion="sumar">+</button></div></div>' +
            '<div class="campo-viaje"><label class="campo-viaje-etiqueta">Fecha de salida</label>' +
            '<input type="date" class="campo-viaje-fecha"></div></div>' +
            '<div class="viaje-item-pie"><button type="button" class="viaje-item-quitar" data-accion="eliminar">Quitar del viaje</button>' +
            '<p class="viaje-item-subtotal"><span>Subtotal</span><strong></strong></p></div>';

        const foto = item.querySelector("img");
        foto.src = imagenes[d.id] || d.imagen || imagenPredeterminada;
        foto.alt = "Imagen de " + d.nombre;
        foto.width = esPagina ? 130 : 76;
        foto.height = esPagina ? 190 : 92;
        foto.addEventListener("error", () => { foto.src = imagenPredeterminada; }, { once: true });
        item.querySelector(".viaje-item-meta").textContent = d.categoria + " · " + d.duracion + " días";
        item.querySelector("h3").textContent = d.nombre;
        item.querySelector(".viaje-item-descripcion").textContent = d.descripcion;
        const precio = item.querySelector(".viaje-item-precio");
        precio.textContent = formatoPrecio(d.precio) + " ";
        const unidad = document.createElement("span");
        unidad.textContent = "/ persona";
        precio.append(unidad);
        item.querySelector(".viaje-item-subtotal strong").textContent = formatoPrecio(d.precio * d.personas);

        const prefijo = esPagina ? "reserva" : "panel";
        const etiqueta = item.querySelector("span.campo-viaje-etiqueta");
        etiqueta.id = prefijo + "-personas-" + d.id;
        item.querySelector(".selector-cantidad").setAttribute("aria-labelledby", etiqueta.id);
        item.querySelector("output").textContent = d.personas;
        item.querySelector("output").setAttribute("aria-label", "Personas en " + d.nombre);
        const restar = item.querySelector('[data-accion="restar"]');
        const sumar = item.querySelector('[data-accion="sumar"]');
        restar.disabled = d.personas === 1;
        sumar.disabled = d.personas === maximoPersonas;
        restar.setAttribute("aria-label", "Quitar una persona de " + d.nombre);
        sumar.setAttribute("aria-label", "Agregar una persona a " + d.nombre);
        item.querySelector('[data-accion="eliminar"]').setAttribute("aria-label", "Quitar " + d.nombre + " del viaje");
        const fecha = item.querySelector("input");
        fecha.id = prefijo + "-fecha-" + d.id;
        fecha.value = d.fecha;
        item.querySelector("label").htmlFor = fecha.id;
        return item;
    }

    function dibujarCarrito() {
        const imagenes = cargarImagenesAdministrador();
        let personas = 0;
        let total = 0;
        for (const d of carrito) {
            personas += d.personas;
            total += d.precio * d.personas;
        }
        const resumen = carrito.length + (carrito.length === 1 ? " destino · " : " destinos · ") +
            personas + (personas === 1 ? " viajero" : " viajeros");
        const vacio = carrito.length === 0;
        obtener("contadorViaje").textContent = carrito.length;
        obtener("contadorViaje").hidden = vacio;
        for (const id of ["panelResumen", "cantidadReserva", "resumenCantidadReserva"]) {
            if (obtener(id)) obtener(id).textContent = resumen;
        }
        for (const id of ["viajeTotal", "totalReserva"]) {
            if (obtener(id)) obtener(id).textContent = formatoPrecio(total);
        }
        for (const id of ["listaViaje", "listaReserva"]) {
            const lista = obtener(id);
            if (!lista) continue;
            const nuevos = document.createDocumentFragment();
            for (const d of carrito) nuevos.append(crearItem(d, id === "listaReserva", imagenes));
            lista.replaceChildren(nuevos);
        }
        if (obtener("viajeVacio")) obtener("viajeVacio").hidden = !vacio;
        if (obtener("pieViaje")) obtener("pieViaje").hidden = vacio;
        if (obtener("contenidoReserva")) obtener("contenidoReserva").hidden = vacio;
        if (obtener("reservaVacia")) obtener("reservaVacia").hidden = !vacio;
        const desglose = obtener("desgloseReserva");
        if (desglose) {
            const filas = document.createDocumentFragment();
            for (const d of carrito) {
                const fila = document.createElement("div");
                const nombre = document.createElement("dt");
                const importe = document.createElement("dd");
                nombre.textContent = d.nombre + " × " + d.personas + (d.personas === 1 ? " persona" : " personas");
                importe.textContent = formatoPrecio(d.precio * d.personas);
                fila.append(nombre, importe);
                filas.append(fila);
            }
            desglose.replaceChildren(filas);
        }
        document.querySelectorAll(".btn-agregar").forEach((boton) => {
            const indice = buscarIndice(boton.dataset.id);
            boton.classList.toggle("agregado", indice !== -1);
            boton.disabled = indice !== -1 && carrito[indice].personas === maximoPersonas;
            boton.textContent = boton.disabled ? "Máximo de 9 personas" :
                indice !== -1 ? "Agregar otra persona +" : "Agregar a mi viaje +";
            boton.setAttribute("aria-label", boton.textContent + ": " + boton.dataset.nombre);
        });
    }

    function refrescarCarrito() {
        if (cargarCarrito()) dibujarCarrito();
    }

    function agregarDestino(boton) {
        // Volvemos a leer antes de cambiar, para incluir lo que se haya agregado en otra pestaña.
        if (!cargarCarrito()) return;
        const tarjeta = boton.closest(".destino-card");
        const destino = {
            id: boton.dataset.id,
            nombre: boton.dataset.nombre,
            precio: Number(boton.dataset.precio),
            duracion: Number(boton.dataset.dias),
            categoria: tarjeta.querySelector(".destino-categoria").textContent.trim(),
            descripcion: tarjeta.querySelector(".destino-detalle").textContent.split(" · ").slice(1).join(" · "),
            imagen: tarjeta.classList.contains("destino-agregado") ? "" : tarjeta.querySelector("img").src,
            personas: 1,
            fecha: ""
        };
        if (!destinoValido(destino)) {
            mostrarAviso("Este destino tiene datos incompletos. Revisa su información antes de agregarlo.", true);
            return;
        }
        const indice = buscarIndice(destino.id);
        const nuevos = carrito.slice();
        if (indice === -1) {
            nuevos.push(destino);
        } else {
            if (carrito[indice].personas === maximoPersonas) {
                dibujarCarrito();
                mostrarAviso("Puedes seleccionar hasta 9 personas por destino.", true);
                return;
            }
            // Repetir el destino suma una persona y conserva la fecha que ya escogimos.
            nuevos[indice] = { ...destino, personas: carrito[indice].personas + 1, fecha: carrito[indice].fecha };
        }
        if (!guardarCarrito(nuevos)) return;
        if (panel && typeof bootstrap !== "undefined") {
            botonOrigen = boton;
            bootstrap.Offcanvas.getOrCreateInstance(panel).show();
        }
        mostrarAviso(destino.nombre + " se agregó a tu viaje.");
    }

    function enfocarControl(listaId, id, accion) {
        const lista = obtener(listaId);
        const item = lista.querySelector('[data-id="' + id + '"]');
        if (!item) {
            const siguiente = lista.querySelector('[data-accion="eliminar"]') ||
                obtener(listaId === "listaReserva" ? "reservaVacia" : "viajeVacio").querySelector("a");
            siguiente.focus();
            return;
        }
        let control = accion === "fecha" ? item.querySelector("input") : item.querySelector('[data-accion="' + accion + '"]');
        // Al llegar al límite, el botón pulsado se desactiva. Dejamos el foco en el que permite volver.
        if (control.disabled) control = item.querySelector('[data-accion="' + (accion === "sumar" ? "restar" : "sumar") + '"]');
        control.focus({ preventScroll: true });
    }

    function cambiarItem(elemento, accion) {
        const id = elemento.closest(".viaje-item").dataset.id;
        const listaId = elemento.closest("ul").id;
        const fechaElegida = accion === "fecha" ? elemento.value : "";
        if (!cargarCarrito()) return;
        const indice = buscarIndice(id);
        if (indice === -1) {
            dibujarCarrito();
            enfocarControl(listaId, id, accion);
            return;
        }
        const nuevos = carrito.slice();
        let mensaje = "";
        if (accion === "eliminar") {
            nuevos.splice(indice, 1);
            mensaje = carrito[indice].nombre + " se quitó de tu viaje.";
        } else if (accion === "fecha") {
            if (!fechaValida(fechaElegida)) {
                mostrarAviso("Escoge una fecha válida o deja el campo vacío.", true);
                return;
            }
            nuevos[indice] = { ...carrito[indice], fecha: fechaElegida };
            mensaje = fechaElegida ? "Fecha de salida guardada." : "Fecha de salida quitada.";
        } else {
            const personas = carrito[indice].personas + (accion === "sumar" ? 1 : -1);
            if (personas < 1 || personas > maximoPersonas) {
                dibujarCarrito();
                enfocarControl(listaId, id, accion);
                return;
            }
            nuevos[indice] = { ...carrito[indice], personas };
            mensaje = "Personas y total actualizados.";
        }
        if (guardarCarrito(nuevos)) mostrarAviso(mensaje);
        else dibujarCarrito();
        enfocarControl(listaId, id, accion);
    }

    function vaciarCarrito(desdePagina) {
        if (!cargarCarrito() || carrito.length === 0) return;
        if (!confirm("¿Quitar todos los destinos de tu viaje?")) return;
        if (!guardarCarrito([])) return;
        mostrarAviso("Tu viaje quedó vacío. Puedes explorar otros destinos.");
        obtener(desdePagina ? "reservaVacia" : "viajeVacio").querySelector("a").focus();
    }

    // Escuchamos en el documento porque el catálogo también crea cards después de cargar la página.
    document.addEventListener("click", (evento) => {
        const agregar = evento.target.closest(".btn-agregar");
        if (agregar) { agregarDestino(agregar); return; }
        const accion = evento.target.closest(".viaje-item [data-accion]");
        if (accion) { cambiarItem(accion, accion.dataset.accion); return; }
        if (evento.target.closest("#vaciarViaje")) vaciarCarrito(false);
        if (evento.target.closest("#vaciarReserva")) vaciarCarrito(true);
    });
    document.addEventListener("change", (evento) => {
        if (evento.target.matches(".campo-viaje-fecha")) cambiarItem(evento.target, "fecha");
    });

    if (panel) {
        panel.addEventListener("show.bs.offcanvas", refrescarCarrito);
        panel.addEventListener("shown.bs.offcanvas", () => mostrarAviso(mensajeActual, mensajeEsError));
        panel.addEventListener("hidden.bs.offcanvas", () => {
            mostrarAviso(mensajeEsError ? mensajeActual : "", mensajeEsError);
            if (botonOrigen) {
                const volver = botonOrigen.disabled ? document.querySelector("header .boton-viaje") : botonOrigen;
                if (document.contains(volver)) volver.focus({ preventScroll: true });
                botonOrigen = null;
            }
        });
    }
    window.addEventListener("storage", (evento) => {
        if (evento.key === claveCarrito || evento.key === claveDestinos || evento.key === null) refrescarCarrito();
    });
    window.addEventListener("pageshow", (evento) => {
        if (evento.persisted) refrescarCarrito();
    });

    refrescarCarrito();
})();
