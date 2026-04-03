import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { getUsuario } from '@/features/auth/api/auth'

interface Props {
    children: React.ReactNode
}

// AuthLoader: al montar la app intenta recuperar el usuario de la sesión activa.
// Si la cookie de sesión sigue válida, obtiene los datos del usuario y los guarda en el store.
// Si no hay sesión, simplemente continúa sin usuario (las rutas protegidas redirigirán al login).
export default function AuthLoader({ children }: Props) {
    const setUser = useAuthStore(s => s.setUser)
    const [ready, setReady] = useState(false)

    useEffect(() => {
        getUsuario()
            .then(user => setUser(user))
            .catch(() => {}) // sin sesión activa, no hace nada
            .finally(() => setReady(true))
    }, [])

    if (!ready) return null // evita flash de contenido antes de saber si hay sesión

    return <>{children}</>
}
