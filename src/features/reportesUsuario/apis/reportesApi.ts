import apiClient from '@/api/api';
import type { EstadisticasData, EstadisticasResponse } from '../types/reportes';
import { useEffect, useState } from 'react';

interface Visitantes {
    total_visitantes:       number
    visitantes_nuevos:      number
    visitantes_recurrentes: number
    ultima_visita:          string
}

export function useVisitantes() {
    const [data, setData]       = useState<Visitantes | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError]     = useState<string | null>(null)

    useEffect(() => {
        apiClient.get<Visitantes>('/reportesUsr/heatmap/visitantes')
            .then(res => setData(res.data))
            .catch(err => {
                console.error('Error al obtener visitantes:', err)
                setError('No se pudo cargar')
            })
            .finally(() => setLoading(false))
    }, [])

    return { data, loading, error }
}

export const getEstadisticasPortafolio = async (): Promise<EstadisticasData> => {
  try {
    const response = await apiClient.get<EstadisticasResponse>('/mi-portafolio/estadisticas');
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener las estadísticas del portafolio:', error);
    throw error;
  }
};

export const getVisitantes = async () => {
    const response = await apiClient.get('/reportesUsr/heatmap/visitantes')
    return response.data
}

interface InteraccionesPerfil {
    hover_foto_count:   number | null
    hover_foto_ms:      number | null
    hover_correo_count: number | null
    hover_correo_ms:    number | null
    clic_foto_perfil:   number | null
    clic_correo:        number | null
    clic_linkedin:      number | null
    clic_github:        number | null
    clic_contactar:     number | null
    clic_descargar_cv:  number | null
}

export const getInteraccionesPerfil = async (): Promise<InteraccionesPerfil> => {
    const response = await apiClient.get('/reportesUsr/heatmap/perfil')
    return response.data
}

export async function getHeatmapPerfil() {
  const { data } = await apiClient.get('/reportesUsr/heatmap/perfil')
  return data
}

export async function getHeatmapHabilidadesTecnicas() {
  const { data } = await apiClient.get('/reportesUsr/heatmap/habilidades-tecnicas')
  return data
}

export const getClicsPerfil = async () => {
    const response = await apiClient.get('/reportesUsr/heatmap/perfil/clics')
    return response.data
}

export async function getVisitasPorMes() {
    const { data } = await apiClient.get('/reportesUsr/visitas-por-mes')
    return data as { mes: string; visitas: number }[]
}

export async function getCrecimientoMensual() {
    const { data } = await apiClient.get('/reportesUsr/crecimiento-mensual')
    return data as { mes: string; total: number }[]
}

export async function getClicsTecnicas() {
    const { data } = await apiClient.get('/reportesUsr/heatmap/habilidades-tecnicas/clics')
    return data as { x: number; y: number; intensidad: number }[]
}

export async function getClicsBlandas() {
    const { data } = await apiClient.get('/reportesUsr/heatmap/habilidades-blandas/clics')
    return data as { x: number; y: number; intensidad: number }[]
}

export async function getClicsExperiencia() {
    const { data } = await apiClient.get('/reportesUsr/heatmap/experiencia/clics')
    return data as { x: number; y: number; intensidad: number }[]
}

export async function getClicsProyectos() {
    const { data } = await apiClient.get('/reportesUsr/heatmap/proyecto/clics')
    return data as { x: number; y: number; intensidad: number }[]
}

export async function getClicsCertificaciones() {
    const { data } = await apiClient.get('/reportesUsr/heatmap/certificacion/clics')
    return data as { x: number; y: number; intensidad: number }[]
}