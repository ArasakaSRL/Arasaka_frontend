import { ArrowLeft, Paperclip } from 'lucide-react'
import type { Mensaje } from '@/features/sendGmail/types/sendGmailType'

interface Props {
    mensaje: Mensaje
    onVolver: () => void
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('es-ES', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    })
}

export default function DetalleMensaje({ mensaje, onVolver }: Props) {
    return (
        <div className="flex flex-col flex-1 p-6 gap-4">
            <button
                onClick={onVolver}
                className="flex items-center gap-1.5 text-slate-400 hover:text-slate-700 text-sm transition-colors self-start"
            >
                <ArrowLeft size={15} /> Volver
            </button>

            <h2 className="text-lg font-bold text-slate-800">{mensaje.asunto}</h2>

            <div className="flex flex-col gap-1 text-xs text-slate-500 bg-slate-50 rounded-xl p-4 border border-gray-100">
                <span>
                    <span className="font-semibold text-slate-600">De:</span>{' '}
                    {mensaje.remitente.nombre} &lt;{mensaje.remitente.correo}&gt;
                </span>
                <span>
                    <span className="font-semibold text-slate-600">Para:</span>{' '}
                    {mensaje.destinatario.correo}
                </span>
                <span>
                    <span className="font-semibold text-slate-600">Fecha:</span>{' '}
                    {formatDate(mensaje.fecha_envio)}
                </span>
            </div>

            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{mensaje.contenido}</p>

            {mensaje.adjuntos.length > 0 && (
                <div className="flex flex-col gap-2 mt-2">
                    <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                        <Paperclip size={13} /> Adjuntos ({mensaje.adjuntos.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {mensaje.adjuntos.map((a, i) => (
                            <a
                                key={i}
                                href={a.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 transition-colors"
                            >
                                <Paperclip size={12} />
                                {a.nombre}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
