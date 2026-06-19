export interface Tecnologia {
  id_tecnologia: string;
  nombre: string;
  descripcion: string;
  logo: string;
}

export interface TecnologiaResponse {
  success: boolean;
  message: string;
  data: Tecnologia[];
  pagination: Pagination ;

}
export type Pagination = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
export type CreateTecnologia ={
  nombre: string;
  descripcion?: string;
  logo?: string;
}