import apiClient from "../../../api/api"

export interface CrearProyecto {
    id_portafolio:string;
    nombre: string;
    descripcion?: string;
    fecha_inicio: string;
    fecha_fin?: string;
    url_proyecto?: string;
    url_repositorio?: string;
}

export const crearProyecto = async (data:CrearProyecto) => {
    const response = await apiClient.post("proyectos",data);
    return response.data;
}