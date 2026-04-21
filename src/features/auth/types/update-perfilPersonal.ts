// Profesión asignada al usuario
export interface Profesion {
    id_profesion: string
    nombre: string
    descripcion?: string
}

// Payload para asignar una profesión
export interface AsignarProfesionPayload {
    id_profesion: string
}

// Payload para actualizar información personal
export interface ActualizarInformacionPayload {
    nombre?: string
    apellido?: string
    correo?: string
    biografia?: string
}

// Payload para actualizar foto de perfil
export interface ActualizarFotoPayload {
    url_foto: string
}

// Payload para actualizar país
export interface ActualizarPaisPayload {
    nombre: string
}

// País del usuario
export interface Pais {
    id_pais?: string
    id_usuario?: string
    nombre: string
}

// Respuesta de país actualizado
export interface PaisResponse {
    message: string
    data: Pais
}

// Teléfono del usuario
export interface Telefono {
    id_telefono?: string
    id_usuario?: string
    telefono: string
}

// Payload para agregar o actualizar teléfono
export interface TelefonoPayload {
    telefono: string
}

// Respuesta de teléfono
export interface TelefonoResponse {
    message: string
    data: Telefono
}

// Respuesta genérica del backend con mensaje
export interface MensajeResponse {
    message: string
}

// Respuesta con mensaje + datos del usuario actualizado
export interface UsuarioActualizadoResponse {
    message: string
    data: {
        nombre: string
        apellido: string
        correo: string
        biografia?: string
        url_foto?: string
    }
}
