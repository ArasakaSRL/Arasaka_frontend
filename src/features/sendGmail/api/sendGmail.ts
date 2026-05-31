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

// GET /api/public/portafolios (sin filtros, compatibilidad hacia atrás)
export async function getPortafolios(): Promise<Portafolio[]> {
    const { data } = await apiClient.get<{ data: Portafolio[] }>('/public/portafolios')
    return data.data
}

export type SortKey = 'nombre_asc' | 'nombre_desc' | 'proyectos' | 'habilidades'

export type FiltrosPortafolio = {
    busqueda?: string
    profesion?: string
    pais?: string
    tecnologia?: string
    idioma?: string
    orden?: SortKey
    por_pagina?: number
    page?: number
}

export type PaginatedPortafolios = {
    data: Portafolio[]
    meta: {
        current_page: number
        last_page: number
        per_page: number
        total: number
    }
}

export type CatalogosPublicos = {
    profesiones: { id_profesion: string; nombre: string }[]
    tecnologias: string[]
    idiomas: { id_idioma: string; nombre: string }[]
    paises: string[]
}

// GET /api/public/portafolios?busqueda=...&profesion=...&pais=...&tecnologia=...&idioma=...&orden=...&page=...
export async function getPortafoliosFiltrados(filtros: FiltrosPortafolio): Promise<PaginatedPortafolios> {
    const params: Record<string, string | number> = {}
    if (filtros.busqueda)   params.busqueda   = filtros.busqueda
    if (filtros.profesion)  params.profesion  = filtros.profesion
    if (filtros.pais)       params.pais       = filtros.pais
    if (filtros.tecnologia) params.tecnologia = filtros.tecnologia
    if (filtros.idioma)     params.idioma     = filtros.idioma
    if (filtros.orden)      params.orden      = filtros.orden
    if (filtros.por_pagina) params.por_pagina = filtros.por_pagina
    if (filtros.page)       params.page       = filtros.page

    const { data } = await apiClient.get<PaginatedPortafolios>('/public/portafolios', { params })
    return data
}

// GET /api/public/catalogos
// Devuelve todas las profesiones, tecnologías, idiomas y países desde la BD
export async function getCatalogosPublicos(): Promise<CatalogosPublicos> {
    const { data } = await apiClient.get<CatalogosPublicos>('/public/catalogos')
    return data
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
