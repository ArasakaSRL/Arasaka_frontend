import api from '@/api/axios'
import axios from 'axios'
import type { RegisterPayload, LoginPayload, LoginResponse, ResetPasswordPayload } from '../types/auth.types'

// getCsrfCookie: obtiene el token CSRF de Laravel antes de hacer peticiones POST.
// Laravel usa CSRF (Cross-Site Request Forgery) como medida de seguridad para
// verificar que las peticiones vienen de tu propio frontend y no de otro sitio malicioso.
// Al llamar este endpoint, Laravel setea una cookie llamada "XSRF-TOKEN" en el navegador,
// y axios la lee automáticamente y la envía en el header "X-XSRF-TOKEN" en cada POST.
// Sin esto, Laravel rechaza la petición con error 419 (CSRF token mismatch).
const getCsrfCookie = () => axios.get(`${import.meta.env.VITE_API_URL}/sanctum/csrf-cookie`, { withCredentials: true })

// Endpoints

// POST /registrar
export async function registerRequest(payload: RegisterPayload) {
  await getCsrfCookie()
  const { data } = await api.post('/api/registrar', payload)
  return data
}

// iniciar-sesion
export async function loginRequest(payload: LoginPayload): Promise<LoginResponse> {
  await getCsrfCookie()
  const { data } = await api.post<LoginResponse>('/api/iniciar-sesion', payload)
  return data
}

// cerrar-sesion (requiere sesión activa)
export async function logoutRequest() {
  await getCsrfCookie()
  const { data } = await api.post('/api/cerrar-sesion')
  return data
}

// recuperar-contrasena
export async function forgotPasswordRequest(correo: string) {
  const { data } = await api.post('/api/recuperar-contrasena', { correo })
  return data
}

// restablecer-contrasena
export async function resetPasswordRequest(payload: ResetPasswordPayload) {
  const { data } = await api.post('/api/restablecer-contrasena', payload)
  return data
}

// correo/notificacion-verificacion (requiere sesión activa)
export async function resendVerificationEmail() {
  const { data } = await api.post('/api/correo/notificacion-verificacion')
  return data
}
