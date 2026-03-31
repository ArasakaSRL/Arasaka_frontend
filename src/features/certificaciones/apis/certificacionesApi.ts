import axios from 'axios';
import type { CertificacionAPI, CertificacionesResponse } from '../types';

const API_URL = 'http://localhost:8000/api';

export const getTodasCertificaciones = async (idPortafolio: string): Promise<CertificacionAPI[]> => {
  const response = await axios.get<CertificacionesResponse>(`${API_URL}/portafolios/${idPortafolio}/certificaciones`);
  return response.data.data;
};

export const getCertificacionesPorCategoria = async (idPortafolio: string, idCategoria: string): Promise<CertificacionAPI[]> => {
  const response = await axios.get<CertificacionesResponse>(`${API_URL}/portafolios/${idPortafolio}/categorias/${idCategoria}/certificaciones`);
  return response.data.data;
};