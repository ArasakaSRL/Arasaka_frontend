import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/features/auth/components/Dashboard/Sidebar';
import DashboardHeader from '@/features/auth/components/Dashboard/DashboardHeader';
import { useAuthStore } from '@/stores/authStore';
import type { AuthUser } from '@/stores/authStore';
import SidderAdmin from '@/components/SidderAdmin';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/Alerta';
import { Joyride, STATUS, type Step, type EventData } from 'react-joyride';
import apiClient from '@/api/api';

interface DashboardLayoutProps {
    children: React.ReactNode;
    hideSidebar?: boolean;
}

const joyrideStyles = {
    options: {
        primaryColor: '#1e2a5e',
        textColor: '#374151',
        backgroundColor: '#ffffff',
        arrowColor: '#ffffff',
        overlayColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
        width: 280,
    },
    tooltip: {
        borderRadius: '14px',
        padding: '18px 22px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
        fontFamily: 'Poppins, sans-serif',
    },
    tooltipTitle: {
        fontSize: '14px',
        fontWeight: '700',
        color: '#1e2a5e',
        marginBottom: '4px',
    },
    tooltipContent: {
        fontSize: '12.5px',
        color: '#64748b',
        lineHeight: '1.6',
        padding: '2px 0',
    },
    buttonNext: {
        backgroundColor: '#1e2a5e',
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: '600',
        padding: '7px 16px',
        color: '#fff',
    },
    buttonBack: {
        color: '#64748b',
        fontSize: '12px',
        fontWeight: '500',
        marginRight: '6px',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '6px 12px',
        background: 'transparent',
    },
    buttonSkip: {
        color: '#94a3b8',
        fontSize: '11px',
    },
}

const TOUR_STEPS: Step[] = [
    {
        target: 'body',
        placement: 'center',
        title: '👋 ¡Bienvenido a tu Dashboard!',
        content: 'Te guiaremos por las secciones principales para sacarle el máximo provecho a tu portafolio.',
    },
    {
        target: '#sidebar',
        placement: 'right',
        title: '🧭 Navegación principal',
        content: 'Desde aquí accedes a perfil, proyectos, habilidades, experiencias y más.',
        isFixed: true,
    },
    {
        target: '#tour-perfil',
        placement: 'right',
        title: '👤 Perfil Personal',
        content: 'Completa tu nombre, foto y datos de contacto para que los reclutadores te conozcan.',
        isFixed: true,
    },
    {
        target: '#tour-proyectos',
        placement: 'right',
        title: '💼 Proyectos',
        content: 'Muestra tus proyectos con descripción, tecnologías e imágenes.',
        isFixed: true,
    },
    {
        target: '#tour-habilidades',
        placement: 'right',
        title: '⚡ Habilidades',
        content: 'Agrega tus habilidades técnicas y blandas para destacar tu perfil.',
        isFixed: true,
    },
    {
        target: '#tour-experiencias',
        placement: 'right',
        title: '🏆 Experiencias',
        content: 'Registra tus experiencias laborales y logros importantes.',
        isFixed: true,
    },
    {
        target: '#tour-certificaciones',
        placement: 'right',
        title: '🎓 Certificaciones',
        content: 'Agrega certificaciones y cursos para validar tus conocimientos.',
        isFixed: true,
    },
    {
        target: '#tour-mensajes',
        placement: 'right',
        title: '💬 Mensajes',
        content: 'Revisa los mensajes que te envían los visitantes de tu portafolio.',
        isFixed: true,
    },
    {
        target: '#tour-estadisticas',
        placement: 'right',
        title: '📊 Estadísticas',
        content: 'Visualiza cuántas personas visitan tu portafolio y qué secciones revisan más.',
        isFixed: true,
    },
    {
        target: '#tour-portafolios',
        placement: 'right',
        title: '📁 Portafolios',
        content: 'Gestiona tus portafolios públicos que los reclutadores pueden ver.',
        isFixed: true,
    },
    {
        target: '#tour-configuracion',
        placement: 'right',
        title: '⚙️ Configuración',
        content: 'Personaliza la visibilidad y apariencia de tu portafolio.',
        isFixed: true,
    },
]


export default function DashboardLayout({ children, hideSidebar = false }: DashboardLayoutProps) {
    const user = useAuthStore((state) => state.user);
    const setUser = useAuthStore((state) => state.setUser);
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [tourRun, setTourRun] = useState(false);
    const navigateRef = React.useRef(navigate);
    useEffect(() => { navigateRef.current = navigate; }, [navigate]);


    useEffect(() => {
        if (user && !user.tour_completado && !sessionStorage.getItem('tour_iniciado') && window.innerWidth >= 1024) {
            sessionStorage.setItem('tour_iniciado', 'true')
            setTimeout(() => setTourRun(true), 500)
        }
    }, [user])

    useEffect(() => {
        if (!user || user.perfil_completo) return
        if (tourRun) return

        const INTERVALO_MS = 600000
        const CLAVE = 'perfil_advertencia_ts'

        const mostrarToast = () => {
            toast.warning('⚠️ Seguridad: completa tu perfil agregando un usuario y contraseña.', 8000)
            sessionStorage.setItem(CLAVE, String(Date.now()))
        }

        const ultimo = Number(sessionStorage.getItem(CLAVE) ?? 0)
        const msPasados = Date.now() - ultimo
        if (msPasados >= INTERVALO_MS) {
            mostrarToast()
        }

        const tiempoRestante = Math.max(INTERVALO_MS - msPasados, INTERVALO_MS)
        const timeout = setTimeout(() => {
            mostrarToast()
            const intervalo = setInterval(mostrarToast, INTERVALO_MS)
            return () => clearInterval(intervalo)
        }, tiempoRestante)

        return () => clearTimeout(timeout)
    }, [user, tourRun])

    const handleTourEvent = useCallback(async (data: EventData) => {
        const { status } = data

        if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
            navigateRef.current('/Dashboard/perfil/General')
            setTourRun(false)
            sessionStorage.removeItem('tour_iniciado')
            setSidebarOpen(false)
            try {
                await apiClient.patch('/usuario/tour')
                if (user) setUser({ ...user, tour_completado: true } as AuthUser)
            } catch (error) {
                console.error('Error al actualizar el estado del tour:', error)
            }
        }
    }, [user, setUser])

    return (
        <div className="min-h-screen bg-[#F8FAFC]">

            <Joyride
                steps={TOUR_STEPS}
                run={tourRun}
                continuous
                scrollToFirstStep={false}
                options={{
                    showProgress: true,
                    skipBeacon: true,
                    targetWaitTimeout: 3000,
                    buttons: ['back', 'primary', 'skip'] as ('back' | 'close' | 'primary' | 'skip')[],
                }}
                locale={{
                    back: '← Anterior',
                    close: 'Cerrar',
                    last: '¡Listo! 🎉',
                    next: 'Siguiente →',
                    skip: 'Saltar tour',
                }}
                styles={joyrideStyles}
                onEvent={handleTourEvent}
            />

            <DashboardHeader
                onMenuClick={() => setSidebarOpen(prev => !prev)}
                sidebarOpen={sidebarOpen}
            />

            {!hideSidebar && (
                user?.correo === 'jhonvergara437@gmail.com' ? (
                    <SidderAdmin
                        isOpen={sidebarOpen}
                        onClose={() => setSidebarOpen(false)}
                    />
                ) : (
                    <Sidebar
                        isOpen={sidebarOpen}
                        onClose={() => setSidebarOpen(false)}
                    />
                )
            )}

            <main className={`pt-14 min-h-screen transition-all duration-300 ${hideSidebar ? '' : 'md:ml-54'}`}>
                <div className="p-4 sm:p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
