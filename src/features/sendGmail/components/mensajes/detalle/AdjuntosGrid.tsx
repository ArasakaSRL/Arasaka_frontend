import { Paperclip } from 'lucide-react'
import type { AdjuntoMensaje } from '@/features/sendGmail/types/sendGmailType'
import AdjuntoCard from './AdjuntoCard'

interface Props {
    adjuntos: AdjuntoMensaje[]
}

export default function AdjuntosGrid({ adjuntos }: Props) {
    if (adjuntos.length === 0) return null

    return (
        <div className="flex flex-col gap-4 pt-5">
            <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-md bg-slate-100">
                    <Paperclip size={13} className="text-slate-500" />
                </div>
                <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
                    {adjuntos.length} adjunto{adjuntos.length > 1 ? 's' : ''}
                </span>
            </div>
            <div className="flex flex-wrap gap-3">
                {adjuntos.map((a, i) => (
                    <AdjuntoCard key={i} adjunto={a} />
                ))}
            </div>
        </div>
    )
}
