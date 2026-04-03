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
    descripcion_laboral?: string
}

// Payload para actualizar foto de perfil
export interface ActualizarFotoPayload {
    url_foto: string
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
        descripcion_laboral?: string
        url_foto?: string
    }
}
