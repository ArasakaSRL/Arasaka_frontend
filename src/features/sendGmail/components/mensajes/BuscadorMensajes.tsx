import { Search, X } from 'lucide-react'

interface Props {
    value: string
    onChange: (v: string) => void
    placeholder?: string
}

export default function BuscadorMensajes({ value, onChange, placeholder = 'Buscar por remitente, gmail o asunto...' }: Props) {
    return (
        <div className="relative flex items-center">
            <Search size={15} className="absolute left-3.5 text-slate-400 pointer-events-none" />
            <input
                type="text"
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-9 pr-8 py-2 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400 transition-all"
            />
            {value && (
                <button
                    onClick={() => onChange('')}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X size={14} />
                </button>
            )}
        </div>
    )
}
