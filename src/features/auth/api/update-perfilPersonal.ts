import api from '@/api/axios'
import type {
    Profesion,
    AsignarProfesionPayload,
    ActualizarInformacionPayload,
    ActualizarFotoPayload,
    MensajeResponse,
    UsuarioActualizadoResponse,
} from '../types/update-perfilPersonal'

// GET /api/usuario/profesiones
// Devuelve las profesiones asignadas al usuario autenticado
export async function getProfesiones(): Promise<Profesion[]> {
    const { data } = await api.get<{ data: Profesion[] }>('/api/usuario/profesiones')
    return data.data
}

// POST /api/usuario/profesiones
// Asigna una profesión existente al usuario autenticado
export async function asignarProfesion(payload: AsignarProfesionPayload): Promise<MensajeResponse> {
    const { data } = await api.post<MensajeResponse>('/api/usuario/profesiones', payload)
    return data
}

// DELETE /api/usuario/profesiones/{id}
// Desasigna una profesión del usuario autenticado
export async function desasignarProfesion(id_profesion: string): Promise<MensajeResponse> {
    const { data } = await api.delete<MensajeResponse>(`/api/usuario/profesiones/${id_profesion}`)
    return data
}

// PATCH /api/usuario/informacion
// Actualiza los datos personales del usuario (todos los campos son opcionales)
export async function actualizarInformacion(payload: ActualizarInformacionPayload): Promise<UsuarioActualizadoResponse> {
    const { data } = await api.patch<UsuarioActualizadoResponse>('/api/usuario/informacion', payload)
    return data
}

// PATCH /api/usuario/foto
// Actualiza la URL de la foto de perfil del usuario
export async function actualizarFoto(payload: ActualizarFotoPayload): Promise<UsuarioActualizadoResponse> {
    const { data } = await api.patch<UsuarioActualizadoResponse>('/api/usuario/foto', payload)
    return data
}
