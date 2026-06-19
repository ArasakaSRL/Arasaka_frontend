import { useEffect, useState } from "react";
import { obtenerTecnologia } from "../lib/ProyectosApi";
import { createTecnologia } from "@/features/tegnologias/lib/tegnologia.service";
import { toast } from "@/components/Alerta";

export const useTecnologias = () => {
  const [opciones, setOpciones] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarTecnologias = async () => {
    try {
      const data = await obtenerTecnologia();

      const formatted = data.map((tech) => ({
        label: tech.nombre,
        value: tech.id_tecnologia,
      }));

      setOpciones(formatted);
    } catch (error) {
      console.error("Error al cargar tecnologías", error);
    }
  };

  useEffect(() => {
    const fetchTecnologias = async () => {
      setLoading(true);

      await cargarTecnologias();

      setLoading(false);
    };

    fetchTecnologias();
  }, []);

  const agregarTecnologia = async (
    nombre: string
    ): Promise<{
      id_tecnologia: string;
      nombre: string;
      descripcion: string | null;
      logo: string | null;
    } | null> => {
    try {
      const response = await createTecnologia({
        nombre,
      });

      if (!response.success) {
        toast.warning(response.message, 3000);
        return null;
      }

      const tecnologiaCreada = response.data.find(
        (tech) =>
          tech.nombre.trim().toLowerCase() ===
          nombre.trim().toLowerCase()
      );

      await cargarTecnologias();

      return tecnologiaCreada ?? null;
    } catch (error) {
      console.error(error);
      toast.warning("No se pudo crear la tecnología", 3000);
      return null;
    }
  };

  return {
    opciones,
    loading,
    agregarTecnologia,
  };
};