import { Trash2, AlertTriangle } from 'lucide-react'

interface Props {
    seleccionados: number
    loading: boolean
    onConfirmar: () => void
}

export default function TelefonosBannerEliminar({ seleccionados, loading, onConfirmar }: Props) {
    return (
        <div className="flex items-center justify-between px-6 py-3.5 bg-red-50 border-b border-red-100">
            <div className="flex items-center gap-2.5">
                <AlertTriangle size={20} className="text-red-400 shrink-0" />
                <p className="text-sm text-red-600 font-medium">
                    {seleccionados === 0
                        ? 'Selecciona los teléfonos que deseas eliminar'
                        : <><span className="font-bold">{seleccionados}</span> teléfono{seleccionados > 1 ? 's seleccionados' : ' seleccionado'}</>
                    }
                </p>
            </div>
            <button
                onClick={onConfirmar}
                disabled={seleccionados === 0 || loading}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-600 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
                <Trash2 size={13} />
                {loading ? 'Eliminando...' : 'Confirmar eliminación'}
            </button>
        </div>
    )
}
