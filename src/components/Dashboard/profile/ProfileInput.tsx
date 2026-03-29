// @/components/ui/ProfileInput.tsx
import type { LucideIcon } from 'lucide-react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon: LucideIcon;
}

export const ProfileInput = ({ label, icon: Icon, ...props }: Props) => (
    <div className="flex flex-col gap-2 w-full">
        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Icon size={20} className="text-black" />
            {label}
        </label>
        <input 
            {...props} 
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-700 focus:border-transparent outline-none transition-all bg-white text-gray-500 placeholder:text-slate-400"
        />
    </div>
);