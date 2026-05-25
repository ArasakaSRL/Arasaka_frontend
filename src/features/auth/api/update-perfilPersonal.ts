import apiClient from '@/api/api'
import type {
    Profesion,
    AsignarProfesionPayload,
    ActualizarInformacionPayload,
    ActualizarFotoPayload,
    ActualizarPaisPayload,
    ActualizarInformacionBasicaPayload,
    InformacionBasicaResponse,
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

// GET /api/portafolios/{id}/profesiones
export async function getProfesiones(idPortafolio: string): Promise<Profesion[]> {
    const { data } = await apiClient.get<{ data: Profesion[] }>(`/portafolios/${idPortafolio}/profesiones`)
    return data.data
}

// POST /api/portafolios/{id}/profesiones
export async function asignarProfesion(idPortafolio: string, payload: AsignarProfesionPayload): Promise<MensajeResponse> {
    const { data } = await apiClient.post<MensajeResponse>(`/portafolios/${idPortafolio}/profesiones`, payload)
    return data
}

// DELETE /api/portafolios/{id}/profesiones/{idProfesion}
export async function desasignarProfesion(idPortafolio: string, id_profesion: string): Promise<MensajeResponse> {
    const { data } = await apiClient.delete<MensajeResponse>(`/portafolios/${idPortafolio}/profesiones/${id_profesion}`)
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

// GET /api/portafolios/{id}/telefonos
export async function getTelefonos(idPortafolio: string): Promise<Telefono[]> {
    const { data } = await apiClient.get<{ data: Telefono[] }>(`/portafolios/${idPortafolio}/telefonos`)
    return data.data
}

// POST /api/portafolios/{id}/telefonos
export async function agregarTelefono(idPortafolio: string, payload: TelefonoPayload): Promise<TelefonoResponse> {
    const { data } = await apiClient.post<TelefonoResponse>(`/portafolios/${idPortafolio}/telefonos`, payload)
    return data
}

// DELETE /api/portafolios/{id}/telefonos/{idTelefono}
export async function eliminarTelefono(idPortafolio: string, id: string): Promise<MensajeResponse> {
    const { data } = await apiClient.delete<MensajeResponse>(`/portafolios/${idPortafolio}/telefonos/${id}`)
    return data
}

// PATCH /api/portafolios/{id}/telefonos/{idTelefono}
export async function actualizarTelefono(idPortafolio: string, id: string, payload: TelefonoPayload): Promise<TelefonoResponse> {
    const { data } = await apiClient.patch<TelefonoResponse>(`/portafolios/${idPortafolio}/telefonos/${id}`, payload)
    return data
}

// GET /api/usuario/Miportafolio
export async function getPortafolio(idPortafolio?: string): Promise<PortafolioCompleto> {
    const { data } = await apiClient.get<PortafolioCompleto>('/usuario/Miportafolio', {
        params: idPortafolio ? { id_portafolio: idPortafolio } : undefined,
    })
    return data
}

// PATCH /api/portafolios/{id}/informacion-basica
export async function actualizarInformacionBasica(
    idPortafolio: string,
    payload: ActualizarInformacionBasicaPayload
): Promise<InformacionBasicaResponse> {
    const { data } = await apiClient.patch<InformacionBasicaResponse>(
        `/portafolios/${idPortafolio}/informacion-basica`,
        payload
    )
    return data
}
