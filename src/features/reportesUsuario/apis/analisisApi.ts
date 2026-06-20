import apiClient from '@/api/api';
import { useAuthStore } from '@/stores/authStore';
import type { VisitantesResponse, InteraccionesResponse } from '../types/analisis'; // Ajusta la ruta

const getIdPortafolio = (): string => {
  const id = useAuthStore.getState().portafolioSeleccionado?.id_portafolio;
  if (!id) throw new Error('No hay portafolio seleccionado');
  return id;
};

export const getVisitantes = async (): Promise<VisitantesResponse> => {
  try {
    const id = getIdPortafolio();
    // Mandamos el id_portafolio como query parameter como configuramos en el backend
    const response = await apiClient.get<VisitantesResponse>(`/visitantes?id_portafolio=${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener visitantes:', error);
    throw error;
  }
};

export const getInteracciones = async (): Promise<InteraccionesResponse> => {
  try {
    const id = getIdPortafolio();
    const response = await apiClient.get<InteraccionesResponse>(`/interacciones?id_portafolio=${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener interacciones:', error);
    throw error;
  }
};