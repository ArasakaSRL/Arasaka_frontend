import apiClient from '@/api/api';
import { useAuthStore } from '@/stores/authStore';
import type {
  ConfiguracionPortafolio,
  ConfiguracionResponse,
  ActualizarConfiguracionDTO
} from '../types';

const getParams = () => {
  const id = useAuthStore.getState().portafolioSeleccionado?.id_portafolio
  return id ? { params: { id_portafolio: id } } : {}
}

export const getConfiguracion = async (): Promise<ConfiguracionPortafolio> => {
  const response = await apiClient.get<ConfiguracionResponse>('/configuracion', getParams());
  return response.data.data;
};

export const actualizarConfiguracion = async (
  datos: ActualizarConfiguracionDTO
): Promise<ConfiguracionPortafolio> => {
  const id = useAuthStore.getState().portafolioSeleccionado?.id_portafolio
  const response = await apiClient.put<ConfiguracionResponse>(
    '/configuracion',
    datos,
    id ? { params: { id_portafolio: id } } : {}
  );
  return response.data.data;
};
