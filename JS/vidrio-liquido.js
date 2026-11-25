// Vidrio líquido del panel Mi viaje: dobla lo que hay detrás en los bordes, como una lente.
// Técnica: un mapa de desplazamiento SVG del tamaño del panel, aplicado al fondo con backdrop-filter.
(() => {
    const panel = document.getElementById("panelViaje");
    if (!panel) return;

    // Solo Chromium aplica filtros SVG en backdrop-filter; los demás conservan el desenfoque de carrito.css.
    const ua = navigator.userAgent;
    if (!/Chrome\/|Chromium\/|Edg\//.test(ua) || /Firefox\/|FxiOS/.test(ua)) return;

    const ns = "http://www.w3.org/2000/svg";
    const opciones = { borde: 18, fuerza: 70, aberracion: 4, desenfoque: 4 };

    // Rojo mueve en x y verde en y; el gris neutro (128) del centro no mueve nada.
    // El panel va pegado al borde derecho de la ventana: el gris se extiende más allá de ese lado
    // para que no se doble lo que queda justo en el borde, donde no hay página que refractar.
    function mapa(ancho, alto, radio) {
        const { borde } = opciones;
        const margenX = Math.ceil((radio / ancho) * 15);
        const margenY = Math.ceil((radio / alto) * 15);
        const svg = `<svg xmlns="${ns}" width="${ancho}" height="${alto}" viewBox="0 0 ${ancho} ${alto}">` +
            `<defs><linearGradient id="x" x1="${margenX}%" x2="${100 - margenX}%" y1="0" y2="0">` +
            `<stop offset="0" stop-color="#f00"/><stop offset="1" stop-color="#000"/></linearGradient>` +
            `<linearGradient id="y" x1="0" x2="0" y1="${margenY}%" y2="${100 - margenY}%">` +
            `<stop offset="0" stop-color="#0f0"/><stop offset="1" stop-color="#000"/></linearGradient></defs>` +
            `<rect width="${ancho}" height="${alto}" fill="#808080"/>` +
            `<g style="filter:blur(2px)"><rect width="${ancho}" height="${alto}" fill="#000080"/>` +
            `<rect width="${ancho}" height="${alto}" fill="url(#x)" style="mix-blend-mode:screen"/>` +
            `<rect width="${ancho}" height="${alto}" fill="url(#y)" style="mix-blend-mode:screen"/>` +
            `<rect x="${borde}" y="${borde}" width="${ancho + radio}" height="${alto - 2 * borde}" rx="${radio}" fill="#808080" style="filter:blur(${borde}px)"/>` +
            `</g></svg>`;
        return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
    }

    function nodo(tipo, atributos, padre) {
        const el = document.createElementNS(ns, tipo);
        for (const [k, v] of Object.entries(atributos)) el.setAttribute(k, v);
        padre.appendChild(el);
        return el;
    }

    const contenedor = nodo("svg", { width: 0, height: 0, "aria-hidden": "true", style: "position:absolute" }, document.body);
    const filtro = nodo("filter", { id: "vidrio-panel-viaje", "color-interpolation-filters": "sRGB" }, nodo("defs", {}, contenedor));
    const imagen = nodo("feImage", { x: 0, y: 0, result: "mapa", preserveAspectRatio: "none" }, filtro);
    // Tres desplazamientos con escalas distintas, uno por canal, dan la aberración cromática.
    const matrices = {
        R: "1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0",
        G: "0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0",
        B: "0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0"
    };
    ["R", "G", "B"].forEach((canal, i) => {
        nodo("feDisplacementMap", {
            in: "SourceGraphic", in2: "mapa", xChannelSelector: "R", yChannelSelector: "G",
            scale: opciones.fuerza + opciones.aberracion * (2 - i), result: "d" + canal
        }, filtro);
        nodo("feColorMatrix", { in: "d" + canal, type: "matrix", values: matrices[canal], result: "c" + canal }, filtro);
    });
    nodo("feBlend", { in: "cR", in2: "cG", mode: "screen", result: "rg" }, filtro);
    nodo("feBlend", { in: "rg", in2: "cB", mode: "screen" }, filtro);

    function pintar() {
        const ancho = Math.round(panel.offsetWidth);
        const alto = Math.round(panel.offsetHeight);
        if (!ancho || !alto) return;
        // El radio sale del CSS: 28 px en escritorio y 24 px en celular.
        const radio = parseFloat(getComputedStyle(panel).borderTopLeftRadius) || 0;
        imagen.setAttribute("width", ancho);
        imagen.setAttribute("height", alto);
        imagen.setAttribute("href", mapa(ancho, alto, radio));
        const d = opciones.desenfoque;
        panel.style.backdropFilter = `blur(${d / 2}px) url(#vidrio-panel-viaje) blur(${d}px) brightness(1.05) saturate(1.5)`;
    }

    // El mapa depende del tamaño: se rehace cuando el panel cambia (al abrirlo, al girar el teléfono).
    let pendiente = false;
    new ResizeObserver(() => {
        if (pendiente) return;
        pendiente = true;
        requestAnimationFrame(() => { pendiente = false; pintar(); });
    }).observe(panel);
    panel.addEventListener("shown.bs.offcanvas", pintar);
    pintar();
})();
