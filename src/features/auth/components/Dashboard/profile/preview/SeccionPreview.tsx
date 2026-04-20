import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Props {
    icon: React.ElementType;
    titulo: string;
    children: React.ReactNode;
    collapsible?: boolean;
}

export default function SeccionPreview({ icon: Icon, titulo, children, collapsible = false }: Props) {
    const [open, setOpen] = useState(false)
    return (
        <div className="flex flex-col gap-2">
            <button
                onClick={() => collapsible && setOpen(prev => !prev)}
                className={`flex items-center justify-between border-b border-gray-100 pb-1.5 w-full ${collapsible ? 'cursor-pointer' : 'cursor-default'}`}
            >
                <div className="flex items-center gap-2">
                    <Icon size={14} className="text-[#1e2a5e]" />
                    <h4 className="text-sm font-bold text-[#1e2a5e]">{titulo}</h4>
                </div>
                {collapsible && (
                    <ChevronDown size={14} className={`text-[#1e2a5e] transition-transform ${open ? 'rotate-180' : ''}`} />
                )}
            </button>
            {(!collapsible || open) && <div className="flex flex-col gap-2">{children}</div>}
        </div>
    )
}
