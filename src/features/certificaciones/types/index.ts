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
  fecha_obtencion: string | null; 
  url_archivo: string;
  orientacion_imagen: "horizontal" | "vertical" | string; 
  categoria_certificacion: CategoriaAnidada;
}

export interface CertificacionesResponse {
  data: CertificacionAPI[];
}

export interface CrearCertificacionDTO {
  titulo: string;
  descripcion: string;
  institucion_emisora: string;
  fecha_obtencion: string; // Formato YYYY-MM-DD
  url_archivo: string;
  orientacion_imagen: "horizontal" | "vertical";
  id_categoria_certificacion: string;
}
export interface EliminarMultiplesDTO {
  ids: string[];
}

// Lo que responde la API
export interface EliminarMultiplesResponse {
  message: string;
  total_eliminadas: number;
}

export interface CertificacionUnicaResponse {
  data: CertificacionAPI; 
}

export interface CategoriaAnidada {
  id_categoria_certificacion: string;
  nombre_categoria: string;
  descripcion_categoria: string;
  url_imagen: string;
}