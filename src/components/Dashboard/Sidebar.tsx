import {
    User, Briefcase, Award, GraduationCap,
    Trophy, BarChart3, Settings, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logoutRequest } from '@/api/auth';
import { useState } from 'react';

const menuItems = [
    { icon: User, label: 'Perfil Personal', active: true },
    { icon: Briefcase, label: 'Proyectos' },
    { icon: Award, label: 'Habilidades' },
    { icon: GraduationCap, label: 'Experiencia' },
    { icon: Trophy, label: 'Logros' },
    { icon: BarChart3, label: 'Estadísticas' },
    { icon: Settings, label: 'Configuración' },
];

interface SidebarProps {
    isOpen: boolean
    onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        if (isLoading) return;

        try {
            setIsLoading(true);
            await logoutRequest();
            navigate('/auth/Login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/40 z-30"
                    onClick={onClose}
                />
            )}

            <aside className={`w-54 bg-white border-r border-gray-200 h-[calc(100vh-4rem)] fixed left-0 top-16 z-40 flex flex-col transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

                <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
                    {menuItems.map((item) => (
                        <button
                            key={item.label}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${item.active
                                    ? 'bg-[#1e2a5e] text-white'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                }`}
                        >
                            <item.icon size={18} strokeWidth={1.8} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="px-3 py-4 border-t border-gray-100">
                    <button 
                        onClick={handleLogout}
                        disabled={isLoading}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                            ${isLoading 
                                ? 'bg-gray-100 text-black cursor-not-allowed' 
                                : 'bg-red-600 text-black '
                            }`}
                    >
                        <LogOut size={18} strokeWidth={1.8} />
                        <span>{isLoading ? 'Cerrando...' : 'Cerrar sesión'}</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
