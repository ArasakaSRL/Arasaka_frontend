import { useEffect, useState } from "react";
import { obtenerProyectoPorId } from "../lib/VistaProyectoApi";
import type { Proyecto } from "@/features/proyectos/lib/ProyectosApi";

export const useVistaProyecto = (
  id_proyecto: string
) => {

  const [proyecto, setProyecto] =
    useState<Proyecto | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {

    const cargarProyecto = async () => {

      try {

        setLoading(true);

        const data =
          await obtenerProyectoPorId(
            id_proyecto
          );

        setProyecto(data);

      } catch {

        setError(
          "No se pudo cargar el proyecto"
        );

      } finally {

        setLoading(false);

      }
    };

    if (id_proyecto) {
      cargarProyecto();
    }

  }, [id_proyecto]);

  return {
    proyecto,
    loading,
    error,
  };
}