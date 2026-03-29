import api from './axios'
import type { RegisterPayload, LoginPayload, LoginResponse, ResetPasswordPayload } from '../types/auth.types'

// Endpoints

//registrar
export async function registerRequest(payload: RegisterPayload) {
  const { data } = await api.post('/api/registrar', payload)
  return data
}

//iniciar-sesion
export async function loginRequest(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/api/iniciar-sesion', payload)
  return data
}

//cerrar-sesion (requiere token)
export async function logoutRequest() {
  const { data } = await api.post('/cerrar-sesion')
  return data
}

//recuperar-contrasena
export async function forgotPasswordRequest(correo: string) {
  const { data } = await api.post('/recuperar-contrasena', { correo })
  return data
}

//restablecer-contrasena
export async function resetPasswordRequest(payload: ResetPasswordPayload) {
  const { data } = await api.post('/restablecer-contrasena', payload)
  return data
}

// correo/notificacion-verificacion (requiere token)
export async function resendVerificationEmail() {
  const { data } = await api.post('/correo/notificacion-verificacion')
  return data
}
