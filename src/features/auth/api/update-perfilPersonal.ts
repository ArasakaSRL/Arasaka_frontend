import apiClient from '@/api/api'
import type {
    Profesion,
    AsignarProfesionPayload,
    ActualizarInformacionPayload,
    ActualizarFotoPayload,
    ActualizarPaisPayload,
    PaisResponse,
    Telefono,
    TelefonoPayload,
    TelefonoResponse,
    MensajeResponse,
    UsuarioActualizadoResponse,
} from '../types/update-perfilPersonal'
import type { PortafolioCompleto } from '../types/portafolioData'

// GET /api/profesiones
// Devuelve el catálogo completo de profesiones disponibles
export async function getCatalogoProfesiones(): Promise<Profesion[]> {
    const { data } = await apiClient.get<{ data: Profesion[] }>('/profesiones')
    return data.data
}

// GET /api/usuario/profesiones
// Devuelve las profesiones asignadas al usuario autenticado
export async function getProfesiones(): Promise<Profesion[]> {
    const { data } = await apiClient.get<{ data: Profesion[] }>('/usuario/profesiones')
    return data.data
}

// POST /api/usuario/profesiones
// Asigna una profesión existente al usuario autenticado
export async function asignarProfesion(payload: AsignarProfesionPayload): Promise<MensajeResponse> {
    const { data } = await apiClient.post<MensajeResponse>('/usuario/profesiones', payload)
    return data
}

// DELETE /api/usuario/profesiones/{id}
// Desasigna una profesión del usuario autenticado
export async function desasignarProfesion(id_profesion: string): Promise<MensajeResponse> {
    const { data } = await apiClient.delete<MensajeResponse>(`/usuario/profesiones/${id_profesion}`)
    return data
}

// PATCH /api/usuario/informacion
// Actualiza los datos personales del usuario (todos los campos son opcionales)
export async function actualizarInformacion(payload: ActualizarInformacionPayload): Promise<UsuarioActualizadoResponse> {
    const { data } = await apiClient.patch<UsuarioActualizadoResponse>('/usuario/informacion', payload)
    return data
}

// POST /api/usuario/foto
// Sube el archivo de foto al backend (Cloudinary) via multipart/form-data
export async function actualizarFoto(payload: ActualizarFotoPayload): Promise<UsuarioActualizadoResponse> {
    const { data } = await apiClient.post<UsuarioActualizadoResponse>('/usuario/foto', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
}

//PATCH /api/usuario/pais
// Actualiza el país de residencia del usuario
export async function actualizarPais(payload: ActualizarPaisPayload): Promise<PaisResponse> {
    const { data } = await apiClient.patch<PaisResponse>('/usuario/pais', payload)
    return data
}

// GET /api/usuario/telefonos
// Devuelve los teléfonos del usuario autenticado
export async function getTelefonos(): Promise<Telefono[]> {
    const { data } = await apiClient.get<{ data: Telefono[] }>('/usuario/telefonos')
    return data.data
}

// POST /api/usuario/telefonos
// Agrega un nuevo teléfono al usuario autenticado
export async function agregarTelefono(payload: TelefonoPayload): Promise<TelefonoResponse> {
    const { data } = await apiClient.post<TelefonoResponse>('/usuario/telefonos', payload)
    return data
}

// DELETE /api/usuario/telefonos/{id}
// Elimina un teléfono del usuario autenticado
export async function eliminarTelefono(id: string): Promise<MensajeResponse> {
    const { data } = await apiClient.delete<MensajeResponse>(`/usuario/telefonos/${id}`)
    return data
}

// PATCH /api/usuario/telefonos/{id}
// Actualiza un teléfono del usuario autenticado
export async function actualizarTelefono(id: string, payload: TelefonoPayload): Promise<TelefonoResponse> {
    const { data } = await apiClient.patch<TelefonoResponse>(`/usuario/telefonos/${id}`, payload)
    return data
}

// GET /api/usuario/Miportafolio
export async function getPortafolio(): Promise<PortafolioCompleto> {
    const { data } = await apiClient.get<PortafolioCompleto>('/usuario/Miportafolio')
    return data
}
