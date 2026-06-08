import {
    User, Briefcase, Award,
    Trophy, BarChart3, Settings,HatGlasses,Eye, LogOut, ShieldCheck, MessageSquare,
    Inbox, Send, LayoutDashboard, ChevronRight, Star, UserPen, FolderOpen,GraduationCap,LayoutPanelTop,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { logoutRequest } from '@/features/auth/api/auth';
import { useState, useRef } from 'react';
import { useDirtyStore } from '@/stores/dirtyStore';
import ConfirmNavModal from '@/components/ui/ConfirmNavModal';
import { AnimatePresence, motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

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
    tourId?: string
}

const menuItems: MenuItem[] = [
    {
        icon: User, label: 'Perfil Personal', path: '/Dashboard/perfil/General', tourId: 'tour-perfil',
        submenu: [
            { icon: User,       label: 'Vista General', path: '/Dashboard/perfil/General' },
            { icon: UserPen,     label: 'Actualizar Perfil', path: '/Dashboard/perfil/Editar' },
           // { icon: Phone,      label: 'Teléfonos',     path: '/Dashboard/perfil/Telefonos' },
            //{ icon: FolderOpen, label: 'Portafolio',    path: '/Dashboard/perfil/Portafolio' },
            { icon: GraduationCap,    label: 'Formación Académica', path: '/portafolio/formacion-academica' },
        ]
    },
    { icon: Briefcase,     label: 'Proyectos',       path: '/Dashboard/proyectos/Proyectos',            tourId: 'tour-proyectos' },
    { icon: Award,         label: 'Habilidades',     path: '/Dashboard/habilidades/Habilidades',        tourId: 'tour-habilidades' },
    { icon: Trophy,        label: 'Experiencias',    path: '/Dashboard/hitos/Hitos',                    tourId: 'tour-experiencias' },
    { icon: ShieldCheck,   label: 'Certificaciones', path: '/Dashboard/certificaciones/Certificaciones', tourId: 'tour-certificaciones' },
    {
        icon: MessageSquare, label: 'Mensajes', path: '/Dashboard/mensajes/Principal', tourId: 'tour-mensajes',
        submenu: [
            { icon: LayoutDashboard, label: 'Principal',  path: '/Dashboard/mensajes/Principal' },
            { icon: Inbox,           label: 'Recibidos',  path: '/Dashboard/mensajes/Recibidos' },
            { icon: Send,            label: 'Enviados',   path: '/Dashboard/mensajes/Enviados' },
            { icon: Star,            label: 'Destacados', path: '/Dashboard/mensajes/Destacados' },
        ]
    },
    { icon: BarChart3, label: 'Estadísticas', path: '/Dashboard/estadisticas/Reportes', tourId: 'tour-estadisticas' 
        ,submenu: [
            { icon: BarChart3, label: 'Reportes Mensuales', path: '/reportes-mensuales' },
        ]
    },

   //{ icon: Settings,  label: 'Configuración', path: '/Dashboard/configuracion/Configuracion' },
   //{ icon: FolderOpen, label: 'Tegnologías',   path: '/Dashboard/tegnologias' },
    { icon: FolderOpen, label: 'Portafolios', path: '/Dashboard/admin/Usuarios', tourId: 'tour-portafolios' },
    { icon: Settings,  label: 'Configuración', path: '/Dashboard/configuracion/Configuracion', tourId: 'tour-configuracion',
        submenu: [
            { icon: Eye, label: 'Visibilidad Componentes',  path: '/Dashboard/configuracion/Componentes' },
            { icon: HatGlasses ,           label: 'Visibilidad General',  path: '/Dashboard/configuracion/General' },
            { icon: LayoutPanelTop, label:'Plantillas Portafolio', path:'/Dashboard/configuracion/Plantillas'},
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
    const portafolioSeleccionado = useAuthStore(s => s.portafolioSeleccionado);
    const clearUser = useAuthStore(s => s.clearUser);
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
            clearUser();
            sessionStorage.removeItem('tour_iniciado');
            navigate('/');
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

            <aside id="sidebar" className={`w-54 bg-white border-r border-gray-200 h-[calc(100vh-4rem)] fixed left-0 top-16 z-30 flex flex-col transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

                {portafolioSeleccionado && (
                    <div className="px-3 pt-3">
                        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                            <FolderOpen size={14} className="text-blue-600 shrink-0" />
                            <div className="flex flex-col min-w-0">
                                <span className="text-[10px] text-blue-400 font-medium uppercase tracking-wide leading-none mb-0.5">Administrando</span>
                                <span className="text-xs font-semibold text-blue-700 truncate">{portafolioSeleccionado.nombre}</span>
                            </div>
                        </div>
                    </div>
                )}

                <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
                    {menuItems.map((item) => (
                        item.submenu ? (
                            <div key={item.label} id={item.tourId}>
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
                                                className="fixed ml-2 min-w-[240px] bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-100"
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
                                id={item.tourId}
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
