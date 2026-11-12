const formulario = document.getElementById("formRegistro");
const CLAVE_USUARIOS = "pasionViajera_usuarios";

const reglas = [
    { id: "nombre", valido: (valor) => valor.length >= 2, mensaje: "Escribe tu nombre completo." },
    { id: "telefono", valido: (valor) => /^[0-9]{7,15}$/.test(valor), mensaje: "El teléfono debe tener solo números (entre 7 y 15 dígitos)." },
    { id: "correo", valido: (valor) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor), mensaje: "Escribe un correo válido." },
    { id: "contrasena", valido: (valor) => valor.length >= 8, mensaje: "La contraseña debe tener al menos 8 caracteres." }
];

function obtenerUsuarios() {
    try {
        return JSON.parse(localStorage.getItem(CLAVE_USUARIOS)) || [];
    } catch {
        return [];
    }
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

function validarFormulario() {
    let esValido = true;
    let primerError = null;

    reglas.forEach((regla) => {
        const campo = document.getElementById(regla.id);
        // La contraseña no se recorta; los demás campos sí
        const valor = regla.id === "contrasena" ? campo.value : campo.value.trim();

        if (regla.valido(valor)) {
            limpiarError(regla.id);
        } else {
            mostrarError(regla.id, regla.mensaje);
            esValido = false;
            if (!primerError) primerError = campo;
        }
    });

    // Un mismo correo no puede registrarse dos veces
    const correo = document.getElementById("correo").value.trim().toLowerCase();
    const repetido = obtenerUsuarios().some((u) => u.correo === correo);
    if (repetido) {
        mostrarError("correo", "Ya existe una cuenta con este correo.");
        esValido = false;
        if (!primerError) primerError = document.getElementById("correo");
    }

    if (primerError) primerError.focus();
    return esValido;
}

function guardarUsuario() {
    const usuario = {
        nombre: document.getElementById("nombre").value.trim(),
        telefono: document.getElementById("telefono").value.trim(),
        correo: document.getElementById("correo").value.trim().toLowerCase(),
        contrasena: document.getElementById("contrasena").value
    };

    const usuarios = obtenerUsuarios();
    usuarios.push(usuario);
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
    return usuario;
}

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    if (!validarFormulario()) return;

    guardarUsuario();
    alert("Cuenta creada. Ya puedes iniciar sesión.");
    formulario.reset();
});

reglas.forEach((regla) => {
    document.getElementById(regla.id).addEventListener("input", () => limpiarError(regla.id));
});