import apiClient from '@/api/api'
import type { EmailRequest, EmailResponse, Mensaje } from '../types/sendGmailType'
import type { Portafolio } from '@/features/portafolio/types/portafolioType'

// POST /api/enviar-correo-brevo
// Envía un correo personalizado a través de Brevo (multipart si hay adjuntos)
export async function sendGmail(emailData: EmailRequest): Promise<EmailResponse> {
    if (emailData.adjuntos?.length) {
        const fd = new FormData()
        fd.append('to', emailData.to)
        fd.append('from', emailData.from)
        fd.append('subject', emailData.subject)
        fd.append('content', emailData.content)
        if (emailData.nombre_remitente) fd.append('nombre_remitente', emailData.nombre_remitente)
        emailData.adjuntos.forEach(f => fd.append('adjuntos[]', f))
        const { data } = await apiClient.post<EmailResponse>('/enviar-correo-brevo', fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        return data
    }
    const { data } = await apiClient.post<EmailResponse>('/enviar-correo-brevo', emailData)
    return data
}

// GET /api/portafolios
// Devuelve todos los portafolios públicos
export async function getPortafolios(): Promise<Portafolio[]> {
    const { data } = await apiClient.get<{ data: Portafolio[] }>('/public/portafolios')
    return data.data
}

// GET /api/mensajes/recibidos (requiere sesión activa)
// Devuelve los mensajes recibidos del portafolio seleccionado
export async function getMensajesRecibidos(idPortafolio?: string): Promise<unknown> {
    const { data } = await apiClient.get('/mensajes/recibidos', {
        params: idPortafolio ? { id_portafolio: idPortafolio } : undefined,
    })
    return data
}

// GET /api/mensajes/enviados (requiere sesión activa)
// Devuelve los mensajes enviados del portafolio seleccionado
export async function getMensajesEnviados(idPortafolio?: string): Promise<unknown> {
    const { data } = await apiClient.get('/mensajes/enviados', {
        params: idPortafolio ? { id_portafolio: idPortafolio } : undefined,
    })
    return data
}

// GET /api/mensajes/{mensaje} (requiere sesión activa)
// Devuelve un mensaje específico y lo marca como leído
export async function getMensaje(id: string): Promise<Mensaje> {
    const { data } = await apiClient.get<Mensaje>(`/mensajes/${id}`)
    return data
}

// POST /api/mensajes/{id}/destacar (requiere sesión activa)
// Toggle destacado del mensaje, devuelve el nuevo estado
export async function toggleDestacado(id: string): Promise<{ destacado: boolean }> {
    const { data } = await apiClient.post<{ destacado: boolean }>(`/mensajes/${id}/destacar`)
    return data
}

// GET /api/mensajes/destacados (requiere sesión activa)
// Devuelve los mensajes destacados del usuario autenticado
export async function getMensajesDestacados(idPortafolio?: string): Promise<unknown> {
    const { data } = await apiClient.get('/mensajes/destacados', {
        params: idPortafolio ? { id_portafolio: idPortafolio } : undefined,
    })
    return data
}
