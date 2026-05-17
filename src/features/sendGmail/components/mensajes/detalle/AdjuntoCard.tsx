import { useState } from 'react'
import { Eye, Download, Loader2 } from 'lucide-react'
import type { AdjuntoMensaje } from '@/features/sendGmail/types/sendGmailType'
import AdjuntoIcon from './AdjuntoIcon'
import ImageLightbox from './ImageLightbox'
import { useDescargar } from '@/features/sendGmail/hooks/useDescargar'

function getExt(nombre: string) {
    return nombre.split('.').pop()?.toLowerCase() ?? ''
}

function isImage(nombre: string) {
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(getExt(nombre))
}

function resolveUrl(url: string) {
    if (url.startsWith('http')) return url
    const base = (import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000').replace(/\/$/, '')
    return `${base}/${url.replace(/^\//, '')}`
}

interface Props {
    adjunto: AdjuntoMensaje
}

export default function AdjuntoCard({ adjunto }: Props) {
    const url = resolveUrl(adjunto.url)
    const ext = getExt(adjunto.nombre).toUpperCase()
    const imagen = isImage(adjunto.nombre)
    const [lightbox, setLightbox] = useState(false)
    const { descargar, descargando } = useDescargar()

    return (
        <>
            <div
                title={adjunto.nombre}
                className="group relative w-55 rounded-2xl border border-gray-200/80 bg-white shadow-sm overflow-hidden hover:border-blue-300 hover:shadow-md transition-all duration-200"
            >
                <div className="relative h-44 bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center overflow-hidden">
                    {imagen ? (
                        <img
                            src={url}
                            alt={adjunto.nombre}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <AdjuntoIcon nombre={adjunto.nombre} />
                            <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">{ext}</span>
                        </div>
                    )}

                    {/* Overlay acciones */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center gap-2">
                        {imagen && (
                            <button
                                onClick={() => setLightbox(true)}
                                className="opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200 bg-white rounded-full p-2 shadow-lg hover:bg-blue-50"
                                title="Ver"
                            >
                                <Eye size={14} className="text-slate-700" />
                            </button>
                        )}
                        <button
                            onClick={() => descargar(url, adjunto.nombre)}
                            disabled={descargando}
                            className="opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200 bg-white rounded-full p-2 shadow-lg hover:bg-blue-50 disabled:opacity-60"
                            title="Descargar"
                        >
                            {descargando
                                ? <Loader2 size={14} className="animate-spin text-slate-700" />
                                : <Download size={14} className="text-slate-700" />}
                        </button>
                    </div>
                </div>

                {/* Info */}
                <div className="px-3 py-2.5 border-t border-gray-100 bg-white">
                    <p className="text-xs text-slate-700 font-semibold truncate leading-tight">{adjunto.nombre}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                        {imagen ? ext : adjunto.tipo}
                    </p>
                </div>
            </div>

            {lightbox && <ImageLightbox url={url} nombre={adjunto.nombre} onClose={() => setLightbox(false)} />}
        </>
    )
}
