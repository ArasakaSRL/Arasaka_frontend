import type { LucideIcon } from 'lucide-react'

interface Props {
    icon: LucideIcon
    title: string
    description?: string
    iconClassName?: string
}

export default function PageHeader({ icon: Icon, title, description, iconClassName = 'text-[#1e2a5e]' }: Props) {
    return (
        <div className="flex flex-col gap-0.5">
            <div className="flex flex-row items-center gap-2">
                <Icon size={18} className={`shrink-0! ${iconClassName}`} />
                <h1 className="text-[17px]! font-bold text-slate-800! tracking-normal! m-0!">{title}</h1>
            </div>
            {description && <p className="text-sm text-left text-gray-700 leading-tight pl-0.5 mt-2!">{description}</p>}
        </div>
    )
}
