import apiClient from '@/api/api'; 

import type { 
  ConfiguracionPortafolio, 
  ConfiguracionResponse, 
  ActualizarConfiguracionDTO 
} from '../types';

/**
 * Obtiene el estado actual de la configuración del portafolio.
 */
export const getConfiguracion = async (): Promise<ConfiguracionPortafolio> => {
  const response = await apiClient.get<ConfiguracionResponse>('/configuracion');
  return response.data.data;
};

export const actualizarConfiguracion = async (
  datos: ActualizarConfiguracionDTO
): Promise<ConfiguracionPortafolio> => {
  const response = await apiClient.put<ConfiguracionResponse>('/configuracion', datos);
  return response.data.data;
};