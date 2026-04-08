import React, { useState } from 'react';
import Sidebar from '@/features/auth/components/Dashboard/Sidebar';
import DashboardHeader from '@/features/auth/components/Dashboard/DashboardHeader';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <DashboardHeader
                onMenuClick={() => setSidebarOpen(prev => !prev)}
                sidebarOpen={sidebarOpen}
            />

            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <main className="pt-14 md:ml-54 min-h-screen transition-all duration-300">
                <div className="max-w-full sm:p-6 md:p-2">
                    {children}
                </div>
            </main>
        </div>
    );
}
