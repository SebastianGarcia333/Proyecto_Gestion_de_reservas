// Panel de administrador: crear, leer, actualizar y eliminar destinos.

let destinos = [
    { id: "D501", nombre: "Cartagena", categoria: "Cultura", duracion: 4, precio: 1650000, descripcion: "Murallas coloniales, calles de colores y atardeceres en el Caribe.", imagen: "" },
    { id: "D503", nombre: "San Andrés", categoria: "Playa", duracion: 5, precio: 2200000, descripcion: "El mar de siete colores, cayos cercanos y buceo en aguas cristalinas.", imagen: "" }
];

let contadorId = 504;
let imagenActual = "";
const campos = ["nombre", "categoria", "duracion", "precio", "descripcion"];

function obtener(id) {
    return document.getElementById(id);
}

function formatoPrecio(numero) {
    return "$ " + numero.toLocaleString("es-CO");
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
        } else if ((id === "duracion" || id === "precio") && Number(valor) <= 0) {
            mensaje = "Escribe un número mayor que cero.";
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
                '<div><p class="destino-nombre">' + d.nombre + "</p>" +
                '<p class="destino-meta">' + d.categoria + " · " + d.duracion + " días</p></div></div></td>" +
                '<td class="celda-precio">' + formatoPrecio(d.precio) + "</td>" +
                '<td><div class="celda-acciones">' +
                '<button class="accion" onclick="verDetalle(\'' + d.id + '\')">Ver</button>' +
                '<button class="accion" onclick="editar(\'' + d.id + '\')">Actualizar</button>' +
                '<button class="accion accion-eliminar" onclick="eliminar(\'' + d.id + '\')">Eliminar</button>' +
                "</div></td></tr>";
        }
    }

    obtener("cuerpoTabla").innerHTML = filas;
    obtener("vacio").hidden = cantidad > 0;
    obtener("resumen").textContent = destinos.length + " destinos publicados.";
}

// Cada cambio actualiza la tabla y muestra la lista en mJson
function actualizar() {
    dibujarTabla();
    console.log(JSON.stringify(destinos, null, 2));
}

function reiniciarFormulario() {
    obtener("formDestino").reset();
    obtener("idEditando").value = "";
    imagenActual = "";
    obtener("tituloForm").textContent = "Nuevo destino";
    obtener("botonGuardar").textContent = "Guardar destino";
    obtener("botonCancelar").hidden = true;
    obtener("formDestino").classList.remove("editando");
    obtener("vistaImagen").style.backgroundImage = "";
}

// Crea un destino nuevo o actualiza uno
function guardar(evento) {
    evento.preventDefault();
    if (validar() === false) return;

    let datos = {
        id: obtener("idEditando").value,
        nombre: obtener("nombre").value.trim(),
        categoria: obtener("categoria").value,
        duracion: Number(obtener("duracion").value),
        precio: Number(obtener("precio").value),
        descripcion: obtener("descripcion").value.trim(),
        imagen: imagenActual
    };

    if (datos.id === "") {
        datos.id = "D" + contadorId;
        contadorId++;
        destinos.push(datos);
    } else {
        for (let i = 0; i < destinos.length; i++) {
            if (destinos[i].id === datos.id) destinos[i] = datos;
        }
    }

    reiniciarFormulario();
    actualizar();
}

function editar(id) {
    let d = buscarPorId(id);
    for (let i = 0; i < campos.length; i++) {
        obtener(campos[i]).value = d[campos[i]];
    }
    obtener("idEditando").value = d.id;
    imagenActual = d.imagen;
    obtener("tituloForm").textContent = "Actualizar " + d.nombre;
    obtener("botonGuardar").textContent = "Guardar cambios";
    obtener("botonCancelar").hidden = false;
    obtener("formDestino").classList.add("editando");
    obtener("nombre").focus();
    obtener("vistaImagen").style.backgroundImage = d.imagen ? "url(" + d.imagen + ")" : "";
}

function verDetalle(id) {
    let d = buscarPorId(id);
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
    if (!confirm("¿Eliminar este destino del catálogo?")) return;
    for (let i = 0; i < destinos.length; i++) {
        if (destinos[i].id === id) destinos.splice(i, 1);
    }
    actualizar();
}

// Eventos
obtener("formDestino").addEventListener("submit", guardar);
obtener("buscar").addEventListener("input", dibujarTabla);
obtener("filtroCategoria").addEventListener("change", dibujarTabla);
obtener("botonCancelar").addEventListener("click", reiniciarFormulario);
obtener("imagen").addEventListener("change", function (evento) {
    let archivo = evento.target.files[0];
    if (archivo) {
        imagenActual = URL.createObjectURL(archivo);
        obtener("vistaImagen").style.backgroundImage = "url(" + imagenActual + ")";
    }
});

actualizar();