import { Share2, Eye, Briefcase, Menu, X } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

interface DashboardHeaderProps {
    onMenuClick: () => void
    sidebarOpen: boolean
}

export default function DashboardHeader({ onMenuClick, sidebarOpen }: DashboardHeaderProps) {
    const user = useAuthStore(s => s.user)

    // Genera las iniciales del usuario: "Juan Perez" → "JP"
    const initials = user
        ? `${user.nombre.charAt(0)}${user.apellido.charAt(0)}`.toUpperCase()
        : '?'

    return (
        <header className="h-16 bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 md:px-6 transition-all duration-300">

            <div className="flex items-center gap-3">
                <button
                    className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                    onClick={onMenuClick}
                    aria-label="Toggle menú"
                >
                    {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#1e2a5e] rounded-lg flex items-center justify-center text-white">
                        <Briefcase size={16} />
                    </div>
                    <span className="font-bold text-base text-slate-800">Arasaka</span>
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
                <button className="flex items-center gap-2 px-3 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors border border-gray-200 text-sm">
                    <Share2 size={16} />
                    <span className="hidden sm:inline">Compartir</span>
                </button>

                <button className="flex items-center gap-2 px-3 py-2 bg-[#CBD5E1] text-slate-700 font-medium rounded-lg text-sm opacity-60 cursor-not-allowed">
                    <Eye size={16} />
                    <span className="hidden sm:inline">Vista Previa</span>
                </button>

                <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center font-bold text-sm shadow-sm bg-[#1e2a5e] text-white">
                    {user?.url_foto
                        ? <img src={user.url_foto} alt={user.nombre} className="w-full h-full object-cover" />
                        : initials
                    }
                </div>
            </div>
        </header>
    );
}
