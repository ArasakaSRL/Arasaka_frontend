import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import apiClient from '@/api/api'

type NavigateFn = (path: string) => void
type SetSidebarFn = (open: boolean) => void

const isMobile = () => window.innerWidth < 768

const completarTour = async () => {
  try {
    await apiClient.patch('/usuario/tour')
  } catch (error) {
    console.error('Error al marcar tour como completado:', error)
  }
}

const waitForElement = (selector: string, timeout = 500): Promise<void> =>
  new Promise(resolve => {
    const el = document.querySelector(selector)
    if (el) return resolve()
    setTimeout(resolve, timeout)
  })

export const startOnboardingTour = (navigate: NavigateFn, setSidebar: SetSidebarFn) => {
  const mobile = isMobile()

  const driverObj = driver({
    showProgress: true,
    allowClose: true,
    smoothScroll: true,
    progressText: '{{current}} de {{total}}',
    nextBtnText: 'Siguiente →',
    prevBtnText: '← Anterior',
    doneBtnText: '¡Entendido!',
    steps: [
      {
        popover: {
          title: '👋 Bienvenido a tu Dashboard',
          description: 'Te guiaremos por las secciones principales para que puedas sacarle el máximo provecho a tu portafolio profesional.',
          side: 'over',
          align: 'center',
        }
      },
      {
        element: '#sidebar',
        popover: {
          title: '🧭 Navegación principal',
          description: 'Desde aquí accedes a todas las secciones de tu portafolio: perfil, proyectos, habilidades y más.',
          side: mobile ? 'bottom' : 'right',
          align: 'start',
        },
        onHighlightStarted: () => { if (mobile) setSidebar(true) },
      },
      {
        element: '#tour-perfil',
        popover: {
          title: '👤 Perfil Personal',
          description: 'Completa tu información profesional: nombre, biografía, foto y datos de contacto.',
          side: mobile ? 'bottom' : 'right',
          align: 'center',
        },
        onHighlightStarted: async () => {
          navigate('/Dashboard/perfil/General')
          if (mobile) { setSidebar(true); await waitForElement('#tour-perfil') }
        },
      },
      {
        element: '#tour-proyectos',
        popover: {
          title: '💼 Proyectos',
          description: 'Agrega los proyectos en los que has trabajado. Cada proyecto puede tener descripción, tecnologías usadas e imágenes.',
          side: mobile ? 'bottom' : 'right',
          align: 'center',
        },
        onHighlightStarted: async () => {
          navigate('/Dashboard/proyectos/Proyectos')
          if (mobile) { setSidebar(true); await waitForElement('#tour-proyectos') }
        },
      },
      {
        element: '#tour-habilidades',
        popover: {
          title: '⚡ Habilidades',
          description: 'Muestra tus habilidades técnicas y blandas para que los visitantes conozcan tu perfil.',
          side: mobile ? 'bottom' : 'right',
          align: 'center',
        },
        onHighlightStarted: async () => {
          navigate('/Dashboard/habilidades/Habilidades')
          if (mobile) { setSidebar(true); await waitForElement('#tour-habilidades') }
        },
      },
      {
        element: '#tour-experiencias',
        popover: {
          title: '🏆 Experiencias',
          description: 'Registra tus logros, hitos y experiencias laborales más importantes.',
          side: mobile ? 'bottom' : 'right',
          align: 'center',
        },
        onHighlightStarted: async () => {
          navigate('/Dashboard/hitos/Hitos')
          if (mobile) { setSidebar(true); await waitForElement('#tour-experiencias') }
        },
      },
      {
        element: '#tour-certificaciones',
        popover: {
          title: '🎓 Certificaciones',
          description: 'Agrega tus certificaciones y cursos completados para validar tu conocimiento.',
          side: mobile ? 'bottom' : 'right',
          align: 'center',
        },
        onHighlightStarted: async () => {
          navigate('/Dashboard/certificaciones/Certificaciones')
          if (mobile) { setSidebar(true); await waitForElement('#tour-certificaciones') }
        },
      },
      {
        element: '#tour-portafolios',
        popover: {
          title: '📁 Portafolios',
          description: 'Gestiona y visualiza tus portafolios públicos que los reclutadores pueden ver.',
          side: mobile ? 'bottom' : 'right',
          align: 'center',
        },
        onHighlightStarted: async () => {
          navigate('/Dashboard/admin/Usuarios')
          if (mobile) { setSidebar(true); await waitForElement('#tour-portafolios') }
        },
      },
    ],
    onDestroyStarted: async () => {
      if (mobile) setSidebar(false)
      await completarTour()
      sessionStorage.removeItem('tour_iniciado')
      driverObj.destroy()
    },
  })

  driverObj.drive()
}
