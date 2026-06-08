import apiClient from '@/api/api';
import { useAuthStore } from '@/stores/authStore';
import type { 
  ConfiguracionPortafolio, 
  ConfiguracionResponse, 
  ActualizarConfiguracionDTO 
} from '../types';

// Utilidad para obtener el ID globalmente usando Zustand
const getIdPortafolio = (): string => {
  const id = useAuthStore.getState().portafolioSeleccionado?.id_portafolio;
  if (!id) throw new Error('No hay portafolio seleccionado');
  return id;
};

/**
 * Obtiene la configuración actual del portafolio.
 */
export const getConfiguracionPortafolio = async (): Promise<ConfiguracionPortafolio> => {
  try {
    const id = getIdPortafolio();
    // CORRECCIÓN: Cambiado de /configuracion-portafolio a /configuracion
    const response = await apiClient.get<ConfiguracionResponse>(`/configuracion?id_portafolio=${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener la configuración del portafolio:', error);
    throw error;
  }
};

/**
 * Actualiza parcialmente la configuración del portafolio (incluyendo la plantilla).
 */
export const actualizarConfiguracion = async (dto: ActualizarConfiguracionDTO): Promise<ConfiguracionPortafolio> => {
  try {
    const id = getIdPortafolio();
    // CORRECCIÓN: Cambiado de /configuracion-portafolio a /configuracion
    const response = await apiClient.put<ConfiguracionResponse>(`/configuracion?id_portafolio=${id}`, dto);
    return response.data.data;
  } catch (error) {
    console.error('Error al actualizar la configuración:', error);
    throw error;
  }
};