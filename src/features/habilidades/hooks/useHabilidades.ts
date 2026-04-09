import { useEffect, useState } from "react";
import {
  obtenerCategorias,
  obtenerNiveles,
  obtenerTecnologias,
  type Categoria,
  type Nivel,
  type Tecnologia,
} from "../lib/HabilidadesApi";

export const useHabilidadesData = () => {
  const [categorias, setCategorias] = useState<{ label: string; value: string }[]>([]);
  const [niveles, setNiveles] = useState<{ label: string; value: string }[]>([]);
  const [tecnologias, setTecnologias] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Peticiones en paralelo: todas se lanzan al mismo tiempo
        const cat: Categoria[] = await obtenerCategorias();
        const niv: Nivel[] = await obtenerNiveles();
        const tec: Tecnologia[] = await obtenerTecnologias();

        setCategorias(cat.map(c => ({
          label: c.nombre,
          value: c.id_categoria_habilidad,
        })));

        setNiveles(niv.map(n => ({
          label: n.nivel,
          value: n.id_nivel_habilidad,
        })));

        setTecnologias(tec.map(t => ({
          label: t.nombre,
          value: t.id_tecnologia,
        })));

      } catch (error) {
        console.error("Error cargando datos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    categorias,
    niveles,
    tecnologias,
    loading,
  };
};