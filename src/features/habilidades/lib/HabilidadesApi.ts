import apiClient from "../../../api/api";

export interface Habilidad {
  id_categoria_habilidad: string;
  id_portafolio: string;
  nivel: string;
  id_tecnologia?: string;
  nombre?: string;
}

export interface Categoria {
  id_categoria_habilidad: string;
  nombre: string;
}

export interface Nivel {
  id_nivel_habilidad: string;
  nivel: string;
}

export interface Tecnologia {
  id_tecnologia: string;
  nombre: string;
}

export const crearHabilidad = async (data: Habilidad) => {
  const res = await apiClient.post("/api/habilidades", data);
  return res.data;
};

export const obtenerCategorias = async (): Promise<Categoria[]> => {
  const response = await apiClient.get("/api/categorias-habilidad");
  return response.data.data;
}

export const obtenerNiveles = async (): Promise<Nivel[]> => {
  const response = await apiClient.get("/api/niveles-habilidad");
  return response.data.data;
}

export const obtenerTecnologias = async (): Promise<Tecnologia[]> => {
  const response = await apiClient.get("/api/tecnologias");
  return response.data.data;
}

