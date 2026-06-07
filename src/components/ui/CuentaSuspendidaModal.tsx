import { ShieldOff, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
    suspendidoHasta: string
    onClose: () => void
}

export default function CuentaSuspendidaModal({ suspendidoHasta, onClose }: Props) {
    const fecha = new Date(suspendidoHasta).toLocaleDateString('es-ES', {
        day: '2-digit', month: 'long', year: 'numeric'
    })

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 flex flex-col items-center gap-4 text-center"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                        <ShieldOff size={32} className="text-red-500" />
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Cuenta suspendida</h2>
                        <p className="text-slate-500 text-sm mt-2">
                            Tu cuenta ha sido suspendida temporalmente debido a incumplimientos de nuestras políticas.
                        </p>
                    </div>

                    <div className="w-full bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                        <p className="text-xs uppercase font-black tracking-wider text-red-400">Reactivación estimada</p>
                        <p className="text-red-600 font-bold text-lg mt-0.5">{fecha}</p>
                    </div>

                    <p className="text-slate-400 text-xs">
                        Si crees que esto es un error, contacta al equipo de soporte.
                    </p>

                    <button
                        onClick={onClose}
                        className="w-full py-2.5 bg-[#1e2a5e] hover:bg-[#16266B] text-white font-semibold rounded-xl text-sm transition-colors"
                    >
                        Entendido
                    </button>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
