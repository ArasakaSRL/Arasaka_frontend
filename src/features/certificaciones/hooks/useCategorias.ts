import { useState, useEffect } from 'react';
import type { Categoria } from '../types';
import { getCategorias } from '../apis/categoriasApi';

// Tus datos de prueba 
const categoriasDePrueba: Categoria[] = [
  {
    id: "test-1",
    nombre: "Académico",
    descripcion: "Diplomas, logros educativos, etc",
    url_imagen: "https://images.unsplash.com/photo-1523240795612-9a054b0db644",
  },
  {
    id: "test-2",
    nombre: "Idiomas",
    descripcion: "Diplomas y certificados, etc",
    url_imagen: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  },
  {
    id: "test-3",
    nombre: "DevOps",
    descripcion: "Cloud, CI/CD",
    url_imagen: "https://images.unsplash.com/photo-1523240795612-9a054b0db644",
  },
  {
    id: "test-4",
    nombre: "Data",
    descripcion: "AI, ML",
    url_imagen: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  },
];

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
          setCategorias(categoriasDePrueba);
          setIsUsingFallback(true);
        }
      } catch (err) {
        console.error('La base de datos está caída, usando datos de prueba.', err);
        // Si hay error (BD caída), seteamos los datos de prueba
        setCategorias(categoriasDePrueba);
        setIsUsingFallback(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  return { categorias, isLoading, isUsingFallback };
}