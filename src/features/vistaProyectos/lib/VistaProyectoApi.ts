import apiClient from "@/api/api";
import type { Proyecto } from "@/features/proyectos/lib/ProyectosApi";

export const obtenerProyectoPorId = async (id_proyecto: string): Promise<Proyecto> => {
    const response = await apiClient.get(`/portafolios/proyectos/${id_proyecto}`);
    return response.data.data;
}

