import { useEffect, useState } from 'react'
import DashboardLayout from '@/layout/DashboardLayout'
import PageHeader from '@/components/ui/PageHeader'
import { useAuthStore } from '@/stores/authStore'
import { getPortafolio } from '@/features/auth/api/update-perfilPersonal'
import AvatarPerfil from '@/features/auth/components/Dashboard/profile/preview/AvatarPerfil'
import PortafolioContenido from '@/features/auth/components/Dashboard/profile/preview/PortafolioContenido'
import { User, Mail, MapPin, Phone, Briefcase, LayoutDashboard } from 'lucide-react'

export default function PerfilGeneral() {
    const user = useAuthStore(s => s.user)
    const portafolioStore = useAuthStore(s => s.portafolio)
    const setPortafolio = useAuthStore(s => s.setPortafolio)
    const [loadingPortafolio, setLoadingPortafolio] = useState(!portafolioStore)

    useEffect(() => {
        if (portafolioStore) return
        getPortafolio()
            .then(setPortafolio)
            .catch(() => setPortafolio(null))
            .finally(() => setLoadingPortafolio(false))
            //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!user) return null

    const campos = [
        { icon: User,      label: 'Nombre completo', value: `${user.nombre} ${user.apellido}` },
        { icon: Mail,      label: 'Correo',           value: user.correo },
        { icon: MapPin,    label: 'País',              value: user.pais?.nombre || '—' },
        { icon: Phone,     label: 'Teléfonos',         value: user.telefonos?.map(t => t.telefono).join(', ') || '—' },
        { icon: Briefcase, label: 'Descripción',       value: user.biografia || '—' },
    ]

    return (
        <DashboardLayout>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                <div className="lg:col-span-12">
                    <PageHeader icon={LayoutDashboard} title="Vista General" description="Información general de tu perfil profesional" />
                </div>

                <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    
                    <div className="divide-y divide-gray-50">
                        {campos.map(({ icon: Icon, label, value }) => (
                            <div key={label} className="flex flex-col px-6 py-4 hover:bg-slate-50/60 transition-colors gap-1.5">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-[#1e2a5e]/5 flex items-center justify-center shrink-0">
                                        <Icon size={15} className="text-black" />
                                    </div>
                                    <p className="text-[13px] text-black font-medium uppercase tracking-wide">{label}</p>
                                </div>
                                <p className="text-sm text-gray-600 font-normal text-left wrap-break-word pl-2 md:pl-10">{value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-5 flex flex-col gap-4">
                    <div className="bg-[#1e2a5e] rounded-2xl p-4 shadow-2xl flex flex-col gap-4">
                        <AvatarPerfil
                            user={user}
                            formData={{ nombre: user.nombre, apellido: user.apellido, biografia: user.biografia ?? '', correo: user.correo }}
                            profesiones={user.profesiones?.map(p => ({ id_profesion: p.id_profesion, nombre: p.nombre })) ?? []}
                        />
                        <PortafolioContenido portafolio={portafolioStore} loadingPortafolio={loadingPortafolio} />
                    </div>
                </div>

            </div>
        </DashboardLayout>
    )
}
