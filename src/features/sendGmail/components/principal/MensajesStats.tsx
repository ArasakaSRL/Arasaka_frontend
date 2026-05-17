import type { LucideIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Stat {
    label: string
    value: number
    icon: LucideIcon
    color: string
    bg: string
    border: string
    path: string
}

interface Props {
    stats: Stat[]
}

export default function MensajesStats({ stats }: Props) {
    const navigate = useNavigate()

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map(({ label, value, icon: Icon, color, bg, border, path }) => (
                <button
                    key={label}
                    onClick={() => navigate(path)}
                    className={`${bg} border ${border} rounded-2xl p-5 flex items-center gap-4 hover:shadow-md hover:scale-[1.02] transition-all text-left`}
                >
                    <div className={`w-10 h-10 rounded-xl border ${border} flex items-center justify-center ${bg} shrink-0`}>
                        <Icon size={18} className={color} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-800">{value}</p>
                        <p className="text-xs text-slate-500">{label}</p>
                    </div>
                </button>
            ))}
        </div>
    )
}
