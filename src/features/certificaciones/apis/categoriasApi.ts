import apiClient from '@/api/api'; 
import type { Categoria, CategoriaResponse } from '../types';

// Ya no necesitas el API_URL manual

export const getCategorias = async (): Promise<Categoria[]> => {
  // 2. Usas apiClient y le pasas la ruta relativa (asegúrate de incluir /api)
  const response = await apiClient.get<CategoriaResponse>('/api/categorias');
  return response.data.data;
};