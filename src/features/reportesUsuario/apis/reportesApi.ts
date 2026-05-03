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