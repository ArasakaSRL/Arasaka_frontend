import { create } from 'zustand'
import type { PortafolioCompleto } from '@/features/auth/types/portafolioData'

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
  slug?: string
}

export interface AuthUser {
  id: string
  nombre: string
  apellido: string
  username: string
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
  portafolio: PortafolioCompleto | null
  setUser: (user: AuthUser) => void
  setPortafolio: (portafolio: PortafolioCompleto | null) => void
  refreshPortafolio: () => Promise<void>
  clearUser: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  portafolio: null,
  setUser: (user) => set({ user }),
  setPortafolio: (portafolio) => set({ portafolio }),
  refreshPortafolio: async () => {
    try {
      const { getPortafolio } = await import('@/features/auth/api/update-perfilPersonal')
      const data = await getPortafolio()
      set({ portafolio: data })
    } catch {
      set({ portafolio: null })
    }
  },
  clearUser: () => set({ user: null, portafolio: null }),
}))
