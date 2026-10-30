// botones
const menuToggles = document.querySelectorAll(".filtroCatalogo-opcion[aria-controls]");
const destinoValor = document.getElementById("destinoValor");
const fechaValor = document.getElementById("fechaValor");
const fechaViaje = document.getElementById("fechaViaje");
const viajerosValor = document.getElementById("viajerosValor");
const adultosCantidad = document.getElementById("adultosCantidad");
const ninosCantidad = document.getElementById("ninosCantidad");
const viajerosAviso = document.getElementById("viajerosAviso");
const adultosMenos = document.querySelector('[data-contador="adultos"][data-cambio="-1"]');
const ninosMenos = document.querySelector('[data-contador="ninos"][data-cambio="-1"]');
const aumentarControles = document.querySelectorAll('.filtroCatalogo-control[data-cambio="1"]');

let adultos = 1;
let ninos = 0;
const maximoViajeros = 9;

function cerrarMenus() {
    menuToggles.forEach((toggle) => {
        const menu = document.getElementById(toggle.getAttribute("aria-controls"));
        toggle.setAttribute("aria-expanded", "false");
        if (menu) {
            menu.hidden = true;
        }
    });
}

// dar click = cerrar otros menus
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

// cerrar menu fuera del menu
document.addEventListener("click", (event) => {
    if (event.target instanceof Element && !event.target.closest(".filtroCatalogo-campo")) {
        cerrarMenus();
    }
});


// actualizar estado menu (seleccion)
document.querySelectorAll(".filtroCatalogo-destino").forEach((destino) => {
    destino.addEventListener("click", () => {
        if (destinoValor) {
            destinoValor.textContent = destino.dataset.destino;
        }
        cerrarMenus();
    });
});

// calendario
if (fechaViaje instanceof HTMLInputElement) {
    const hoy = new Date();
    fechaViaje.min = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

    fechaViaje.addEventListener("change", () => {
        if (!fechaViaje.value || !fechaValor) {
            return;
        }

        const [year, month, day] = fechaViaje.value.split("-").map(Number);
        const fechaSeleccionada = new Date(year, month - 1, day);
        fechaValor.textContent = new Intl.DateTimeFormat("es-CO", {
            day: "numeric",
            month: "short",
            year: "numeric"
        }).format(fechaSeleccionada);
        cerrarMenus();
    });
}

// contador
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

// comportamiento de los botones
document.querySelectorAll(".filtroCatalogo-control").forEach((control) => {
    control.addEventListener("click", () => {
        const cambio = Number(control.dataset.cambio);
        if (control.dataset.contador === "adultos" && adultos + cambio >= 1 && adultos + ninos + cambio <= maximoViajeros) {
            if (cambio === 1) {
                adultos++;
            } else if (cambio === -1) {
                adultos--;
            }
        } else if (control.dataset.contador === "ninos" && ninos + cambio >= 0 && adultos + ninos + cambio <= maximoViajeros) {
            if (cambio === 1) {
                ninos++;
            } else if (cambio === -1) {
                ninos--;
            }
        }
        actualizarViajeros();
    });
});

actualizarViajeros();
