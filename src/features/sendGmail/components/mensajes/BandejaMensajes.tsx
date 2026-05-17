import { useEffect, useState } from 'react'
import { getMensaje } from '@/features/sendGmail/api/sendGmail'
import type { Mensaje } from '@/features/sendGmail/types/sendGmailType'
import type { Tab } from './TabsMensajes'
import ListaMensajes from './ListaMensajes'
import DetalleMensaje from './DetalleMensaje'
import BuscadorMensajes from './BuscadorMensajes'
import { useAuthStore } from '@/stores/authStore'

interface Props {
    tab: Tab
    fetcher: () => Promise<unknown>
}

function normalizeArray(res: unknown): Mensaje[] {
    if (Array.isArray(res)) return res
    const obj = res as Record<string, unknown>
    if (Array.isArray(obj?.data)) return obj.data as Mensaje[]
    return []
}

export default function BandejaMensajes({ tab, fetcher }: Props) {
    const [mensajes, setMensajes] = useState<Mensaje[]>([])
    const [loading, setLoading] = useState(false)
    const [detalle, setDetalle] = useState<Mensaje | null>(null)
    const [query, setQuery] = useState('')
    const correoUsuario = useAuthStore(s => s.user?.correo ?? '')

    useEffect(() => {
        setDetalle(null)
        setQuery('')
        setLoading(true)
        fetcher()
            .then(res => setMensajes(normalizeArray(res)))
            .catch(() => setMensajes([]))
            .finally(() => setLoading(false))
    }, [fetcher])

    async function abrirMensaje(m: Mensaje) {
        setDetalle(m)
        const esRecibido = tab === 'recibidos' || (tab === 'destacados' && m.remitente.correo !== correoUsuario)
        if (m.id && esRecibido) {
            getMensaje(m.id).catch(() => {})
            setMensajes(prev => prev.map(x => x.id === m.id ? { ...x, leido: true } : x))
        }
    }

    function handleDestacadoChange(id: string, destacado: boolean) {
        setMensajes(prev => prev.map(x => x.id === id ? { ...x, destacado } : x))
    }

    const filtrados = query.trim()
        ? mensajes.filter(m => {
            const q = query.toLowerCase()
            const remitente = `${m.remitente.nombre} ${m.remitente.correo}`.toLowerCase()
            return remitente.includes(q) || m.asunto.toLowerCase().includes(q) || m.destinatario.correo.toLowerCase().includes(q)
        })
        : mensajes

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
            {detalle ? (
                <DetalleMensaje mensaje={detalle} onVolver={() => setDetalle(null)} />
            ) : (
                <>
                    <div className="px-4 py-3 border-b border-gray-100">
                        <BuscadorMensajes value={query} onChange={setQuery} />
                    </div>
                    <ListaMensajes
                        mensajes={filtrados}
                        loading={loading}
                        tab={tab}
                        onAbrir={abrirMensaje}
                        onDestacadoChange={handleDestacadoChange}
                    />
                </>
            )}
        </div>
    )
}
