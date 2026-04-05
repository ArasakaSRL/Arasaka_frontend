import apiClient from '@/api/api'; 

export const getExperiencias = async (idPortafolio: string) => {
  const response = await apiClient.get(`/experiencias/portafolio/${idPortafolio}`);
  return response.data.data;
};

export const crearExperiencia = async (datos: any) => {
  const response = await apiClient.post(`/experiencias`, datos);
  return response.data;
};