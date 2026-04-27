import { Mail } from 'lucide-react'

interface Props {
    nombreDestinatario: string
    onClose: () => void
}

export default function EnvioExitoso({ nombreDestinatario, onClose }: Props) {
    return (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center">
                <Mail size={28} className="text-green-400" />
            </div>
            <p className="text-white font-bold">¡Mensaje enviado!</p>
            <p className="text-white/50 text-sm">Tu mensaje fue enviado a {nombreDestinatario}</p>
            <button onClick={onClose} className="mt-2 text-blue-400 text-sm hover:underline">
                Cerrar
            </button>
        </div>
    )
}
