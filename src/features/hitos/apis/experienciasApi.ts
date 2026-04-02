import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const getExperiencias = async (idPortafolio: string) => {
  const response = await axios.get(`${API_URL}/experiencias/portafolio/${idPortafolio}`);
  return response.data.data;
};

export const crearExperiencia = async (datos: any) => {
  const response = await axios.post(`${API_URL}/experiencias`, datos);
  return response.data;
};