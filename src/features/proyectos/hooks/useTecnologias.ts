import { useEffect, useState } from "react";
import { obtenerTecnologia } from "../lib/ProyectosApi";

export const useTecnologias = () => {
  const [opciones, setOpciones] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTecnologias = async () => {
      try {
        setLoading(true);

        const data = await obtenerTecnologia();

        const formatted = data.map((tech) => ({
          label: tech.nombre,
          value: tech.id_tecnologia,
        }));

        setOpciones(formatted);
      } catch (error) {
        console.error("Error al cargar tecnologías", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTecnologias();
  }, []);

  return { opciones, loading };
};