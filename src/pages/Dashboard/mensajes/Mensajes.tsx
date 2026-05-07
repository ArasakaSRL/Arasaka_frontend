import { useEffect, useState } from 'react'
import { getMensajesRecibidos, getMensajesEnviados, getMensaje } from '@/features/sendGmail/api/sendGmail'
import type { Mensaje } from '@/features/sendGmail/types/sendGmailType'
import DashboardLayout from '@/layout/DashboardLayout'
import TabsMensajes, { type Tab } from '@/features/sendGmail/components/mensajes/TabsMensajes'
import ListaMensajes from '@/features/sendGmail/components/mensajes/ListaMensajes'
import DetalleMensaje from '@/features/sendGmail/components/mensajes/DetalleMensaje'

function normalizeArray(res: unknown): Mensaje[] {
    if (Array.isArray(res)) return res
    const obj = res as Record<string, unknown>
    if (Array.isArray(obj?.data)) return obj.data as Mensaje[]
    return []
}

export default function Mensajes() {
    const [tab, setTab] = useState<Tab>('recibidos')
    const [mensajes, setMensajes] = useState<Mensaje[]>([])
    const [loading, setLoading] = useState(false)
    const [detalle, setDetalle] = useState<Mensaje | null>(null)

    useEffect(() => {
        setDetalle(null)
        setLoading(true)
        const fn = tab === 'recibidos' ? getMensajesRecibidos : getMensajesEnviados
        fn()
            .then(res => setMensajes(normalizeArray(res)))
            .catch(() => setMensajes([]))
            .finally(() => setLoading(false))
    }, [tab])

    async function abrirMensaje(m: Mensaje) {
        setDetalle(m)
        if (m.id && tab === 'recibidos') getMensaje(m.id).catch(() => {})
    }

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto p-4 md:p-6 flex flex-col gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-800">Mensajes</h1>
                    <p className="text-sm text-slate-500">Bandeja de entrada y mensajes enviados</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                    <TabsMensajes tab={tab} count={mensajes.length} onChange={setTab} />

                    {detalle ? (
                        <DetalleMensaje mensaje={detalle} onVolver={() => setDetalle(null)} />
                    ) : (
                        <ListaMensajes
                            mensajes={mensajes}
                            loading={loading}
                            tab={tab}
                            onAbrir={abrirMensaje}
                        />
                    )}
                </div>
            </div>
        </DashboardLayout>
    )
}
