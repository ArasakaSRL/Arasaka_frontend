export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
  url_imagen: string;
}

export interface CategoriaResponse {
  data: Categoria[];
}