import apiClient from "../../../api/api";

export interface Habilidad {
  id_categoria_habilidad: string;
  id_portafolio: string;
  id_nivel_habilidad: string;
  id_tecnologia?: string;
  nombre?: string;
}

export interface HabilidadUI {
  id_habilidad: string;
  nombre: string;
  id_nivel_habilidad: string;
  categoria: string;
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapHabilidad(apiData: any): Habilidad {
  return {
    id_categoria_habilidad: apiData["categoria habilidad"],
    id_portafolio: apiData.id_portafolio,
    id_nivel_habilidad: apiData["nivel habilidad"],
    id_tecnologia: apiData.id_tecnologia,
    nombre: apiData.nombre,
  };
}

export const crearHabilidad = async (data: Habilidad) => {
  const res = await apiClient.post("/portafolios/habilidades", data);

  const raw = Array.isArray(res.data.data)
    ? res.data.data[0]
    : res.data.data;

  return mapHabilidad(raw);
};

export const obtenerHabilidades = async (): Promise<HabilidadUI[]> => {
  const response = await apiClient.get("/portafolios/habilidades");

  return response.data.data.map((item: {
    id_habilidad: string;
    nombre: string;
    "nivel habilidad": string;
    "categoria habilidad": string;
  }) => ({
    id_habilidad: item.id_habilidad,
    nombre: item.nombre,
    nivel: item["nivel habilidad"],
    categoria: item["categoria habilidad"],
  }));
};

export const obtenerCategorias = async (): Promise<Categoria[]> => {
  const response = await apiClient.get("/categorias-habilidad");
  return response.data.data;
};

export const obtenerNiveles = async (): Promise<Nivel[]> => {
  const response = await apiClient.get("/niveles-habilidad");
  return response.data.data;
};

export const obtenerTecnologias = async (): Promise<Tecnologia[]> => {
  const response = await apiClient.get("/tecnologias");
  return response.data.data;
};
