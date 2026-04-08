import apiClient from '@/api/api';
import type { Categoria, CategoriaResponse } from '../types';

export const getCategorias = async (): Promise<Categoria[]> => {
  const response = await apiClient.get<CategoriaResponse>(`/categorias`);
  return response.data.data;
};