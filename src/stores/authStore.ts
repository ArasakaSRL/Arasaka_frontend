import { create } from 'zustand'

export interface Rol {
  id: string
  name: string
}

export interface Profesion {
  id_profesion: string
  nombre: string
}

export interface Pais {
  id_pais?: string
  nombre: string
}

export interface Telefono {
  id_telefono?: string
  id_usuario?: string
  telefono: string
}

export interface Portafolio {
  id_portafolio: string
  nombre: string
  descripcion?: string
  visibilidad: boolean
}

export interface AuthUser {
  id: string
  nombre: string
  apellido: string
  correo: string
  biografia?: string
  descripcion_laboral?: string
  estado?: boolean
  url_foto?: string
  roles?: Rol[]
  profesiones?: Profesion[]
  pais?: Pais
  telefonos?: Telefono[]
  portafolio?: Portafolio
}

interface AuthState {
  user: AuthUser | null
  setUser: (user: AuthUser) => void
  clearUser: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}))
