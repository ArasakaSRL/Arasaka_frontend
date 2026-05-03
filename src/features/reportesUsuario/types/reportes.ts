// Define los posibles niveles que devuelve el backend
export interface NivelesHabilidad {
  Principiante?: number;
  Intermedio?: number;
  Competente?: number;
  Avanzado?: number;
  Experto?: number;
}

// Define la estructura principal de las estadísticas
export interface EstadisticasData {
  experiencias: number;
  proyectos: number;
  habilidades: {
    tecnica: NivelesHabilidad;
    blanda: NivelesHabilidad;
  };
  visitas: {
    totales: number;
    unicas: number;
  };
}

// La respuesta estándar envuelta en "data"
export interface EstadisticasResponse {
  data: EstadisticasData;
}

export interface HeatmapPerfil {
  hover_foto_count:   number | null
  hover_foto_ms:      number | null
  hover_correo_count: number | null
  hover_correo_ms:    number | null
  clic_foto_perfil:   number | null
  clic_correo:        number | null
  clic_linkedin:      number | null
  clic_github:        number | null
  clic_contactar:     number | null
  clic_descargar_cv:  number | null
}