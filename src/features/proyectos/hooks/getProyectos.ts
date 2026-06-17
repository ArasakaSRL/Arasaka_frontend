import { useEffect, useState } from "react";
import { obtenerProyectos, type Proyecto } from "../lib/ProyectosApi";
import { useAuthStore } from "@/stores/authStore";

export const useProyectos = () => {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);
  const idPortafolio = useAuthStore(s => s.portafolioSeleccionado?.id_portafolio)

  useEffect(() => {
    if (!idPortafolio) return
    const fetchProyectos = async () => {
      setLoading(true)
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
  }, [idPortafolio]);

  return { proyectos, setProyectos, loading };
}