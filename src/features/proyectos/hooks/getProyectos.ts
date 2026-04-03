import { useEffect, useState } from "react";
import { obtenerProyectos, type Proyecto } from "../lib/ProyectosApi";

export const useProyectos = (idPortafolio: string) => {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const data = await obtenerProyectos(idPortafolio);
        setProyectos(data);
      } catch (error) {
        console.error("Error al obtener proyectos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProyectos();
  }, [idPortafolio]);

  return { proyectos, loading };
}