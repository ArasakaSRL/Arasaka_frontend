import DashboardLayout from '@/layout/DashboardLayout'
import { getMensajesRecibidos } from '@/features/sendGmail/api/sendGmail'
import BandejaMensajes from '@/features/sendGmail/components/mensajes/BandejaMensajes'
import PageHeader from '@/components/ui/PageHeader'
import { Inbox } from 'lucide-react'
import { useCallback } from 'react'

export default function MensajesRecibidos() {
    const fetcher = useCallback(() => getMensajesRecibidos(), [])

    return (
        <DashboardLayout>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                <div className="lg:col-span-12">
                    <PageHeader
                        icon={Inbox}
                        title="Recibidos"
                        description="Mensajes que has recibido"
                    />
                </div>

                <div className="lg:col-span-12">
                    <BandejaMensajes tab="recibidos" fetcher={fetcher} />
                </div>

            </div>
        </DashboardLayout>
    )
}
