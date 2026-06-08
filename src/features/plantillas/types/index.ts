export type TipoPlantilla = 'predeterminado' | 'minimalista' | 'profesional' | 'stiloPastel';

export interface ConfiguracionPortafolio {
  id_configuracion_portafolio: string;
  mostrar_proyectos: boolean;
  mostrar_habilidades: boolean;
  mostrar_experiencias: boolean;
  mostrar_servicios: boolean;
  mostrar_certificaciones: boolean;
  mostrar_redes_profesionales: boolean;
  mostrar_cv: boolean;
  mostrar_contacto: boolean;
  paleta_colores: string | null;
  visibilidad: boolean;
  plantilla: TipoPlantilla;
}

// Interfaz para la respuesta del Resource de Laravel
export interface ConfiguracionResponse {
  data: ConfiguracionPortafolio;
}

// DTO para enviar solo los datos que queremos actualizar
export interface ActualizarConfiguracionDTO {
  mostrar_proyectos?: boolean;
  mostrar_habilidades?: boolean;
  mostrar_experiencias?: boolean;
  mostrar_servicios?: boolean;
  mostrar_certificaciones?: boolean;
  mostrar_redes_profesionales?: boolean;
  mostrar_cv?: boolean;
  mostrar_contacto?: boolean;
  paleta_colores?: string | null;
  visibilidad?: boolean;
  plantilla?: TipoPlantilla;
}