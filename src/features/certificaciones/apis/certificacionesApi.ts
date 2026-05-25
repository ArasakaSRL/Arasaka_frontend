import apiClient from '@/api/api';
import { useAuthStore } from '@/stores/authStore'
import type { CertificacionAPI, CertificacionesResponse, CertificacionUnicaResponse, CrearCertificacionDTO, EliminarMultiplesResponse } from '../types';

const getIdPortafolio = (): string => {
  const id = useAuthStore.getState().portafolioSeleccionado?.id_portafolio
  if (!id) throw new Error('No hay portafolio seleccionado')
  return id
}

export const getTodasCertificaciones = async (): Promise<CertificacionAPI[]> => {
  try {
    const id = getIdPortafolio()
    const response = await apiClient.get<CertificacionesResponse>(`/portafolios/${id}/certificaciones`);
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener todas las certificaciones:', error);
    throw error;
  }
};

export const getCertificacionesPorCategoria = async (idCategoria: string): Promise<CertificacionAPI[]> => {
  try {
    const id = getIdPortafolio()
    const response = await apiClient.get<CertificacionesResponse>(`/portafolios/${id}/certificaciones/categoria/${idCategoria}`);
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener certificaciones por categoría:', error);
    throw error;
  }
};

export const crearCertificacion = async (crearCertificacionDTO: CrearCertificacionDTO): Promise<[]> => {
  try {
    const id = getIdPortafolio()
    const response = await apiClient.post(`/portafolios/${id}/certificaciones`, crearCertificacionDTO);
    return response.data;
  } catch (error) {
    console.error('Error al crear certificación:', error);
    throw error;
  }
}

export const eliminarMultiplesCertificaciones = async (ids: string[]): Promise<EliminarMultiplesResponse> => {
  try {
    const id = getIdPortafolio()
    const response = await apiClient.delete<EliminarMultiplesResponse>(`/portafolios/${id}/certificaciones/multiple`, {
      data: { ids }
    });
    return response.data;
  } catch (error) {
    console.error('Error al eliminar múltiples certificaciones:', error);
    throw error;
  }
}

export const getCertificacionPorId = async (idCertificacion: string): Promise<CertificacionAPI> => {
  try {
    const id = getIdPortafolio()
    const response = await apiClient.get<CertificacionUnicaResponse>(`/portafolios/${id}/certificaciones/${idCertificacion}`);
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener la certificación por ID:', error);
    throw error;
  }
};
