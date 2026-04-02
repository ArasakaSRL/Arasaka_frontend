import apiClient from "../../../api/api"

export interface Proyecto {
    id_portafolio:string;
    id_proyecto: string;
    nombre: string;
    descripcion?: string;
    fecha_inicio: string;
    fecha_fin?: string;
    tecnologias: string[]
    url_proyecto?: string | null;
    url_repositorio?: string | null;
}

export interface Tecnologias {
    id_tecnologia: string;
    nombre: string;
}

export const crearProyecto = async (data:Proyecto) => {
    const response = await apiClient.post("proyectos",data);
    return response.data;
}

export const obtenerTecnologia = async (): Promise<Tecnologias[]> => {
    const response = await apiClient.get("/tecnologias");
    return response.data.data;
}

export const obtenerProyectos = async (idPortafolio: string): Promise<Proyecto[]> => {
    const response = await apiClient.get(`/portafolios/${idPortafolio}/proyectos`);
    return response.data.data;
}
