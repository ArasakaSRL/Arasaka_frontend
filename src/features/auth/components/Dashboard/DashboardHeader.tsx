import { Share2, Eye, Briefcase, Menu } from 'lucide-react';

interface DashboardHeaderProps {
    onMenuClick: () => void
    sidebarOpen: boolean
}

export default function DashboardHeader({ onMenuClick, sidebarOpen }: DashboardHeaderProps) {
    return (
        <header className="h-16 bg-white border-b border-gray-200 fixed top-0 left-0 w-full z-40 flex items-center px-4 md:px-8">

            <div className="flex items-center gap-3 w-56">

                <button
                    className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                    onClick={onMenuClick}
                    aria-label="Toggle menú"
                >
                    {sidebarOpen ? <Menu size={20} /> : <Menu size={20} />}
                </button>

                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-[#1e2a5e] rounded-xl flex items-center justify-center text-white">
                        <Briefcase size={18} />
                    </div>
                    <span className="font-bold text-lg text-slate-800">Arasaka</span>
                </div>
            </div>

            <div className="flex flex-1 items-center justify-end gap-2 md:gap-3">
                <button className="flex items-center gap-2 px-3 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors border border-gray-200 text-sm">
                    <Share2 size={16} />
                    <span className="hidden sm:inline">Compartir</span>
                </button>

                <button className="flex items-center gap-2 px-3 py-2 bg-[#CBD5E1] text-slate-700 font-medium rounded-lg text-sm opacity-60 cursor-not-allowed">
                    <Eye size={16} />
                    <span className="hidden sm:inline">Vista Previa</span>
                </button>

                <div className="w-9 h-9 bg-[#1e2a5e] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
                    MG
                </div>
            </div>
        </header>
    );
}
