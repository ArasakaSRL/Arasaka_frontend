import { useEffect, useState } from 'react'
import DashboardLayout from '@/layout/DashboardLayout'
import PageHeader from '@/components/ui/PageHeader'
import { useAuthStore } from '@/stores/authStore'
import { getPortafolio } from '@/features/auth/api/update-perfilPersonal'
import PortafolioContenido from '@/features/auth/components/Dashboard/profile/preview/PortafolioContenido'
import { FolderOpen } from 'lucide-react'

export default function PerfilPortafolio() {
    const portafolioSeleccionado = useAuthStore(s => s.portafolioSeleccionado)
    const setPortafolio = useAuthStore(s => s.setPortafolio)
    const [portafolioCompleto, setPortafolioCompleto] = useState<typeof portafolioSeleccionado>(null)
    const [loadingPortafolio, setLoadingPortafolio] = useState(true)

    useEffect(() => {
        if (!portafolioSeleccionado) return
        setLoadingPortafolio(true)
        getPortafolio(portafolioSeleccionado.id_portafolio)
            .then(data => { setPortafolioCompleto(data); setPortafolio(data) })
            .catch(() => setPortafolioCompleto(null))
            .finally(() => setLoadingPortafolio(false))
    }, [portafolioSeleccionado?.id_portafolio])

    return (
        <DashboardLayout>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                <div className="lg:col-span-12">
                    <PageHeader icon={FolderOpen} title="Portafolio" description="Explora el contenido público de tu portafolio profesional" />
                </div>

                <div className="lg:col-span-12">
                    <PortafolioContenido portafolio={portafolioCompleto} loadingPortafolio={loadingPortafolio} />
                </div>

            </div>
        </DashboardLayout>
    )
}
