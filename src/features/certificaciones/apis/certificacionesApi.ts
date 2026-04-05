import apiClient from '@/api/api';
import type { CertificacionAPI, CertificacionesResponse, CrearCertificacionDTO } from '../types'; // Importa el nuevo DTO

export const getTodasCertificaciones = async (idPortafolio: string): Promise<CertificacionAPI[]> => {
  const response = await apiClient.get<CertificacionesResponse>(`/portafolios/${idPortafolio}/certificaciones`);
  return response.data.data;
};

export const getCertificacionesPorCategoria = async (idPortafolio: string, idCategoria: string): Promise<CertificacionAPI[]> => {
  // URL CORREGIDA para que coincida exactamente con tu backend
  const response = await apiClient.get<CertificacionesResponse>(
    `/portafolios/${idPortafolio}/certificaciones/categoria/${idCategoria}`
  );
  
  return response.data.data;
};

// NUEVA FUNCIÓN: Registrar certificación
export const crearCertificacion = async (idPortafolio: string, data: CrearCertificacionDTO): Promise<CertificacionAPI> => {
  const response = await apiClient.post<{ data: CertificacionAPI }>(
    `/portafolios/${idPortafolio}/certificaciones`,
    data
  );
  return response.data.data;
};