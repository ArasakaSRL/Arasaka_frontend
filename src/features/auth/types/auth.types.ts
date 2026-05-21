export interface PortafolioPayload {
  nombre: string
  descripcion?: string
  visibilidad: boolean
}

export interface RegisterPayload {
  nombre: string
  apellido: string
  correo: string
  password: string
  password_confirmation: string
  biografia?: string
  url_foto?: string
  estado?: boolean
  verificacion_email?: boolean
  crear_portafolio?: boolean
  portafolio?: PortafolioPayload
}
export interface LoginPayload {
  correo?: string
  username?: string
  password: string
}

export interface LoginResponse {
  message?: string
}

export interface ResetPasswordPayload {
  token: string
  correo: string
  password: string
  password_confirmation: string
}

export interface CambiarContrasenaPayload {
  contrasena_actual: string
  contrasena_nueva: string
  contrasena_nueva_confirmation: string
}

export interface CambiarContrasenaResponse {
  message: string
}

export interface VerificarCorreoPayload {
  correo_nuevo: string
}

export interface VerificarCorreoResponse {
  message: string
}

export interface ConfirmarCorreoPayload {
  correo_nuevo: string
  codigo: string
}

export interface ConfirmarCorreoResponse {
  message: string
}
