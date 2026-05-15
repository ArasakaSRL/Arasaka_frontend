import DashboardLayout from '@/layout/DashboardLayout'
import { getMensajesDestacados } from '@/features/sendGmail/api/sendGmail'
import BandejaMensajes from '@/features/sendGmail/components/mensajes/BandejaMensajes'
import PageHeader from '@/components/ui/PageHeader'
import { Star } from 'lucide-react'
import { useCallback } from 'react'

export default function MensajesDestacados() {
    const fetcher = useCallback(() => getMensajesDestacados(), [])

    return (
        <DashboardLayout>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                <div className="lg:col-span-12">
                    <PageHeader
                        icon={Star}
                        title="Destacados"
                        description="Mensajes que has marcado como destacados"
                        iconClassName="text-amber-400"
                    />
                </div>

                <div className="lg:col-span-12">
                    <BandejaMensajes tab="destacados" fetcher={fetcher} />
                </div>

            </div>
        </DashboardLayout>
    )
}
