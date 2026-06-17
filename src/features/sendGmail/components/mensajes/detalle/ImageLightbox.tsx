import { createPortal } from 'react-dom'
import { Download, Loader2, X } from 'lucide-react'
import { useDescargar } from '@/features/sendGmail/hooks/useDescargar'

interface Props {
    url: string
    nombre: string
    onClose: () => void
}

export default function ImageLightbox({ url, nombre, onClose }: Props) {
    const { descargar, descargando } = useDescargar()

    return createPortal(
        <div
            className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center"
            onClick={onClose}
        >
            <div
                className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 py-3 bg-black/60"
                onClick={e => e.stopPropagation()}
            >
                <span className="text-white/80 text-sm truncate max-w-xs">{nombre}</span>
                <div className="flex items-center gap-2">
                    <button
                            onClick={() => descargar(url, nombre)}
                            disabled={descargando}
                            className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-60"
                            title="Descargar"
                        >
                            {descargando ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                        </button>
                    <button
                        onClick={onClose}
                        className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                        title="Cerrar"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            <img
                src={url}
                alt={nombre}
                className="max-h-[85vh] max-w-[90vw] object-contain rounded shadow-2xl"
                onClick={e => e.stopPropagation()}
            />
        </div>,
        document.body
    )
}
