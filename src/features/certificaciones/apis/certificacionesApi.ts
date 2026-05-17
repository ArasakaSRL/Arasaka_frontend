import apiClient from '@/api/api';
import type { CertificacionAPI, CertificacionesResponse, CrearCertificacionDTO, EliminarMultiplesResponse } from '../types'; 

export const getTodasCertificaciones = async (): Promise<CertificacionAPI[]> => {
  try {
   const response = await apiClient.get<CertificacionesResponse>('/certificaciones/');
    return response.data.data;
   }catch (error) {
    console.error('Error al obtener todas las certificaciones:', error);
    throw error;
  }
};

export const getCertificacionesPorCategoria = async ( idCategoria: string): Promise<CertificacionAPI[]> => {
  
  try {
    const response = await apiClient.get<CertificacionesResponse>(`/certificaciones/categoria/${ idCategoria}`);
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener certificaciones por categoría:', error);
    throw error;
  }
  
};

export const crearCertificacion =  async (crearCertificacionDTO: CrearCertificacionDTO): Promise<[]> => { 
  try {
    const response = await apiClient.post(`/certificaciones/`, crearCertificacionDTO);
    return response.data; 
  } catch (error) {
    console.error('Error al crear certificación:', error);
    throw error; 
  }
}

export const eliminarMultiplesCertificaciones = async (ids: string[]): Promise<EliminarMultiplesResponse> => {
  try {
    const response = await apiClient.delete<EliminarMultiplesResponse>('/certificaciones/multiple', {
      data: { ids }
    });
    return response.data;
  } catch (error) {
    console.error('Error al eliminar múltiples certificaciones:', error);
    throw error;
  }
}