import { useEffect, useState } from "react";
import { obtenerProyectos, type Proyecto } from "../lib/ProyectosApi";

export const useProyectos = () => {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const data = await obtenerProyectos();
        setProyectos(data);
      } catch (error) {
        console.error("Error al obtener proyectos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProyectos();
  }, []);

  return { proyectos, setProyectos,loading };
}