import { useEffect, useState } from 'react'
import { useAuthStore, resolverPortafolioDesdeArray } from '@/stores/authStore'
import { getUsuario } from '@/features/auth/api/auth'

interface Props {
    children: React.ReactNode
}

export default function AuthLoader({ children }: Props) {
    const setUser = useAuthStore(s => s.setUser)
    const setPortafolio = useAuthStore(s => s.setPortafolio)
    const [ready, setReady] = useState(false)

    useEffect(() => {
        getUsuario()
            .then(user => {
                if (!user) return
                setUser(user)
                const seleccionado = resolverPortafolioDesdeArray(user.portafolios ?? [])
                setPortafolio(seleccionado)
            })
            .catch(() => {})
            .finally(() => setReady(true))
    }, [])

    if (!ready) return null

    return <>{children}</>
}
