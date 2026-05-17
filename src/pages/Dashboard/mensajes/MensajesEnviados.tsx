import DashboardLayout from '@/layout/DashboardLayout'
import { getMensajesEnviados } from '@/features/sendGmail/api/sendGmail'
import BandejaMensajes from '@/features/sendGmail/components/mensajes/BandejaMensajes'
import PageHeader from '@/components/ui/PageHeader'
import { Send } from 'lucide-react'
import { useCallback } from 'react'

export default function MensajesEnviados() {
    const fetcher = useCallback(() => getMensajesEnviados(), [])

    return (
        <DashboardLayout>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                <div className="lg:col-span-12">
                    <PageHeader
                        icon={Send}
                        title="Enviados"
                        description="Mensajes que has enviado"
                        iconClassName="text-emerald-600"
                    />
                </div>

                <div className="lg:col-span-12">
                    <BandejaMensajes tab="enviados" fetcher={fetcher} />
                </div>

            </div>
        </DashboardLayout>
    )
}
