import apiClient from '@/api/api'; 

export const getExperiencias = async () => {
  
  try {
    const response = await apiClient.get(`/experiencias`);
    return response.data.data;
  }catch (err){
    console.error('Error al obtener experiencias:', err);
    throw err;
  }
};

export const crearExperiencia = async (datos: any) => {
  try{
    const response = await apiClient.post(`/experiencias`, datos);
     return response.data;
  }catch(err){
    console.log('Error al crear experiencia:', err);
    throw err;
  }
};