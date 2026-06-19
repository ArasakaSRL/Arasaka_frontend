import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Resetea el scroll al inicio (top) cada vez que cambia la ruta.
 * Sin esto, el navegador conserva la posición de scroll de la página
 * anterior (p. ej. quedarse en el footer al ir de "/" a "/explorar").
 */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
