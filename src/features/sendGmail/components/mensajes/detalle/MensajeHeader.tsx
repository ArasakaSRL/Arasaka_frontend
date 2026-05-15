import { Calendar } from 'lucide-react'

interface Props {
    nombre: string
    correo: string
    destinatario: string
    fecha: string
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('es-ES', {
        weekday: 'long', day: '2-digit', month: 'long',
        year: 'numeric', hour: '2-digit', minute: '2-digit',
    })
}

function getInitials(nombre: string, correo: string) {
    if (nombre) {
        const parts = nombre.trim().split(' ')
        return parts.length >= 2
            ? (parts[0][0] + parts[1][0]).toUpperCase()
            : parts[0][0].toUpperCase()
    }
    return correo[0].toUpperCase()
}

export default function MensajeHeader({ nombre, correo, destinatario, fecha }: Props) {
    const initials = getInitials(nombre, correo)

    return (
        <div className="flex flex-col gap-4 pb-5">
            <div className="flex items-start gap-4">

                <div className="relative shrink-0">
                    <div className="w-11 h-11 rounded-full bg-linear-to-br from-[#1e2a5e] to-[#27496e] flex items-center justify-center shadow-md">
                        <span className="text-white text-sm font-bold tracking-wide">{initials}</span>
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                            <p className="text-[16px] font-semibold text-slate-800 leading-tight">
                                {nombre || 'Sin nombre'}
                                <span className="text-sm! text-slate-400! font-normal ml-1.5">&lt;{correo}&gt;</span>
                            </p>
                        </div>

                        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 shrink-0">
                            <Calendar size={16} className="text-slate-400" />
                            <span className="text-[12px] text-slate-500 capitalize">{formatDate(fecha)}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 -mt-1">
                        <p className="text-[14px] text-slate-400!">
                            Para: <span className="text-slate-600 font-medium">{destinatario}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
