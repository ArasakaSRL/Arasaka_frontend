export interface ReportDataPayload  {
  enviar_email: string; // "true" o "false"
  email: string;
  fecha_corte: string;  // Formato "dd-mm-yyyy"
  incluir_vistas: boolean;
  incluir_proyectos: boolean;
  incluir_messages: boolean;
  incluir_cv: boolean;
}