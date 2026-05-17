import { useState } from 'react'
import { Plus } from 'lucide-react'
import CodigoPaisSelect from '@/components/ui/CodigoPaisSelect'

interface Props {
    loading: boolean
    onAgregar: (numero: string) => Promise<void>
}

export default function TelefonosAgregar({ loading, onAgregar }: Props) {
    const [nuevoTelefono, setNuevoTelefono] = useState('')
    const [codigoPais, setCodigoPais] = useState('+591')

    async function handleAgregar() {
        if (!nuevoTelefono.trim()) return
        await onAgregar(`${codigoPais}${nuevoTelefono.trim()}`)
        setNuevoTelefono('')
    }

    return (
        <div className="px-6 py-5 border-t border-gray-100 bg-slate-50/50">
            <p className="text-xs text-left font-semibold text-slate-700 uppercase tracking-wide mb-3">Agregar nuevo teléfono</p>
            <div className="flex items-center mt-2 gap-2">
                <CodigoPaisSelect value={codigoPais} onChange={setCodigoPais} />
                <input
                    value={nuevoTelefono}
                    onChange={e => setNuevoTelefono(e.target.value.replace(/\D/g, ''))}
                    maxLength={10}
                    placeholder="Número de teléfono..."
                    className="flex-1 px-3 py-2 text-sm rounded-xl border border-gray-200 outline-none focus:border-blue-700 bg-white"
                />
                <button
                    onClick={handleAgregar}
                    disabled={nuevoTelefono.trim().length < 7 || loading}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1e2a5e] text-white text-sm font-medium hover:bg-[#151d41] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                >
                    <Plus size={16} />
                    {loading ? 'Agregando...' : 'Agregar'}
                </button>
            </div>
        </div>
    )
}
