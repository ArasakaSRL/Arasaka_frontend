// La interfaz completa de la configuración
export interface ConfiguracionPortafolio {
  id_configuracion_portafolio: string;
  mostrar_proyectos: boolean;
  mostrar_habilidades: boolean;
  mostrar_experiencias: boolean;
  mostrar_servicios: boolean;
  mostrar_certificaciones: boolean;
  paleta_colores: string | null;
  visibilidad: boolean;
}

export interface ConfiguracionResponse {
  data: ConfiguracionPortafolio;
}

export type ActualizarConfiguracionDTO = Partial<Omit<ConfiguracionPortafolio, 'id_configuracion_portafolio'>>;