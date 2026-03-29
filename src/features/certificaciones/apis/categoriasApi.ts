import axios from 'axios';
import type { Categoria, CategoriaResponse } from '../types';

const API_URL = 'http://localhost:8000/api';

export const getCategorias = async (): Promise<Categoria[]> => {
  const response = await axios.get<CategoriaResponse>(`${API_URL}/categorias`);
  return response.data.data;
};