export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
  url_imagen: string;
}

export interface CategoriaResponse {
  data: Categoria[];
}

export interface CertificacionAPI {
  id_certificacion: string;
  titulo: string;
  descripcion: string;
  institucion_emisora: string;
  fecha_obtencion: string;
  url_archivo: string;
  orientacion_imagen: "horizontal" | "vertical";
  id_categoria_certificacion: string;
  categoria_nombre: string;
}

export interface CertificacionesResponse {
  data: CertificacionAPI[];
}