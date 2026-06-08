import apiClient from "@/api/api";

export interface Portafolio {
  id_portafolio: string;
  id_usuario: string;
  nombre: string;
  visibilidad: boolean;
  descripcion: string | null;
  slug: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
  link_activo: boolean;
  fecha_expiracion_link: string | null;
  duracion_link: string | null;
}

export interface Usuario {
  id_usuario: string;
  nombre: string;
  apellido: string;
  username: string;
  correo: string;
  url_foto: string;
  portafolios: Portafolio[];
  created_at: string;
  updated_at: string;
}

export type SortBy = "nombre" | "created_at";
export type Order = "asc" | "desc";

export const obtenerUsuarios = async (
  sortBy: SortBy = "nombre",
  order: Order = "asc"
): Promise<Usuario[]> => {
  console.log("consultando:", sortBy, order);
  
  const response = await apiClient.get("/admin/users", {
    params: {
      sortBy,
      order,
    },
  });

  return response.data.data;
};