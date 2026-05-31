import { useEffect, useState } from 'react'
import { getMensajesRecibidos, getMensajesEnviados, getMensajesDestacados } from '@/features/sendGmail/api/sendGmail'
import type { Mensaje } from '@/features/sendGmail/types/sendGmailType'
import DashboardLayout from '@/layout/DashboardLayout'
import PageHeader from '@/components/ui/PageHeader'
import MensajesStats from '@/features/sendGmail/components/principal/MensajesStats'
import MensajesRecientesCard from '@/features/sendGmail/components/principal/MensajesRecientesCard'
import { Inbox, Send, Mail, MessageSquare, Star, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

function normalizeArray(res: unknown): Mensaje[] {
    if (Array.isArray(res)) return res
    const obj = res as Record<string, unknown>
    if (Array.isArray(obj?.data)) return obj.data as Mensaje[]
    return []
}

export default function MensajesPrincipal() {
    const idPortafolio = useAuthStore(s => s.portafolioSeleccionado?.id_portafolio)
    const [recibidos, setRecibidos] = useState<Mensaje[]>([])
    const [enviados, setEnviados] = useState<Mensaje[]>([])
    const [destacados, setDestacados] = useState<Mensaje[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        Promise.allSettled([
            getMensajesRecibidos(idPortafolio),
            getMensajesEnviados(idPortafolio),
            getMensajesDestacados(idPortafolio),
        ])
            .then(([r, e, d]) => {
                setRecibidos(r.status === 'fulfilled' ? normalizeArray(r.value) : [])
                setEnviados(e.status === 'fulfilled' ? normalizeArray(e.value) : [])
                setDestacados(d.status === 'fulfilled' ? normalizeArray(d.value) : [])
            })
            .finally(() => setLoading(false))
    }, [idPortafolio])

    const stats = [
        { label: 'No leídos',  value: recibidos.filter(m => !m.leido).length, icon: Mail,  color: 'text-[#1e2a5e]',   bg: 'bg-blue-50',    border: 'border-blue-100' },
        { label: 'Recibidos',  value: recibidos.length,                        icon: Inbox, color: 'text-indigo-600',  bg: 'bg-indigo-50',  border: 'border-indigo-100',  path: '/Dashboard/mensajes/Recibidos' },
        { label: 'Enviados',   value: enviados.length,                         icon: Send,  color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', path: '/Dashboard/mensajes/Enviados' },
        { label: 'Destacados', value: destacados.length,                       icon: Star,  color: 'text-amber-500',   bg: 'bg-amber-50',   border: 'border-amber-100',   path: '/Dashboard/mensajes/Destacados' },
    ]

    return (
        <DashboardLayout>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                <div className="lg:col-span-12">
                    <PageHeader
                        icon={MessageSquare}
                        title="Mensajes"
                        description="Resumen de tu bandeja de entrada"
                    />
                </div>

                {loading ? (
                    <div className="lg:col-span-12 flex items-center justify-center py-24">
                        <Loader2 size={28} className="animate-spin text-slate-300" />
                    </div>
                ) : (
                    <>
                        <div className="lg:col-span-12">
                            <MensajesStats stats={stats} />
                        </div>

                        <div className="lg:col-span-6">
                            <MensajesRecientesCard
                                titulo="Recibidos recientes"
                                icon={Inbox}
                                mensajes={recibidos}
                                tipo="recibidos"
                                path="/Dashboard/mensajes/Recibidos"
                                emptyText="No hay mensajes recibidos"
                            />
                        </div>

                        <div className="lg:col-span-6">
                            <MensajesRecientesCard
                                titulo="Enviados recientes"
                                icon={Send}
                                mensajes={enviados}
                                tipo="enviados"
                                path="/Dashboard/mensajes/Enviados"
                                emptyText="No hay mensajes enviados"
                            />
                        </div>
                    </>
                )}

            </div>
        </DashboardLayout>
    )
}
