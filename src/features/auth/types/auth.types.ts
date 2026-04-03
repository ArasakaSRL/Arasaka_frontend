export interface RegisterPayload {
  nombre: string,
  apellido: string,
  correo: string,
  password: string,
  password_confirmation: string,
  biografia?: string,
  url_foto?: string,
  estado?: boolean,
  verificacion_email?: boolean
}

export interface LoginPayload {
  correo: string
  password: string
}

export interface LoginResponse {
  message?: string
}

export interface ResetPasswordPayload {
  token: string //"token": "abc123...", usando cookies de sesión en lugar de tokens JWT
  correo: string
  password: string
  password_confirmation: string
}
