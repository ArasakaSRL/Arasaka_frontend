import React, { useState } from 'react';
import Sidebar from '@/features/auth/components/Dashboard/Sidebar';
import DashboardHeader from '@/features/auth/components/Dashboard/DashboardHeader';
import {useAuthStore} from '@/stores/authStore';
import SidderAdmin from '@/components/SidderAdmin';
interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const user = useAuthStore((state) => state.user);

    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        <div className="min-h-screen bg-[#F8FAFC]">

            <DashboardHeader
                onMenuClick={() => setSidebarOpen(prev => !prev)}
                sidebarOpen={sidebarOpen}
            />
            {user?.correo === 'jhonvergara437@gmail.com' ? (
                <SidderAdmin
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                />
             ) : (
           <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
           />
         )}

            <main className="pt-14 md:ml-54 min-h-screen transition-all duration-300">
                <div className="max-w-full sm:p-6 md:p-2">
                    {children}
                </div>
            </main>
        </div>
    );
}
