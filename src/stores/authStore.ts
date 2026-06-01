import { create } from 'zustand'
import type { PortafolioCompleto } from '@/features/auth/types/portafolioData'

const STORAGE_KEY = 'portafolio_seleccionado_id'

export function resolverPortafolioDesdeArray(portafolios: PortafolioCompleto[]): PortafolioCompleto | null {
  if (!portafolios.length) return null
  const idGuardado = localStorage.getItem(STORAGE_KEY)
  if (idGuardado) {
    const encontrado = portafolios.find(p => p.id_portafolio === idGuardado)
    if (encontrado) return encontrado
  }
  return portafolios[0]
}

export interface Rol {
  id: string
  name: string
}

export interface AuthUser {
  id: string
  nombre: string
  apellido: string
  username: string | null
  correo: string
  estado?: boolean
  url_foto?: string
  roles?: Rol[]
  portafolios?: PortafolioCompleto[]
  tour_completado?: boolean
  tiene_password: boolean
  perfil_completo: boolean
}

interface AuthState {
  user: AuthUser | null
  portafolio: PortafolioCompleto | null
  portafolioSeleccionado: PortafolioCompleto | null
  setUser: (user: AuthUser) => void
  setPortafolio: (portafolio: PortafolioCompleto | null) => void
  setPortafolioSeleccionado: (portafolio: PortafolioCompleto | null) => void
  refreshPortafolio: () => Promise<void>
  clearUser: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  portafolio: null,
  portafolioSeleccionado: null,

  setUser: (user) => set({ user }),

  setPortafolio: (portafolio) => {
    set({ portafolio, portafolioSeleccionado: portafolio })
  },

  setPortafolioSeleccionado: (portafolio) => {
    localStorage.setItem(STORAGE_KEY, portafolio?.id_portafolio ?? '')
    set({ portafolioSeleccionado: portafolio })
  },

  refreshPortafolio: async () => {
    try {
      const { getPortafolio } = await import('@/features/auth/api/update-perfilPersonal')
      const data = await getPortafolio()
      set((state) => ({
        portafolio: data,
        portafolioSeleccionado: state.portafolioSeleccionado ?? data,
      }))
    } catch {
      set({ portafolio: null })
    }
  },

  clearUser: () => {
    set({ user: null, portafolio: null, portafolioSeleccionado: null })
  },
}))
