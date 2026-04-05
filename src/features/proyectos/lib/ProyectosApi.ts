import apiClient from "../../../api/api"

export interface ProyectoFormData {
    id_proyecto?: string;
    id_portafolio: string;
    nombre: string;
    descripcion?: string;
    fecha_inicio: string;
    fecha_fin?: string;
    tecnologias: { id_tecnologia: string }[];
    url_proyecto?: string;
    url_repositorio?: string;
}



export interface Proyecto {
    id_portafolio:string;
    id_proyecto: string;
    nombre: string;
    descripcion?: string;
    fecha_inicio: string;
    fecha_fin?: string;
    tecnologias: Tecnologias[]
    url_demo?: string | null;
    url_repositorio?: string | null;
}

export interface Tecnologias {
    id_tecnologia: string;
    nombre: string;
    descripcion?: string;
    logo?: string;
}

export const crearProyecto = async (data: ProyectoFormData): Promise<Proyecto> => {
  const response = await apiClient.post(`/api/portafolios/${data.id_portafolio}/proyectos`, data);
  return response.data.data;
};

export const obtenerTecnologia = async (): Promise<Tecnologias[]> => {
    const response = await apiClient.get("/api/tecnologias");
    return response.data.data;
}

export const obtenerProyectos = async (idPortafolio: string): Promise<Proyecto[]> => {
    const response = await apiClient.get(`/api/portafolios/${idPortafolio}/proyectos`);
    return response.data.data;
}
