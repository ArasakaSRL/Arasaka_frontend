import { MessageCircle, Mail } from 'lucide-react'

interface Props {
    whatsappNumber?: string
    onSelectGmail: () => void
}

export default function OpcionesContacto({ whatsappNumber, onSelectGmail }: Props) {
    return (
        <div className="flex flex-col gap-3">
            <p className="text-white/50 text-sm mb-2">¿Cómo deseas contactar?</p>

            {whatsappNumber && (
                <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-colors no-underline"
                >
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <MessageCircle size={20} className="text-green-400" />
                    </div>
                    <div>
                        <p className="text-white font-semibold text-sm">WhatsApp</p>
                        <p className="text-white/40 text-xs">Mensaje directo e instantáneo</p>
                    </div>
                </a>
            )}

            <button
                onClick={onSelectGmail}
                className="flex items-center gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-colors text-left"
            >
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Mail size={20} className="text-blue-400" />
                </div>
                <div>
                    <p className="text-white font-semibold text-sm">Correo electrónico</p>
                    <p className="text-white/40 text-xs">Enviar mensaje formal</p>
                </div>
            </button>
        </div>
    )
}
