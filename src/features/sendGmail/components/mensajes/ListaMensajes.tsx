import { useState } from 'react'
import { Inbox, Loader2, Mail, MailOpen, Paperclip, Star } from 'lucide-react'
import type { Mensaje } from '@/features/sendGmail/types/sendGmailType'
import type { Tab } from './TabsMensajes'
import { toggleDestacado } from '@/features/sendGmail/api/sendGmail'
import { useAuthStore } from '@/stores/authStore'

interface Props {
    mensajes: Mensaje[]
    loading: boolean
    tab: Tab
    onAbrir: (m: Mensaje) => void
    onDestacadoChange?: (id: string, destacado: boolean) => void
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('es-ES', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    })
}

export default function ListaMensajes({ mensajes, loading, tab, onAbrir, onDestacadoChange }: Props) {
    const [toggling, setToggling] = useState<string | null>(null)
    const correoUsuario = useAuthStore(s => s.portafolioSeleccionado?.informacion_basica?.gmail ?? s.user?.correo ?? '')

    function getNombre(m: Mensaje) {
        if (tab === 'enviados') return m.destinatario.correo
        if (tab === 'destacados') return m.remitente.correo === correoUsuario ? m.destinatario.correo : (m.remitente.nombre || m.remitente.correo)
        return m.remitente.nombre || m.remitente.correo
    }

    async function handleToggle(e: React.MouseEvent, m: Mensaje) {
        e.stopPropagation()
        if (toggling === m.id) return
        setToggling(m.id)
        try {
            const { destacado } = await toggleDestacado(m.id)
            onDestacadoChange?.(m.id, destacado)
        } finally {
            setToggling(null)
        }
    }

    if (loading) return (
        <div className="flex-1 flex items-center justify-center py-16">
            <Loader2 size={24} className="animate-spin text-slate-300" />
        </div>
    )

    if (mensajes.length === 0) return (
        <div className="flex-1 flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
            <Inbox size={36} strokeWidth={1.2} />
            <p className="text-sm">No hay mensajes {tab === 'recibidos' ? 'recibidos' : 'enviados'}</p>
        </div>
    )

    return (
        <ul className="divide-y divide-gray-100">
            {mensajes.filter(m => m?.id).map(m => (
                <li key={m.id} className="group/item">
                    <div className="w-full flex items-start gap-3 px-2 md:px-6 py-4 hover:bg-slate-50 transition-colors">

                        <button
                            onClick={e => handleToggle(e, m)}
                            disabled={toggling === m.id}
                            className="mt-0.5 shrink-0 p-0.5 rounded hover:bg-slate-200/60 transition-colors disabled:opacity-50"
                            title={m.destacado ? 'Quitar destacado' : 'Destacar'}
                        >
                            {toggling === m.id
                                ? <Loader2 size={15} className="animate-spin text-slate-400" />
                                : <Star
                                    size={15}
                                    className={`transition-colors ${m.destacado ? 'fill-amber-400 text-amber-400' : 'text-slate-300 group-hover/item:text-slate-400'}`}
                                />
                            }
                        </button>

                        <div className="mt-0.5 shrink-0">
                            {m.leido
                                ? <MailOpen size={16} className="text-slate-300" />
                                : <Mail size={16} className="text-[#1e2a5e]" />
                            }
                        </div>

                        <button
                            onClick={() => onAbrir(m)}
                            className="flex-1 min-w-0 text-left"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <span className={`text-sm truncate ${m.leido ? 'text-black font-normal' : 'text-slate-800 font-semibold'}`}>
                                    {getNombre(m)}
                                </span>
                                <span className="text-[11px] text-slate-400 shrink-0">{formatDate(m.fecha_envio)}</span>
                            </div>
                            <p className={`text-[13px] text-slate-500 truncate mt-0.5 ${m.leido ? 'text-slate-400' : 'text-slate-600'}`}>
                                Asunto: {m.asunto}
                            </p>
                            <p className="text-xs text-slate-400 truncate mt-0.5">{m.contenido}</p>
                        </button>

                        {m.adjuntos.length > 0 && (
                            <Paperclip size={13} className="text-slate-300 shrink-0 mt-1" />
                        )}

                    </div>
                </li>
            ))}
        </ul>
    )
}
