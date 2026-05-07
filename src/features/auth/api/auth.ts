import apiClient from '@/api/api'
import axios from 'axios'
import type { RegisterPayload, LoginPayload, LoginResponse, ResetPasswordPayload } from '../types/auth.types'
import type { AuthUser } from '@/stores/authStore'

interface AuthenticateResponse {
  message: string
  user: AuthUser
}

// getCsrfCookie: obtiene el token CSRF de Laravel antes de hacer peticiones POST.
// Laravel usa CSRF (Cross-Site Request Forgery) como medida de seguridad para
// verificar que las peticiones vienen de tu propio frontend y no de otro sitio malicioso.
// Al llamar este endpoint, Laravel setea una cookie llamada "XSRF-TOKEN" en el navegador,
// y axios la lee automáticamente y la envía en el header "X-XSRF-TOKEN" en cada POST.
// Sin esto, Laravel rechaza la petición con error 419 (CSRF token mismatch).
const getCsrfCookie = () => axios.get(`${import.meta.env.VITE_API_BASE_URL}/sanctum/csrf-cookie`, { withCredentials: true })

// GET /autenticar — obtiene el usuario con todas sus relaciones (roles, profesiones, pais, telefonos, portafolio)
export async function getUsuario(): Promise<AuthUser | null> {
  try {
    const { data } = await apiClient.get<AuthenticateResponse>('/autenticar')
    return data.user
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null
    }
    throw error
  }
}

// POST /registrar
export async function registerRequest(payload: RegisterPayload) {
  const { data } = await apiClient.post('/registrar', payload)
  return data
}

// iniciar-sesion
export async function loginRequest(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>('/iniciar-sesion', payload)
  return data
}

// cerrar-sesion (requiere sesión activa)
export async function logoutRequest() {
  const { data } = await apiClient.post('/cerrar-sesion')
  return data
}

// firebaseAuth
export async function firebaseAuthRequest(id_token: string, correo: string | null, provider: string | null) {
  await getCsrfCookie()
  const { data } = await apiClient.post('/auth/firebase', { id_token, correo, provider })
  return data
}

// recuperar-contrasena
export async function sendPasswordResetEmail(correo: string) {
  const { data } = await apiClient.post('/recuperar-contrasena', { correo })
  return data
}

// restablecer-contrasena
export async function resetPasswordRequest(payload: ResetPasswordPayload) {
  const { data } = await apiClient.post('/restablecer-contrasena', payload)
  return data
}

// correo/notificacion-verificacion (requiere sesión activa)
export async function resendVerificationEmail() {
  const { data } = await apiClient.post('/correo/notificacion-verificacion')
  return data
}

/**
 * GET /verificar-correo/{id}/{hash}?expires=...&signature=...
 * Se dispara cuando el usuario hace clic en el enlace de su email.
 * Los query params expires y signature son requeridos por Laravel para validar la firma.
 */
export async function verifyEmailRequest(id: string, hash: string) {
  const params = new URLSearchParams(window.location.search)
  const { data } = await apiClient.get(`/verificar-correo/${id}/${hash}`, {
    params: {
      expires: params.get('expires'),
      signature: params.get('signature'),
    }
  })
  return data
}
