import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import DashboardLayout from '@/layout/DashboardLayout'
import CuentaAvatar from '@/features/cuenta/components/CuentaAvatar'
import CuentaInfo from '@/features/cuenta/components/CuentaInfo'
import CuentaContrasena from '@/features/cuenta/components/CuentaContrasena'

export default function Cuenta() {
    const navigate = useNavigate()

    return (
        <DashboardLayout hideSidebar>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                <div className="lg:col-span-12 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                        <h1 className="text-h-sm! text-left font-bold text-slate-800 leading-tight">Mi Cuenta</h1>
                        <p className="text-sm sm:text-sm text-left text-slate-500 mt-0.5">Gestiona tu información personal y seguridad</p>
                    </div>
                    <button
                        onClick={() => navigate('/Dashboard/perfil/General')}
                        className="flex items-center gap-1.5 px-3 py-2 sm:px-4 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs sm:text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm shrink-0 whitespace-nowrap"
                    >
                        <ArrowLeft size={14} />
                        Panel principal
                    </button>
                </div>

                <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <CuentaAvatar />
                    <div className="px-4 pb-6">
                        <CuentaInfo />
                    </div>
                </div>

                <div className="lg:col-span-8 flex flex-col gap-4">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <CuentaContrasena />
                    </div>
                </div>

            </div>
        </DashboardLayout>
    )
}
