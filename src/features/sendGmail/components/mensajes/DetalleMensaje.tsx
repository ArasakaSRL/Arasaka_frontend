import { ArrowLeft } from 'lucide-react'
import type { Mensaje } from '@/features/sendGmail/types/sendGmailType'
import MensajeHeader from './detalle/MensajeHeader'
import MensajeCuerpo from './detalle/MensajeCuerpo'
import AdjuntosGrid from './detalle/AdjuntosGrid'

interface Props {
    mensaje: Mensaje
    onVolver: () => void
}

export default function DetalleMensaje({ mensaje, onVolver }: Props) {
    return (
        <div className="flex flex-col flex-1 p-6 gap-5">

            <button
                onClick={onVolver}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-500 hover:text-[#1e2a5e] hover:bg-slate-100 text-sm font-medium transition-all self-start group"
            >
                <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
                Volver
            </button>

            <h2 className="text-xl font-bold text-slate-800 leading-snug tracking-tight">{mensaje.asunto}</h2>

            <MensajeHeader
                nombre={mensaje.remitente.nombre}
                correo={mensaje.remitente.correo}
                destinatario={mensaje.destinatario.correo}
                fecha={mensaje.fecha_envio}
            />

            <MensajeCuerpo contenido={mensaje.contenido} />

            <AdjuntosGrid adjuntos={mensaje.adjuntos} />

        </div>
    )
}
