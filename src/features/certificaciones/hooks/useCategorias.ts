import { useState, useEffect } from 'react';
import type { Categoria } from '../types';
import { getCategorias } from '../apis/categoriasApi';

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setIsLoading(true);
        const data = await getCategorias();
        setCategorias(data);
      } catch (err) {
        setError('Error al obtener las categorías.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  return { categorias, isLoading, error };
}