const CLAVE_USUARIOS = "pasionViajera_usuarios";

// Registro, acceso y Contáctanos leen la misma lista. Un error de lectura no debe borrar cuentas.
function obtenerUsuarios() {
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
