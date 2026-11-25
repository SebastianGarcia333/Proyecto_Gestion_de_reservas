// Panel de administrador: crear, leer, actualizar y eliminar destinos.

// Aquí solo van los destinos nuevos. Las cinco cards del HTML no se modifican.
let destinos = [];
const claveDestinos = "pasionViajera.destinos";

let contadorId = 504;
let imagenActual = "";
let lectorImagen = null;
let idPorEliminar = "";
const campos = ["nombre", "categoria", "duracion", "precio", "descripcion"];
const modalEliminar = obtener("modalEliminar");
const botonConfirmar = obtener("confirmarEliminar");

function obtener(id) {
    return document.getElementById(id);
}

function formatoPrecio(numero) {
    return "$ " + numero.toLocaleString("es-CO");
}

function mostrarMensaje(texto, esError = false) {
    obtener("mensajeGuardado").textContent = texto;
    obtener("mensajeGuardado").dataset.error = String(esError);
    obtener("mensajeGuardado").setAttribute("role", esError ? "alert" : "status");
}

// JSON.parse convierte el texto guardado en un arreglo de JavaScript.
function cargarDestinos() {
    try {
        let texto = localStorage.getItem(claveDestinos);
        let guardados = texto === null ? [] : JSON.parse(texto);
        if (!Array.isArray(guardados)) throw new Error("Datos inválidos");
        let ids = new Set();
        for (let d of guardados) {
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
        }
        destinos = guardados;
        contadorId = 504;
        for (let d of destinos) {
            contadorId = Math.max(contadorId, Number(d.id.slice(1)) + 1);
        }
        return true;
    } catch {
        mostrarMensaje("No se pudieron leer los destinos guardados. Revisa el almacenamiento del navegador; los datos no se han reemplazado.", true);
        return false;
    }
}

// JSON.stringify convierte el arreglo en texto para poder guardarlo.
function guardarDestinos(nuevosDestinos) {
    try {
        localStorage.setItem(claveDestinos, JSON.stringify(nuevosDestinos));
        destinos = nuevosDestinos;
        actualizar();
        return true;
    } catch {
        mostrarMensaje("No se pudo guardar. El almacenamiento puede estar bloqueado o lleno. Prueba con una imagen más pequeña.", true);
        return false;
    }
}

// La tabla usa innerHTML: escapar los textos evita que se interpreten como etiquetas.
function textoSeguro(valor) {
    return String(valor).replaceAll("&", "&amp;").replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

function buscarPorId(id) {
    for (let i = 0; i < destinos.length; i++) {
        if (destinos[i].id === id) return destinos[i];
    }
}

// Revisa cada campo y muestra el error debajo si está mal
function validar() {
    let todoBien = true;

    for (let i = 0; i < campos.length; i++) {
        let id = campos[i];
        let valor = obtener(id).value.trim();
        let mensaje = "";

        if (valor === "") {
            mensaje = "Completa este campo.";
        } else if ((id === "duracion" || id === "precio") && (!Number.isFinite(Number(valor)) || Number(valor) <= 0)) {
            mensaje = "Escribe un número mayor que cero.";
        } else if (id === "duracion" && !Number.isInteger(Number(valor))) {
            mensaje = "La duración debe ser un número entero de días.";
        }

        obtener("error-" + id).textContent = mensaje;
        if (mensaje !== "") {
            obtener(id).setAttribute("aria-invalid", "true");
            todoBien = false;
        } else {
            obtener(id).removeAttribute("aria-invalid");
        }
    }
    return todoBien;
}

// El nombre del destino va en aria-label para que el lector de pantalla diga qué fila se edita o elimina.
function botonAccion(icono, accion, texto, d, funcion, claseExtra) {
    return '<button type="button" class="accion' + claseExtra + '" title="' + accion + '"' +
        ' aria-label="' + accion + ' ' + textoSeguro(d.nombre) + '"' +
        ' onclick="' + funcion + '(\'' + d.id + '\')">' +
        '<i data-lucide="' + icono + '"></i><span class="accion-texto">' + texto + "</span></button>";
}

// Muestra la tabla (con buscador y filtro) y el resumen de arriba
function dibujarTabla() {
    let texto = obtener("buscar").value.trim().toLowerCase();
    let categoria = obtener("filtroCategoria").value;
    let filas = "";
    let cantidad = 0;

    for (let i = 0; i < destinos.length; i++) {
        let d = destinos[i];
        let coincide = d.nombre.toLowerCase().includes(texto) || d.id.toLowerCase().includes(texto);

        if (coincide && (categoria === "" || d.categoria === categoria)) {
            cantidad++;
            filas += "<tr>" +
                '<td class="celda-id">' + d.id + "</td>" +
                '<td><div class="celda-destino">' +
                '<div class="miniatura" style="background-image:url(' + d.imagen + ')"></div>' +
                '<div><p class="destino-nombre">' + textoSeguro(d.nombre) + "</p>" +
                '<p class="destino-meta">' + textoSeguro(d.categoria) + " · " + d.duracion + " días</p></div></div></td>" +
                '<td class="celda-precio">' + formatoPrecio(d.precio) + "</td>" +
                '<td><div class="celda-acciones">' +
                botonAccion("eye", "Ver detalle", "Ver", d, "verDetalle", "") +
                botonAccion("square-pen", "Editar", "Editar", d, "editar", "") +
                botonAccion("trash-2", "Eliminar", "Eliminar", d, "eliminar", " accion-eliminar") +
                "</div></td></tr>";
        }
    }

    obtener("cuerpoTabla").innerHTML = filas;
    // Si el CDN de Lucide no cargó, los botones conservan su texto visible.
    if (window.lucide) {
        lucide.createIcons({ root: obtener("cuerpoTabla") });
        obtener("cuerpoTabla").classList.add("con-iconos");
    }
    obtener("vacio").hidden = cantidad > 0;
    obtener("resumen").textContent = destinos.length + " destinos creados en este navegador.";
}

// Actualiza la tabla después de cargar o guardar.
function actualizar() {
    dibujarTabla();
}

function cancelarLecturaImagen() {
    if (lectorImagen && lectorImagen.readyState === FileReader.LOADING) lectorImagen.abort();
    obtener("botonGuardar").disabled = false;
}

function reiniciarFormulario() {
    cancelarLecturaImagen();
    obtener("formDestino").reset();
    obtener("idEditando").value = "";
    imagenActual = "";
    obtener("tituloForm").textContent = "Nuevo destino";
    obtener("botonGuardar").textContent = "Guardar destino";
    obtener("botonCancelar").hidden = true;
    obtener("formDestino").classList.remove("editando");
    obtener("vistaImagen").style.backgroundImage = "";
    for (let id of [...campos, "imagen"]) {
        obtener("error-" + id).textContent = "";
        obtener(id).removeAttribute("aria-invalid");
    }
}

// Crea un destino nuevo o actualiza uno
function guardar(evento) {
    evento.preventDefault();
    if (validar() === false) return;
    if (lectorImagen && lectorImagen.readyState === FileReader.LOADING) return;
    // Recupera los cambios de otra pestaña antes de guardar.
    if (!cargarDestinos()) return;

    let datos = {
        id: obtener("idEditando").value,
        nombre: obtener("nombre").value.trim(),
        categoria: obtener("categoria").value,
        duracion: Number(obtener("duracion").value),
        precio: Number(obtener("precio").value),
        descripcion: obtener("descripcion").value.trim(),
        imagen: imagenActual
    };

    let nuevosDestinos = destinos.slice();
    if (datos.id === "") {
        datos.id = "D" + contadorId;
        contadorId++;
        nuevosDestinos.push(datos);
    } else {
        if (!buscarPorId(datos.id)) {
            mostrarMensaje("El destino fue eliminado en otra pestaña. Cancela la edición para crear uno nuevo.", true);
            return;
        }
        for (let i = 0; i < nuevosDestinos.length; i++) {
            if (nuevosDestinos[i].id === datos.id) nuevosDestinos[i] = datos;
        }
    }

    if (!guardarDestinos(nuevosDestinos)) return;
    reiniciarFormulario();
    mostrarMensaje("Destino guardado. Ya puedes verlo en el catálogo.");
}

function editar(id) {
    let d = buscarPorId(id);
    if (!d) return;
    reiniciarFormulario();
    for (let i = 0; i < campos.length; i++) {
        obtener(campos[i]).value = d[campos[i]];
    }
    obtener("idEditando").value = d.id;
    imagenActual = d.imagen;
    obtener("tituloForm").textContent = "Editar " + d.nombre;
    obtener("botonGuardar").textContent = "Guardar cambios";
    obtener("botonCancelar").hidden = false;
    obtener("formDestino").classList.add("editando");
    obtener("nombre").focus();
    obtener("vistaImagen").style.backgroundImage = d.imagen ? "url(" + d.imagen + ")" : "";
}


function verDetalle(id) {
    let d = buscarPorId(id);
    if (!d) return;
    obtener("detalleTitulo").textContent = d.nombre;
    obtener("detalleMeta").textContent = d.categoria + " · " + d.duracion + " días · desde " + formatoPrecio(d.precio);
    obtener("detalleDescripcion").textContent = d.descripcion;
    let foto = obtener("detalleFoto");
    if (d.imagen !== "") {
        foto.style.backgroundImage = "url(" + d.imagen + ")";
        foto.hidden = false;
    } else {
        foto.hidden = true;
    }
    new bootstrap.Modal(obtener("modalDetalle")).show();
}

function eliminar(id) {
    let destino = buscarPorId(id);
    if (!destino) return;
    idPorEliminar = id;
    obtener("eliminarTexto").textContent = "Se quitará «" + destino.nombre + "» del catálogo. Esta acción no se puede deshacer.";
    bootstrap.Modal.getOrCreateInstance(modalEliminar).show();
}

function confirmarEliminacion() {
    let id = idPorEliminar;
    if (!id) return;
    idPorEliminar = "";
    bootstrap.Modal.getInstance(modalEliminar).hide();
    if (!cargarDestinos()) return;
    let nuevosDestinos = destinos.filter((d) => d.id !== id);
    if (!guardarDestinos(nuevosDestinos)) return;
    if (obtener("idEditando").value === id) reiniciarFormulario();
    mostrarMensaje("Destino eliminado. Las cinco cards originales siguen en el catálogo.");
}

// Eventos
botonConfirmar.addEventListener("click", confirmarEliminacion);
modalEliminar.addEventListener("show.bs.modal", function () {
    botonConfirmar.disabled = true;
});
modalEliminar.addEventListener("shown.bs.modal", function () {
    botonConfirmar.disabled = false;
});
modalEliminar.addEventListener("hide.bs.modal", function () {
    idPorEliminar = "";
});
obtener("formDestino").addEventListener("submit", guardar);
obtener("buscar").addEventListener("input", dibujarTabla);
obtener("filtroCategoria").addEventListener("change", dibujarTabla);
obtener("botonCancelar").addEventListener("click", reiniciarFormulario);
obtener("imagen").addEventListener("change", function (evento) {
    cancelarLecturaImagen();
    let archivo = evento.target.files[0];
    obtener("error-imagen").textContent = "";
    if (!archivo) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(archivo.type) || archivo.size > 500 * 1024) {
        obtener("error-imagen").textContent = "No se cambió la imagen. Usa JPG, PNG o WebP de hasta 500 KB.";
        obtener("imagen").value = "";
        return;
    }
    // FileReader guarda la imagen como texto; una URL temporal no sobreviviría a la recarga.
    lectorImagen = new FileReader();
    obtener("botonGuardar").disabled = true;
    lectorImagen.onload = function () {
        imagenActual = lectorImagen.result;
        obtener("vistaImagen").style.backgroundImage = "url(" + imagenActual + ")";
        obtener("botonGuardar").disabled = false;
    };
    lectorImagen.onerror = function () {
        obtener("error-imagen").textContent = "No se cambió la imagen. No se pudo leer el archivo.";
        obtener("botonGuardar").disabled = false;
    };
    lectorImagen.readAsDataURL(archivo);
});

window.addEventListener("storage", function (evento) {
    if (evento.key === claveDestinos || evento.key === null) {
        if (cargarDestinos()) actualizar();
    }
});
window.addEventListener("pageshow", function (evento) {
    if (evento.persisted && cargarDestinos()) actualizar();
});

cargarDestinos();
actualizar();
