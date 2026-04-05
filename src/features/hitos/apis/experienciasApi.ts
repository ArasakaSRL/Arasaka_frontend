import apiClient from '@/api/api'; 

export const getExperiencias = async (idPortafolio: string) => {
  // 2. Usas apiClient y le pasas la ruta relativa empezando con /api
  const response = await apiClient.get(`/api/experiencias/portafolio/${idPortafolio}`);
  return response.data.data;
};

export const crearExperiencia = async (datos: any) => {
  // 3. Igual para el POST
  const response = await apiClient.post('/api/experiencias', datos);
  return response.data;
};