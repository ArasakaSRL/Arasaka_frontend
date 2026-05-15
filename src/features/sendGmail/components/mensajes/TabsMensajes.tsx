import { Inbox, Send } from 'lucide-react'

export type Tab = 'recibidos' | 'enviados' | 'destacados'

interface Props {
    tab: Tab
    count: number
    onChange: (t: Tab) => void
}

const TABS = [
    { key: 'recibidos', label: 'Recibidos', icon: Inbox },
    { key: 'enviados',  label: 'Enviados',  icon: Send  },
] as const

export default function TabsMensajes({ tab, count, onChange }: Props) {
    return (
        <div className="flex border-b border-gray-100">
            {TABS.map(({ key, label, icon: Icon }) => (
                <button
                    key={key}
                    onClick={() => onChange(key)}
                    className={`flex items-center gap-2 px-6 py-3.5 text-sm font-medium border-b-2 transition-colors
                        ${tab === key
                            ? 'border-[#1e2a5e] text-[#1e2a5e]'
                            : 'border-transparent text-slate-400 hover:text-slate-600'
                        }`}
                >
                    <Icon size={15} />
                    {label}
                    {tab === key && count > 0 && (
                        <span className="bg-[#1e2a5e] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            {count}
                        </span>
                    )}
                </button>
            ))}
        </div>
    )
}
