// --- VISITANTES ---
export interface VisitanteAPI {
  id_visitante: string;
  id_portafolio: string;
  visitor_id: string;
  primera_visita: string;
  ultima_visita: string;
}

export interface VisitantesResponse {
  success: boolean;
  cantidad: number;
  data: VisitanteAPI[];
}

// --- INTERACCIONES ---
export interface InteraccionCertificacionAPI {
  id_interaccion: string;
  id_visitante: string;
  id_certificacion: string;
  nombre_certificacion: string;       // ← nuevo
  hover_count: number;
  hover_ms: number;
  clic_abrir_modal: number;
  clic_ver_credencial: number;
  clic_cerrar_modal: number;
  clic_general: number;
  ultima_interaccion: string;
}

export interface InteraccionExperienciaAPI {
  id_interaccion: string;
  id_visitante: string;
  id_experiencia: string;
  nombre_experiencia: string;         // ← nuevo
  fue_visible: boolean;
  hover_count: number;
  hover_ms: number;
  clic_general: number;
  ultima_interaccion: string;
}

export interface InteraccionHabilidadBlandaAPI {
  id_interaccion: string;
  id_visitante: string;
  id_habilidad: string;
  nombre_habilidad: string;           // ← nuevo
  hover_count: number;
  hover_ms: number;
  fue_visible: boolean;
  clic_general: number;
  ultima_interaccion: string;
}

export interface InteraccionHabilidadTecnicaAPI {
  id_interaccion: string;
  id_visitante: string;
  id_habilidad: string;
  nombre_habilidad: string;           // ← nuevo
  clic_expandir: number;
  clic_cerrar: number;
  clic_general: number;
  ultima_interaccion: string;
}

export interface InteraccionPerfilAPI {
  id_interaccion: string;
  id_visitante: string;
  hover_foto_count: number;
  hover_foto_ms: number;
  hover_correo_count: number;
  hover_correo_ms: number;
  clic_foto_perfil: number;
  clic_correo: number;
  clic_linkedin: number;
  clic_github: number;
  clic_contactar: number;
  clic_descargar_cv: number;
  clic_general: number;
  ultima_interaccion: string;
}

export interface InteraccionProyectoAPI {
  id_interaccion: string;
  id_visitante: string;
  id_proyecto: string;
  nombre_proyecto: string;            // ← nuevo
  hover_count: number;
  hover_ms: number;
  clic_github: number;
  clic_demo: number;
  clic_detalle: number;
  clic_general: number;
  ultima_interaccion: string;
}

export interface InteraccionesData {
  interaccion_certificacion: InteraccionCertificacionAPI[];
  interaccion_experiencia: InteraccionExperienciaAPI[];
  interaccion_habilidad_blanda: InteraccionHabilidadBlandaAPI[];
  interaccion_habilidad_tecnica: InteraccionHabilidadTecnicaAPI[];
  interaccion_perfil: InteraccionPerfilAPI[];
  interaccion_proyectos: InteraccionProyectoAPI[];
}

export interface InteraccionesResponse {
  success: boolean;
  id_portafolio: string;
  data: InteraccionesData;
}