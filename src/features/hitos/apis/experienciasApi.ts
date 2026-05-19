import apiClient from '@/api/api';
import { useAuthStore } from '@/stores/authStore'

export const getExperiencias = async () => {
  try {
    const response = await apiClient.get(`/experiencias`);
    return response.data.data;
  } catch (err) {
    console.error('Error al obtener experiencias:', err);
    throw err;
  }
};

export const crearExperiencia = async (datos: any) => {
  try {
    const response = await apiClient.post(`/experiencias`, datos);
    useAuthStore.getState().refreshPortafolio()
    return response.data;
  } catch (err) {
    console.log('Error al crear experiencia:', err);
    throw err;
  }
};

export const eliminarMultiplesExperiencias = async (ids: string[]) => {
  try {
    const response = await apiClient.delete('/experiencias/multiple', {
      data: { ids }
    });
    return response.data;
  } catch (error) {
    console.error('Error al eliminar múltiples experiencias:', error);
    throw error;
  }
};