import { AlertTriangle } from 'lucide-react'

interface Props {
    onConfirm: () => void
    onCancel: () => void
}

export default function ConfirmNavModal({ onConfirm, onCancel }: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 flex flex-col gap-4">

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                        <AlertTriangle size={20} className="text-orange-500" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 text-base">Cambios sin guardar</h3>
                        <p className="text-sm text-gray-500 mt-0.5">¿Deseas descartar los cambios realizados?</p>
                    </div>
                </div>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                        Seguir editando
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-colors"
                    >
                        Descartar cambios
                    </button>
                </div>
            </div>
        </div>
    )
}
