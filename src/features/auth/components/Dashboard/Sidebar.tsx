import {
    User, Briefcase, Award, GraduationCap,
    Trophy, BarChart3, Settings, LogOut, ShieldCheck,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { logoutRequest } from '@/features/auth/api/auth';
import { useState } from 'react';
import { useDirtyStore } from '@/stores/dirtyStore';
import ConfirmNavModal from '@/components/ui/ConfirmNavModal';

const menuItems = [
    { icon: User, label: 'Perfil Personal', path: '/Dashboard/perfilPersonal/PerfilPersonal' },
    { icon: Briefcase, label: 'Proyectos', path: '/Dashboard/proyectos/Proyectos' },
    { icon: Award, label: 'Habilidades', path: '/Dashboard/habilidades/Habilidades' },
    { icon: GraduationCap, label: 'Experiencia', path: '/Dashboard/experiencia' },
    { icon: Trophy, label: 'Hitos', path: '/Dashboard/hitos/Hitos' },
    { icon: ShieldCheck, label:'Certificaciones', path:'/Dashboard/certificaciones/Certificaciones' },
    { icon: BarChart3, label: 'Estadísticas', path: '/Dashboard/estadisticas' },
    { icon: Settings, label: 'Configuración', path: '/Dashboard/configuracion' }
];
interface SidebarProps {
    isOpen: boolean
    onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const { isDirty, setDirty } = useDirtyStore();
    const [pendingPath, setPendingPath] = useState<string | null>(null);

    const handleNavigation = (path: string) => {
        if (isDirty && path !== location.pathname) {
            setPendingPath(path);
            return;
        }
        navigate(path);
        onClose();
    };

    const handleConfirmNav = () => {
        if (pendingPath) {
            setDirty(false);
            navigate(pendingPath);
            setPendingPath(null);
            onClose();
        }
    };

    const handleCancelNav = () => setPendingPath(null);

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
            {pendingPath && (
                <ConfirmNavModal
                    onConfirm={handleConfirmNav}
                    onCancel={handleCancelNav}
                />
            )}

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
                            onClick={() => handleNavigation(item.path)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                                 ${item.path === location.pathname
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
