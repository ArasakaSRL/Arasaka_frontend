import { useState, useEffect } from 'react';
import type { Categoria } from '../types';
import { getCategorias } from '../apis/categoriasApi';


export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUsingFallback, setIsUsingFallback] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setIsLoading(true);
        const data = await getCategorias();
        
        // Si la API responde pero está vacía
        if (data && data.length > 0) {
          setCategorias(data);
          setIsUsingFallback(false);
        } else {
          setIsUsingFallback(true);
        }
      } catch (err) {
        console.error('La base de datos está caída, usando datos de prueba.', err);
        // Si hay error (BD caída), seteamos los datos de prueba
        setIsUsingFallback(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  return { categorias, isLoading, isUsingFallback };
}