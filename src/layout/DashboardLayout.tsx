import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '@/features/auth/components/Dashboard/Sidebar';
import DashboardHeader from '@/features/auth/components/Dashboard/DashboardHeader';
import {useAuthStore} from '@/stores/authStore';
import SidderAdmin from '@/components/SidderAdmin';
import { startOnboardingTour } from '@/services/tourService';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/Alerta';
interface DashboardLayoutProps {
    children: React.ReactNode;
    hideSidebar?: boolean;
}

export default function DashboardLayout({ children, hideSidebar = false }: DashboardLayoutProps) {
    const user = useAuthStore((state) => state.user);
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (user && !user.tour_completado && !sessionStorage.getItem('tour_iniciado')) {
            sessionStorage.setItem('tour_iniciado', 'true')
            startOnboardingTour(navigate, setSidebarOpen)
        }
    }, [user])

    useEffect(() => {
        if (!user || user.perfil_completo) return

        toast.warning('⚠️ Seguridad: completa tu perfil agregando un usuario y contraseña.', 8000)

        const intervalo = setInterval(() => {
            toast.warning('⚠️ Seguridad: completa tu perfil agregando un usuario y contraseña.', 8000)
        }, 10000)

        return () => clearInterval(intervalo)
    }, [user?.perfil_completo])
    return (
        <div className="min-h-screen bg-[#F8FAFC]">

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
                <div className="max-w-full sm:p-6 md:p-2">
                    {children}
                </div>
            </main>
        </div>
    );
}
