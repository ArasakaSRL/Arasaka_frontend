import { useEffect, useState } from 'react'
import DashboardLayout from '@/layout/DashboardLayout'
import PageHeader from '@/components/ui/PageHeader'
import { useAuthStore } from '@/stores/authStore'
import AvatarPerfil from '@/features/auth/components/Dashboard/profile/preview/AvatarPerfil'
import PortafolioContenido from '@/features/auth/components/Dashboard/profile/preview/PortafolioContenido'
import { User, Mail, MapPin, Phone, Briefcase, LayoutDashboard } from 'lucide-react'
import { getPortafolio } from '@/features/auth/api/update-perfilPersonal'
import type { PortafolioCompleto } from '@/features/auth/types/portafolioData'

export default function PerfilGeneral() {
    const user = useAuthStore(s => s.user)
    const portafolio = useAuthStore(s => s.portafolioSeleccionado)
    const info = portafolio?.informacion_basica
    const [portafolioCompleto, setPortafolioCompleto] = useState<PortafolioCompleto | null>(null)
    const [loadingCompleto, setLoadingCompleto] = useState(true)

    useEffect(() => {
        if (!portafolio?.id_portafolio) return
        setLoadingCompleto(true)
        getPortafolio(portafolio.id_portafolio)
            .then(setPortafolioCompleto)
            .catch(() => setPortafolioCompleto(null))
            .finally(() => setLoadingCompleto(false))
    }, [portafolio?.id_portafolio])

    if (!user) return null

    const telefonos = portafolio?.telefonos?.map((t: { telefono: string }) => t.telefono).join(', ') || '—'

    const campos = [
        { icon: User,      label: 'Nombre completo', value: info?.nombre_completo || '—' },
        { icon: Mail,      label: 'Gmail',            value: info?.gmail || '—' },
        { icon: MapPin,    label: 'País',              value: info?.pais || '—' },
        { icon: Phone,     label: 'Teléfonos',         value: telefonos },
        { icon: Briefcase, label: 'Descripción',       value: info?.biografia || '—' },
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
                            formData={{ nombre: info?.nombre_completo?.split(' ')[0] ?? user.nombre, apellido: info?.nombre_completo?.split(' ').slice(1).join(' ') ?? user.apellido, biografia: info?.biografia ?? '', correo: info?.gmail ?? user.correo }}
                            profesiones={portafolio?.profesiones?.map((p: { id_profesion: string; nombre: string }) => ({ id_profesion: p.id_profesion, nombre: p.nombre })) ?? []}
                        />
                        <PortafolioContenido portafolio={portafolioCompleto} loadingPortafolio={loadingCompleto} />
                    </div>
                </div>

            </div>
        </DashboardLayout>
    )
}
