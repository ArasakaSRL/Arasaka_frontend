import axios from 'axios';
import type { CertificacionAPI, CertificacionesResponse, CrearCertificacionDTO } from '../types'; // Importa el nuevo DTO

const API_URL = 'http://localhost:8000/api';

export const getTodasCertificaciones = async (idPortafolio: string): Promise<CertificacionAPI[]> => {
  const response = await axios.get<CertificacionesResponse>(`${API_URL}/portafolios/${idPortafolio}/certificaciones`);
  return response.data.data;
};

export const getCertificacionesPorCategoria = async (idPortafolio: string, idCategoria: string): Promise<CertificacionAPI[]> => {
  const response = await axios.get<CertificacionesResponse>(`${API_URL}/portafolios/${idPortafolio}/categorias/${idCategoria}/certificaciones`);
  return response.data.data;
};

// NUEVA FUNCIÓN: Registrar certificación
export const crearCertificacion = async (idPortafolio: string, data: CrearCertificacionDTO): Promise<CertificacionAPI> => {
  const response = await axios.post<{ data: CertificacionAPI }>(
    `${API_URL}/portafolios/${idPortafolio}/certificaciones`,
    data
  );
  return response.data.data;
};