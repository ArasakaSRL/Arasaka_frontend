import { Smartphone, Trash2, X } from 'lucide-react'

interface Props {
    total: number
    modoEliminar: boolean
    onActivarEliminar: () => void
    onCancelarEliminar: () => void
}

export default function TelefonosHeader({ total, modoEliminar, onActivarEliminar, onCancelarEliminar }: Props) {
    return (
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#1e2a5e]/5 flex items-center justify-center">
                    <Smartphone size={16} className="text-[#1e2a5e]" />
                </div>
                <div>
                    <p className="text-sm text-left font-semibold text-slate-800">Números registrados</p>
                    <p className="text-[13px] text-gray-600">Agrega, edita o elimina tus teléfonos de contacto</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-[12px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-[#1e2a5e] border border-blue-100">
                    {total} {total === 1 ? 'número' : 'números'}
                </span>
                {/**
                *  {total > 0 && !modoEliminar && (
                    <button
                        onClick={onActivarEliminar}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 text-xs font-medium transition-all"
                    >
                        <Trash2 size={13} /> Eliminar
                    </button>
                )}
                */}
                {modoEliminar && (
                    <button
                        onClick={onCancelarEliminar}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:border-slate-300 text-xs font-medium transition-all"
                    >
                        <X size={13} /> Cancelar
                    </button>
                )}
            </div>
        </div>
    )
}
