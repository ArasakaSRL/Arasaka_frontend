export interface ExperienciaTimeline {
  id: any;
  id_experiencia: string;
  cargo: string;
  nombre_organizacion: string;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  vigente: boolean;
}

export interface CertificacionTimeline {
  id_certificacion: string;
  titulo: string;
  institucion_emisora: string;
  fecha_obtencion: string | null;
}