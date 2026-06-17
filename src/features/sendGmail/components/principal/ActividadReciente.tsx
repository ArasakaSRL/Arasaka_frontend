import type { Mensaje } from '@/features/sendGmail/types/sendGmailType'
import { MessageSquare, Star } from 'lucide-react'

interface Props {
    recibidos: Mensaje[]
    enviados: Mensaje[]
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('es-ES', {
        day: '2-digit', month: 'short', year: 'numeric',
    })
}

export default function ActividadReciente({ recibidos, enviados }: Props) {
    const actividad = [
        ...recibidos.map(m => ({ ...m, tipo: 'recibido' as const })),
        ...enviados.map(m => ({ ...m, tipo: 'enviado' as const })),
    ]
        .sort((a, b) => new Date(b.fecha_envio).getTime() - new Date(a.fecha_envio).getTime())
        .slice(0, 5)

    if (actividad.length === 0) return null

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
                <MessageSquare size={15} className="text-slate-400" />
                <h2 className="text-sm font-semibold text-slate-700">Actividad reciente</h2>
            </div>
            <ul className="divide-y divide-gray-100">
                {actividad.map(m => (
                    <li key={`${m.tipo}-${m.id}`} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 transition-colors">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                            m.tipo === 'recibido'
                                ? 'bg-blue-50 text-[#1e2a5e]'
                                : 'bg-emerald-50 text-emerald-600'
                        }`}>
                            {m.tipo === 'recibido' ? 'Recibido' : 'Enviado'}
                        </span>
                        <span className="text-sm font-medium text-slate-700 truncate w-36 shrink-0">
                            {m.tipo === 'recibido' ? (m.remitente.nombre || m.remitente.correo) : m.destinatario.correo}
                        </span>
                        <span className="text-sm text-slate-500 truncate flex-1">{m.asunto}</span>
                        <span className="text-[11px] text-slate-400 shrink-0">{formatDate(m.fecha_envio)}</span>
                        {m.destacado && <Star size={13} className="fill-amber-400 text-amber-400 shrink-0" />}
                    </li>
                ))}
            </ul>
        </div>
    )
}
