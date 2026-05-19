import {
    User, Briefcase, Award,
    Trophy, BarChart3, Settings,HatGlasses,Eye, LogOut, ShieldCheck, MessageSquare,
    Inbox, Send, LayoutDashboard, ChevronRight, Star, Pencil, Phone, FolderOpen,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { logoutRequest } from '@/features/auth/api/auth';
import { useState, useRef } from 'react';
import { useDirtyStore } from '@/stores/dirtyStore';
import ConfirmNavModal from '@/components/ui/ConfirmNavModal';
import { AnimatePresence, motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface SubmenuItem {
    icon: LucideIcon
    label: string
    path: string
}

interface MenuItem {
    icon: LucideIcon
    label: string
    path: string
    submenu?: SubmenuItem[]
}

const menuItems: MenuItem[] = [
    {
        icon: User, label: 'Perfil Personal', path: '/Dashboard/perfil/General',
        submenu: [
            { icon: User,       label: 'Vista General', path: '/Dashboard/perfil/General' },
            { icon: Pencil,     label: 'Editar Perfil', path: '/Dashboard/perfil/Editar' },
            { icon: Phone,      label: 'Teléfonos',     path: '/Dashboard/perfil/Telefonos' },
            { icon: FolderOpen, label: 'Portafolio',    path: '/Dashboard/perfil/Portafolio' },
        ]
    },
    { icon: Briefcase,     label: 'Proyectos',       path: '/Dashboard/proyectos/Proyectos' },
    { icon: Award,         label: 'Habilidades',     path: '/Dashboard/habilidades/Habilidades' },
    { icon: Trophy,        label: 'Experiencias',           path: '/Dashboard/hitos/Hitos' },
    { icon: ShieldCheck,   label: 'Certificaciones', path: '/Dashboard/certificaciones/Certificaciones' },
    {
        icon: MessageSquare, label: 'Mensajes', path: '/Dashboard/mensajes/Principal',
        submenu: [
            { icon: LayoutDashboard, label: 'Principal',  path: '/Dashboard/mensajes/Principal' },
            { icon: Inbox,           label: 'Recibidos',  path: '/Dashboard/mensajes/Recibidos' },
            { icon: Send,            label: 'Enviados',   path: '/Dashboard/mensajes/Enviados' },
            { icon: Star,            label: 'Destacados', path: '/Dashboard/mensajes/Destacados' },
        ]
    },
    { icon: BarChart3, label: 'Estadísticas',  path: '/Dashboard/estadisticas/Reportes' },
    { icon: LayoutDashboard, label: 'Portafolios', path: '/Dashboard/admin/Usuarios' },
    { icon: Settings,  label: 'Configuración', path: '/Dashboard/configuracion/Configuracion',
        submenu: [
            { icon: Eye, label: 'Visibilidad Componentes',  path: '/Dashboard/configuracion/Componentes' },
            { icon: HatGlasses ,           label: 'Visibilidad General',  path: '/Dashboard/configuracion/General' },
        ]

    },
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
    const [desktopOpen, setDesktopOpen] = useState<string | null>(null);
    const [mobileOpen, setMobileOpen] = useState<string | null>(null);
    const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const isActivePath = (path: string) => location.pathname === path
    const isActiveGroup = (item: MenuItem) => item.submenu
        ? item.submenu.some(s => location.pathname === s.path)
        : location.pathname === item.path

    const handleNavigation = (path: string) => {
        if (isDirty && path !== location.pathname) { setPendingPath(path); return; }
        navigate(path);
        onClose();
        setDesktopOpen(null);
        setMobileOpen(null);
    };

    const handleConfirmNav = () => {
        if (pendingPath) {
            setDirty(false);
            navigate(pendingPath);
            setPendingPath(null);
            onClose();
        }
    };

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

    function openDesktop(label: string) {
        if (hideTimeout.current) clearTimeout(hideTimeout.current);
        setDesktopOpen(label);
    }
    function closeDesktop() {
        hideTimeout.current = setTimeout(() => setDesktopOpen(null), 150);
    }

    function renderSubmenuItems(items: SubmenuItem[]) {
        return items.map(sub => (
            <button
                key={sub.label}
                onClick={() => handleNavigation(sub.path)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors rounded-lg
                    ${isActivePath(sub.path)
                        ? 'text-[#1e2a5e] font-semibold bg-blue-50'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-[#1e2a5e]'
                    }`}
            >
                <sub.icon size={15} strokeWidth={1.8} className="shrink-0" />
                {sub.label}
            </button>
        ))
    }

    return (
        <>
            {pendingPath && (
                <ConfirmNavModal onConfirm={handleConfirmNav} onCancel={() => setPendingPath(null)} />
            )}

            {isOpen && (
                <div className="md:hidden fixed inset-0 bg-black/40 z-30" onClick={onClose} />
            )}

            <aside className={`w-54 bg-white border-r border-gray-200 h-[calc(100vh-4rem)] fixed left-0 top-16 z-30 flex flex-col transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

                <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
                    {menuItems.map((item) => (
                        item.submenu ? (
                            <div key={item.label}>
                                {/* Desktop hover submenu */}
                                <div
                                    ref={el => { itemRefs.current[item.label] = el }}
                                    className="relative hidden md:block"
                                    onMouseEnter={() => openDesktop(item.label)}
                                    onMouseLeave={closeDesktop}
                                >
                                    <button
                                        onClick={() => handleNavigation(item.path)}
                                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                                            ${isActiveGroup(item)
                                                ? 'bg-[#1e2a5e] text-white'
                                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                            }`}
                                    >
                                        <item.icon size={18} strokeWidth={1.8} />
                                        <span className="flex-1 text-left">{item.label}</span>
                                        <ChevronRight size={14} className={`transition-transform duration-200 ${desktopOpen === item.label ? 'rotate-90' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {desktopOpen === item.label && (
                                            <motion.div
                                                initial={{ opacity: 0, x: -8 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -8 }}
                                                transition={{ duration: 0.15 }}
                                                onMouseEnter={() => openDesktop(item.label)}
                                                onMouseLeave={closeDesktop}
                                                className="fixed ml-2 w-40 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-100"
                                                style={{
                                                    left: '12.5rem',
                                                    top: (itemRefs.current[item.label]?.getBoundingClientRect().top ?? 0) - 64
                                                }}
                                            >
                                                <div className="p-1">{renderSubmenuItems(item.submenu)}</div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Mobile accordion */}
                                <div className="md:hidden flex flex-col">
                                    <button
                                        onClick={() => setMobileOpen(p => p === item.label ? null : item.label)}
                                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                                            ${isActiveGroup(item)
                                                ? 'bg-[#1e2a5e] text-white'
                                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                            }`}
                                    >
                                        <item.icon size={18} strokeWidth={1.8} />
                                        <span className="flex-1 text-left">{item.label}</span>
                                        <ChevronRight size={14} className={`transition-transform duration-200 ${mobileOpen === item.label ? 'rotate-90' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {mobileOpen === item.label && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden pl-4 flex flex-col gap-0.5 mt-0.5"
                                            >
                                                {renderSubmenuItems(item.submenu)}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ) : (
                            <button
                                key={item.label}
                                onClick={() => handleNavigation(item.path)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                                    ${isActivePath(item.path)
                                        ? 'bg-[#1e2a5e] text-white'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                    }`}
                            >
                                <item.icon size={18} strokeWidth={1.8} />
                                <span>{item.label}</span>
                            </button>
                        )
                    ))}
                </nav>

                <div className="px-3 py-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        disabled={isLoading}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                            ${isLoading
                                ? 'bg-gray-100 text-black cursor-not-allowed'
                                : 'bg-red-600 text-white'
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
