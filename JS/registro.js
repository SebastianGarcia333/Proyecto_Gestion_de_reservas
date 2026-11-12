const formulario = document.getElementById("formRegistro");
const CLAVE_USUARIOS = "pasionViajera_usuarios";

//validaciones
const reglas = [
    {
        id: "nombre",
        valido: (valor) => {
            const partes = valor.trim().split(/\s+/);
            return partes.length >= 2 && partes.every((parte) => /^[\p{L}\p{M}]+(?:['’-][\p{L}\p{M}]+)*$/u.test(parte));
        },
        mensaje: "Escribe tu nombre y apellido, usando solo letras."
    },
    {
        id: "telefono",
        valido: (valor) => /^[0-9]{7,15}$/.test(valor),
        mensaje: "El teléfono debe tener solo números (entre 7 y 15 dígitos)."
    },
    {
        id: "correo",
        valido: (valor) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor),
        mensaje: "Escribe un correo válido."
    },
    {
        id: "contrasena",
        valido: (valor) => valor.length >= 8,
        mensaje: "La contraseña debe tener al menos 8 caracteres."
    }
];

function obtenerUsuarios() {
    // crear usu
    const datos = localStorage.getItem(CLAVE_USUARIOS);
    if (datos === null) return [];

    let usuarios;
    try {
        usuarios = JSON.parse(datos);
    } catch {
        throw new Error("No se pudieron leer las cuentas guardadas. Los datos almacenados están dañados.");
    }

    if (!Array.isArray(usuarios) || usuarios.some((usuario) => !usuario || typeof usuario.correo !== "string")) {
        throw new Error("No se pudieron leer las cuentas guardadas por un formato de datos inválido.");
    }

    return usuarios;
}

function mostrarError(id, mensaje) {
    const campo = document.getElementById(id);
    campo.setAttribute("aria-invalid", "true");
    document.getElementById("error-" + id).textContent = mensaje;
}

function limpiarError(id) {
    document.getElementById(id).removeAttribute("aria-invalid");
    document.getElementById("error-" + id).textContent = "";
}

function obtenerDatosFormulario() {
    return {
        nombre: document.getElementById("nombre").value.trim().replace(/\s+/g, " "),
        telefono: document.getElementById("telefono").value.trim(),
        correo: document.getElementById("correo").value.trim().toLowerCase(),
        contrasena: document.getElementById("contrasena").value
    };
}

function validarFormulario(usuario) {
    let esValido = true;
    let primerError = null;

    reglas.forEach((regla) => {
        const campo = document.getElementById(regla.id);
        const valor = usuario[regla.id];

        if (regla.valido(valor)) {
            limpiarError(regla.id);
        } else {
            mostrarError(regla.id, regla.mensaje);
            esValido = false;
            if (!primerError) primerError = campo;
        }
    });

    if (primerError) primerError.focus();
    return esValido;
}

function guardarUsuario(usuario) {
    const usuarios = obtenerUsuarios();

    //verifica si ya existe el correo
    const correoExiste = usuarios.some((cuenta) => cuenta.correo.trim().toLowerCase() === usuario.correo);

    if (correoExiste) {
        mostrarError("correo", "Ya existe una cuenta con este correo.");
        document.getElementById("correo").focus();
        return false;
    }

    usuarios.push(usuario);
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
    return true;
}

// confirma envio y avisa si paso algo
formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const usuario = obtenerDatosFormulario();
    if (!validarFormulario(usuario)) return;

    try {
        if (!guardarUsuario(usuario)) return;
    } catch (error) {
        const mensaje = error && typeof error.message === "string"
            ? error.message
            : "No fue posible guardar la cuenta.";
        alert(mensaje);
        return;
    }

    alert("Cuenta creada. Ya puedes iniciar sesión.");
    formulario.reset();
});

reglas.forEach((regla) => {
    document.getElementById(regla.id).addEventListener("input", () => limpiarError(regla.id));
});
