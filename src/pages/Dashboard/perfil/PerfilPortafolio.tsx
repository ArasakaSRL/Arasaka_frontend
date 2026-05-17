import { useEffect, useState } from 'react'
import DashboardLayout from '@/layout/DashboardLayout'
import PageHeader from '@/components/ui/PageHeader'
import { useAuthStore } from '@/stores/authStore'
import { getPortafolio } from '@/features/auth/api/update-perfilPersonal'
import PortafolioContenido from '@/features/auth/components/Dashboard/profile/preview/PortafolioContenido'
import { FolderOpen } from 'lucide-react'

export default function PerfilPortafolio() {
    const portafolioStore = useAuthStore(s => s.portafolio)
    const setPortafolio = useAuthStore(s => s.setPortafolio)
    const [loadingPortafolio, setLoadingPortafolio] = useState(!portafolioStore)

    useEffect(() => {
        if (portafolioStore) return
        getPortafolio()
            .then(setPortafolio)
            .catch(() => setPortafolio(null))
            .finally(() => setLoadingPortafolio(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <DashboardLayout>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                <div className="lg:col-span-12">
                    <PageHeader icon={FolderOpen} title="Portafolio" description="Explora el contenido público de tu portafolio profesional" />
                </div>

                <div className="lg:col-span-12">
                    <PortafolioContenido portafolio={portafolioStore} loadingPortafolio={loadingPortafolio} />
                </div>

            </div>
        </DashboardLayout>
    )
}
