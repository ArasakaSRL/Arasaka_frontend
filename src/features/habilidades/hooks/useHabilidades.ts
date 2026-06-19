import { useEffect, useState } from "react";
import {
  obtenerTecnologias,
  type Tecnologia,
} from "../lib/HabilidadesApi";
import { createTecnologia } from "@/features/tegnologias/lib/tegnologia.service";

export const useHabilidadesData = () => {
  const [tecnologias, setTecnologias] = useState<
    { label: string; value: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const cargarTecnologias = async () => {
    const tec: Tecnologia[] =
      await obtenerTecnologias();

    setTecnologias(
      tec.map((t) => ({
        label: t.nombre,
        value: t.id_tecnologia,
      }))
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        await cargarTecnologias();
      } catch (error) {
        console.error(
          "Error cargando datos",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const agregarTecnologia = async (
    nombre: string
  ) => {
    try {
      const response = await createTecnologia({
        nombre,
        descripcion: "",
        logo: "",
      });

      if (!response.success) {
        return null;
      }

      const tecnologiaCreada =
        response.data.find(
          (tech) =>
            tech.nombre
              .trim()
              .toLowerCase() ===
            nombre
              .trim()
              .toLowerCase()
        );

      await cargarTecnologias();

      return tecnologiaCreada ?? null;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  return {
    tecnologias,
    loading,
    agregarTecnologia,
  };
};