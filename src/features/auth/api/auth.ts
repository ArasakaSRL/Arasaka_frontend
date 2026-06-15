import apiClient from '@/api/api'
import axios from 'axios'
import type { RegisterPayload, LoginPayload, LoginResponse, ResetPasswordPayload, CambiarContrasenaPayload, CambiarContrasenaResponse, VerificarCorreoPayload, VerificarCorreoResponse, ConfirmarCorreoPayload, ConfirmarCorreoResponse, CompletarPerfilPayload, CompletarPerfilResponse } from '../types/auth.types'
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

// GET /autenticar — obtiene el usuario con todas sus relaciones (portafolios y subrelaciones)
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

// POST /registrar/verificar
export async function verificarCodigoRegistro(correo: string, codigo: string) {
  const { data } = await apiClient.post('/registrar/verificar', { correo, codigo })
  return data
}

// POST /registrar/reenviar
export async function reenviarCodigoRegistro(correo: string) {
  const { data } = await apiClient.post('/registrar/reenviar', { correo })
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

// PATCH /usuario/contrasena — cambia la contraseña del usuario autenticado
export async function cambiarContrasena(payload: CambiarContrasenaPayload): Promise<CambiarContrasenaResponse> {
  const { data } = await apiClient.patch<CambiarContrasenaResponse>('/usuario/contrasena', payload)
  return data
}

// POST /usuario/completar-perfil — agrega username y password para usuarios OAuth
export async function completarPerfil(payload: CompletarPerfilPayload): Promise<CompletarPerfilResponse> {
  const { data } = await apiClient.post<CompletarPerfilResponse>('/usuario/completar-perfil', payload)
  return data
}

// POST /usuario/correo/verificar — verifica que el nuevo correo no exista y envía código
export async function verificarCorreo(payload: VerificarCorreoPayload): Promise<VerificarCorreoResponse> {
  const { data } = await apiClient.post<VerificarCorreoResponse>('/usuario/correo/verificar', payload)
  return data
}

// POST /usuario/correo/confirmar — valida el código y actualiza el correo
export async function confirmarCorreo(payload: ConfirmarCorreoPayload): Promise<ConfirmarCorreoResponse> {
  const { data } = await apiClient.post<ConfirmarCorreoResponse>('/usuario/correo/confirmar', payload)
  return data
}
