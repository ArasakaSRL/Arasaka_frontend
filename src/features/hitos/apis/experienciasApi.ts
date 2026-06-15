import apiClient from '@/api/api';
import { useAuthStore } from '@/stores/authStore'

const getIdPortafolio = (): string => {
  const id = useAuthStore.getState().portafolioSeleccionado?.id_portafolio
  if (!id) throw new Error('No hay portafolio seleccionado')
  return id
}

export const getExperiencias = async () => {
  try {
    const id = getIdPortafolio()
    const response = await apiClient.get(`/portafolios/${id}/experiencias`);
    return response.data.data;
  } catch (err) {
    console.error('Error al obtener experiencias:', err);
    throw err;
  }
};

export const crearExperiencia = async (datos: any) => {
  try {
    const id = getIdPortafolio()
    const response = await apiClient.post(`/portafolios/${id}/experiencias`, datos);
    useAuthStore.getState().refreshPortafolio()
    return response.data;
  } catch (err) {
    console.log('Error al crear experiencia:', err);
    throw err;
  }
};

export const eliminarExperiencia = async (idExperiencia: string) => {
  try {
    const id = getIdPortafolio()
    const response = await apiClient.delete(`/portafolios/${id}/experiencias/${idExperiencia}`);
    useAuthStore.getState().refreshPortafolio()
    return response.data;
  } catch (error) {
    console.error('Error al eliminar experiencia:', error);
    throw error;
  }
};

export const eliminarMultiplesExperiencias = async (ids: string[]) => {
  try {
    const id = getIdPortafolio()
    const response = await apiClient.delete(`/portafolios/${id}/experiencias/multiple`, {
      data: { ids }
    });
    return response.data;
  } catch (error) {
    console.error('Error al eliminar múltiples experiencias:', error);
    throw error;
  }
};
