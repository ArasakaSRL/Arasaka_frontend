import { Inbox, Loader2, Mail, MailOpen, Paperclip } from 'lucide-react'
import type { Mensaje } from '@/features/sendGmail/types/sendGmailType'
import type { Tab } from './TabsMensajes'

interface Props {
    mensajes: Mensaje[]
    loading: boolean
    tab: Tab
    onAbrir: (m: Mensaje) => void
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('es-ES', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    })
}

export default function ListaMensajes({ mensajes, loading, tab, onAbrir }: Props) {
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
                <li key={m.id}>
                    <button
                        onClick={() => onAbrir(m)}
                        disabled={false}
                        className="w-full flex items-start gap-3 px-6 py-4 hover:bg-slate-50 transition-colors text-left disabled:opacity-60"
                    >
                        <div className="mt-0.5 shrink-0">
                            {m.leido
                                ? <MailOpen size={16} className="text-slate-300" />
                                : <Mail size={16} className="text-[#1e2a5e]" />
                            }
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                                <span className={`text-sm truncate ${m.leido ? 'text-slate-500 font-normal' : 'text-slate-800 font-semibold'}`}>
                                    {tab === 'recibidos'
                                        ? (m.remitente.nombre || m.remitente.correo)
                                        : m.destinatario.correo
                                    }
                                </span>
                                <span className="text-[11px] text-slate-400 shrink-0">{formatDate(m.fecha_envio)}</span>
                            </div>
                            <p className={`text-xs truncate mt-0.5 ${m.leido ? 'text-slate-400' : 'text-slate-600'}`}>
                                {m.asunto}
                            </p>
                            <p className="text-xs text-slate-400 truncate mt-0.5">{m.contenido}</p>
                        </div>

                        {m.adjuntos.length > 0 && (
                            <Paperclip size={13} className="text-slate-300 shrink-0 mt-1" />
                        )}
                    </button>
                </li>
            ))}
        </ul>
    )
}
