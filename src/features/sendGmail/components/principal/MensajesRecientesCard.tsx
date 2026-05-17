import type { LucideIcon } from 'lucide-react'
import type { Mensaje } from '@/features/sendGmail/types/sendGmailType'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Mail, MailOpen, Send, Star } from 'lucide-react'

interface Props {
    titulo: string
    icon: LucideIcon
    mensajes: Mensaje[]
    tipo: 'recibidos' | 'enviados'
    path: string
    emptyText: string
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('es-ES', {
        day: '2-digit', month: 'short', year: 'numeric',
    })
}

export default function MensajesRecientesCard({ titulo, icon: Icon, mensajes, tipo, path, emptyText }: Props) {
    const navigate = useNavigate()

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <Icon size={15} className="text-slate-400" />
                    <h2 className="text-sm font-semibold text-slate-700">{titulo}</h2>
                </div>
                <button
                    onClick={() => navigate(path)}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-[#1e2a5e] font-medium px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-all group"
                >
                    Ver todos <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                </button>
            </div>

            {mensajes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2 text-slate-400">
                    <Icon size={28} strokeWidth={1.2} />
                    <p className="text-sm">{emptyText}</p>
                </div>
            ) : (
                <ul className="divide-y divide-gray-100">
                    {mensajes.slice(0, 5).map(m => (
                        <li key={m.id} className="flex items-start gap-3 px-6 py-3.5 hover:bg-slate-50 transition-colors">
                            <div className="mt-0.5 shrink-0">
                                {tipo === 'recibidos'
                                    ? m.leido
                                        ? <MailOpen size={15} className="text-slate-300" />
                                        : <Mail size={15} className="text-[#1e2a5e]" />
                                    : <Send size={15} className="text-slate-300" />
                                }
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <span className={`text-sm text-black! truncate ${tipo === 'recibidos' && !m.leido ? 'text-slate-800 font-semibold' : 'text-slate-500'}`}>
                                        {tipo === 'recibidos' ? (m.remitente.nombre || m.remitente.correo) : m.destinatario.correo}
                                    </span>
                                    <span className="text-[11px] text-slate-400 shrink-0">{formatDate(m.fecha_envio)}</span>
                                </div>
                                <p className="text-[13px] text-left text-slate-400 truncate mt-1!">Asunto: {m.asunto}</p>
                            </div>
                            {m.destacado && <Star size={13} className="fill-amber-400 text-amber-400 shrink-0 mt-1" />}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
