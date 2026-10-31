// ============================================================
// PASIÓN VIAJERA — Lógica de la página de inicio (JS/inicio.js)
// Buscador de viajes: destino, fecha y número de viajeros.
// Al buscar se filtran las tarjetas de "Destinos populares".
// ============================================================

// 1. Referencias a elementos del DOM
const menuToggles = document.querySelectorAll(".filtroCatalogo-opcion[aria-controls]");
const destinoValor = document.getElementById("destinoValor");
const fechaValor = document.getElementById("fechaValor");
const fechaViaje = document.getElementById("fechaViaje");
const fechaRegreso = document.getElementById("fechaRegreso");
const viajerosValor = document.getElementById("viajerosValor");
const adultosCantidad = document.getElementById("adultosCantidad");
const ninosCantidad = document.getElementById("ninosCantidad");
const viajerosAviso = document.getElementById("viajerosAviso");
const adultosMenos = document.querySelector('[data-contador="adultos"][data-cambio="-1"]');
const ninosMenos = document.querySelector('[data-contador="ninos"][data-cambio="-1"]');
const aumentarControles = document.querySelectorAll('.filtroCatalogo-control[data-cambio="1"]');

const botonBuscar = document.getElementById("botonBuscar");
const tarjetasDestino = document.querySelectorAll(".destino-card");
const seccionDestinos = document.getElementById("destinos");
const mensajeFiltro = document.getElementById("destinosFiltro");
const textoMensajeFiltro = document.getElementById("destinosFiltroTexto");
const botonLimpiarFiltro = document.getElementById("destinosFiltroLimpiar");

// 2. Estado del buscador
let adultos = 1;
let ninos = 0;
let destinoElegido = "";
const maximoViajeros = 9;

// 3. Menús desplegables
function cerrarMenus() {
    menuToggles.forEach((toggle) => {
        const menu = document.getElementById(toggle.getAttribute("aria-controls"));
        toggle.setAttribute("aria-expanded", "false");
        if (menu) {
            menu.hidden = true;
        }
    });
}

// Al hacer clic en un campo se abre su menú y se cierran los demás
menuToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
        const menu = document.getElementById(toggle.getAttribute("aria-controls"));
        if (!menu) {
            return;
        }

        const abrir = menu.hidden;
        cerrarMenus();
        menu.hidden = !abrir;
        toggle.setAttribute("aria-expanded", String(abrir));
    });
});

// Cerrar los menús al hacer clic fuera de ellos
document.addEventListener("click", (event) => {
    if (event.target instanceof Element && !event.target.closest(".filtroCatalogo-campo")) {
        cerrarMenus();
    }
});

// Cerrar los menús con la tecla Escape (accesibilidad con teclado)
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        cerrarMenus();
    }
});

// 4. Selección de destino
document.querySelectorAll(".filtroCatalogo-destino").forEach((destino) => {
    destino.addEventListener("click", () => {
        destinoElegido = destino.dataset.destino || "";
        if (destinoValor) {
            destinoValor.textContent = destino.querySelector("span").textContent;
        }
        cerrarMenus();
    });
});

// 5. Calendario de ida y regreso: no permite fechas pasadas ni un regreso anterior a la ida
function formatearFecha(valor) {
    const [year, month, day] = valor.split("-").map(Number);
    return new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short" }).format(new Date(year, month - 1, day));
}

function actualizarTextoFechas() {
    if (!fechaValor || !fechaViaje.value) {
        return;
    }
    fechaValor.textContent = fechaRegreso.value
        ? `${formatearFecha(fechaViaje.value)} – ${formatearFecha(fechaRegreso.value)}`
        : formatearFecha(fechaViaje.value);
}

if (fechaViaje instanceof HTMLInputElement && fechaRegreso instanceof HTMLInputElement) {
    const hoy = new Date();
    const hoyTexto = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    fechaViaje.min = hoyTexto;
    fechaRegreso.min = hoyTexto;

    fechaViaje.addEventListener("change", () => {
        fechaRegreso.min = fechaViaje.value || hoyTexto;
        if (fechaRegreso.value && fechaRegreso.value < fechaViaje.value) {
            fechaRegreso.value = "";
        }
        actualizarTextoFechas();
    });

    fechaRegreso.addEventListener("change", () => {
        actualizarTextoFechas();
        if (fechaViaje.value && fechaRegreso.value) {
            cerrarMenus();
        }
    });
}

// 6. Contador de viajeros (mínimo 1 adulto, máximo 9 viajeros en total)
function actualizarViajeros() {
    const total = adultos + ninos;
    if (adultosCantidad) {
        adultosCantidad.textContent = String(adultos);
    }
    if (ninosCantidad) {
        ninosCantidad.textContent = String(ninos);
    }
    if (viajerosValor) {
        const detalleNinos = ninos > 0 ? `, ${ninos} ${ninos === 1 ? "niño" : "niños"}` : "";
        viajerosValor.textContent = `${total} ${total === 1 ? "viajero" : "viajeros"}${detalleNinos}`;
    }
    if (adultosMenos instanceof HTMLButtonElement) {
        adultosMenos.disabled = adultos === 1;
    }
    if (ninosMenos instanceof HTMLButtonElement) {
        ninosMenos.disabled = ninos === 0;
    }
    aumentarControles.forEach((control) => {
        if (control instanceof HTMLButtonElement) {
            control.disabled = total >= maximoViajeros;
        }
    });
    if (viajerosAviso) {
        viajerosAviso.hidden = total !== maximoViajeros;
    }
}

document.querySelectorAll(".filtroCatalogo-control").forEach((control) => {
    control.addEventListener("click", () => {
        const cambio = Number(control.dataset.cambio);
        const total = adultos + ninos;

        if (total + cambio > maximoViajeros) {
            return;
        }

        if (control.dataset.contador === "adultos" && adultos + cambio >= 1) {
            adultos += cambio;
        } else if (control.dataset.contador === "ninos" && ninos + cambio >= 0) {
            ninos += cambio;
        }
        actualizarViajeros();
    });
});

// 7. Filtrar las tarjetas de "Destinos populares" según el destino elegido
function mostrarDestinos(destino) {
    let cantidadVisible = 0;

    tarjetasDestino.forEach((tarjeta) => {
        const coincide = !destino || tarjeta.dataset.destino === destino;
        tarjeta.hidden = !coincide;
        if (coincide) {
            cantidadVisible++;
        }
    });

    if (mensajeFiltro && textoMensajeFiltro) {
        mensajeFiltro.hidden = !destino;
        textoMensajeFiltro.textContent = destino
            ? `Mostrando ${cantidadVisible} ${cantidadVisible === 1 ? "resultado" : "resultados"} para ${destino}`
            : "";
    }
}

if (botonBuscar) {
    botonBuscar.addEventListener("click", () => {
        cerrarMenus();
        mostrarDestinos(destinoElegido);
        if (seccionDestinos) {
            seccionDestinos.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });
}

if (botonLimpiarFiltro) {
    botonLimpiarFiltro.addEventListener("click", () => {
        destinoElegido = "";
        if (destinoValor) {
            destinoValor.textContent = "Elige tu destino";
        }
        mostrarDestinos("");
    });
}

actualizarViajeros();
