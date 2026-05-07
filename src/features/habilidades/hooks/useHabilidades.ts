import { useEffect, useState } from "react";
import {
  obtenerTecnologias,
  type Tecnologia,
} from "../lib/HabilidadesApi";

export const useHabilidadesData = () => {
  const [tecnologias, setTecnologias] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const tec: Tecnologia[] = await obtenerTecnologias();

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
    tecnologias,
    loading,
  };
};