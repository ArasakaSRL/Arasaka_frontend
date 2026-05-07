import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { getUsuario } from '@/features/auth/api/auth'
import { getPortafolio } from '@/features/auth/api/update-perfilPersonal'

interface Props {
    children: React.ReactNode
}

// AuthLoader: al montar la app intenta recuperar el usuario y su portafolio de la sesión activa.
// Si la cookie de sesión sigue válida, obtiene los datos y los guarda en el store.
// Si no hay sesión, simplemente continúa sin usuario.
export default function AuthLoader({ children }: Props) {
    const setUser = useAuthStore(s => s.setUser)
    const setPortafolio = useAuthStore(s => s.setPortafolio)
    const [ready, setReady] = useState(false)

    useEffect(() => {
        getUsuario()
            .then(async user => {
                if (!user) return
                setUser(user)
                // Cargar portafolio en paralelo solo si hay sesión activa
                getPortafolio()
                    .then(setPortafolio)
                    .catch(() => setPortafolio(null))
            })
            .catch(() => {})
            .finally(() => setReady(true))
    }, [])

    if (!ready) return null

    return <>{children}</>
}
