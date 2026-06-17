import apiClient from "../../../api/api";
import { useAuthStore } from '@/stores/authStore'

export interface Habilidad {
  categoria_habilidad: string;
  nivel: string;
  id_tecnologia?: string;
  nombre?: string;
}

export interface HabilidadUI {
  id_habilidad: string;
  nombre: string;
  nivel: string;
  categoria: string;
}

export interface Tecnologia {
  id_tecnologia: string;
  nombre: string;
}

const getIdPortafolio = (): string => {
  const id = useAuthStore.getState().portafolioSeleccionado?.id_portafolio
  if (!id) throw new Error('No hay portafolio seleccionado')
  return id
}

export const crearHabilidad = async (data: Habilidad) => {
  const id = getIdPortafolio()
  const res = await apiClient.post(`/portafolios/${id}/habilidades`, data);
  useAuthStore.getState().refreshPortafolio()
  const raw = Array.isArray(res.data.data)
    ? res.data.data[0]
    : res.data.data;

  return {
    id_habilidad: raw.id_habilidad,
    nombre: raw.nombre,
    nivel: raw["nivel habilidad"],
    categoria: raw["categoria habilidad"],
  };
};

export const obtenerHabilidades = async (): Promise<HabilidadUI[]> => {
  const id = getIdPortafolio()
  const response = await apiClient.get(`/portafolios/${id}/habilidades`);

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

export const obtenerTecnologias = async (): Promise<Tecnologia[]> => {
  const response = await apiClient.get("/tecnologias");
  return response.data.data;
};

export const editarHabilidad = async (id_habilidad: string, data: Partial<Habilidad>) => {
  const res = await apiClient.put(`/portafolios/habilidades/${id_habilidad}`, data);
  useAuthStore.getState().refreshPortafolio()

  const raw = Array.isArray(res.data.data)
    ? res.data.data[0]
    : res.data.data;

  return {
    id_habilidad: raw.id_habilidad,
    nombre: raw.nombre,
    nivel: raw["nivel habilidad"],
    categoria: raw["categoria habilidad"],
  };
};

export const eliminarHabilidad = async (id_habilidad: string) => {

  try {
    const response = await apiClient.delete(`/portafolios/habilidades/${id_habilidad}`);
    return response.data;
  }catch(err){
    console.log(err)
  }
};