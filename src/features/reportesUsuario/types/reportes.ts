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