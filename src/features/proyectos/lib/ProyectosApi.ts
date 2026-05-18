import apiClient from "../../../api/api"
import { useAuthStore } from '@/stores/authStore'

export interface ProyectoFormData {
    nombre: string;
    descripcion?: string;
    fecha_inicio: string;
    fecha_fin?: string;
    tecnologias: string[];
    url_demo?: string;
    url_github?: string;
    url_imagen?: string[];
}

export interface Proyecto {
    id_portafolio:string;
    id_proyecto: string;
    nombre: string;
    descripcion: string;
    fecha_inicio: string;
    fecha_fin: string;
    tecnologias: Tecnologias[]
    url_imagen: Imagen[];
    url_demo?: string | null;
    url_github?: string | null;
}

export interface Imagen {
    id_tecnologia: string;
    nombre: string;
    logo: string;
}

export interface Tecnologias {
    id_tecnologia: string;
    nombre: string;
    descripcion?: string;
    logo?: string;
}

export const crearProyecto = async (data: ProyectoFormData): Promise<Proyecto> => {
  const response = await apiClient.post(`/portafolios/proyectos`, data);
  useAuthStore.getState().refreshPortafolio()
  return response.data.data;
};

export const obtenerTecnologia = async (): Promise<Tecnologias[]> => {
    const response = await apiClient.get("/tecnologias");
    return response.data.data;
}

export const obtenerProyectos = async (): Promise<Proyecto[]> => {
    const response = await apiClient.get("/portafolios/proyectos");
    return response.data.data;
}

export const editarProyecto = async (id_proyecto: string, data: Partial<ProyectoFormData>): Promise<Proyecto> => {
    const response = await apiClient.put(`/portafolios/proyectos/${id_proyecto}`, data);
    useAuthStore.getState().refreshPortafolio()
    return response.data.data;
}

export const eliminarProyecto = async (id_proyecto: string) => {
    const response = await apiClient.delete(`/portafolios/proyectos/${id_proyecto}`);
    useAuthStore.getState().refreshPortafolio()
    return response.data;
}