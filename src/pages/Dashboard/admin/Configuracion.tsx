import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import DashboardLayout from '@/layout/DashboardLayout'
import { Banner } from '@/components/Banner'
import { getSystemConfig, updateSystemConfig } from '@/features/denuncias/api/adminDenunciaApi'
import type { SystemConfig } from '@/features/denuncias/types/adminDenunciaType'

export default function AdminConfiguracion() {
    const [config, setConfig]         = useState<SystemConfig | null>(null)
    const [form, setForm]             = useState<Omit<SystemConfig, 'id'> | null>(null)
    const [guardando, setGuardando]   = useState(false)
    const [guardado, setGuardado]     = useState(false)

    const hayCambios = form && config
        ? form.denuncias_advertencia      !== config.denuncias_advertencia
       || form.denuncias_suspension       !== config.denuncias_suspension
       || form.portafolios_advertencia    !== config.portafolios_advertencia
       || form.portafolios_suspension     !== config.portafolios_suspension
       || form.dias_suspension_portafolio !== config.dias_suspension_portafolio
       || form.dias_suspension_usuario    !== config.dias_suspension_usuario
        : false

    useEffect(() => {
        getSystemConfig().then(c => {
            setConfig(c)
            setForm({
                denuncias_advertencia:      c.denuncias_advertencia,
                denuncias_suspension:       c.denuncias_suspension,
                portafolios_advertencia:    c.portafolios_advertencia,
                portafolios_suspension:     c.portafolios_suspension,
                dias_suspension_portafolio: c.dias_suspension_portafolio,
                dias_suspension_usuario:    c.dias_suspension_usuario,
            })
        }).catch(() => {})
    }, [])

    async function handleGuardar(e: React.FormEvent) {
        e.preventDefault()
        if (!form) return
        setGuardando(true)
        try {
            const updated = await updateSystemConfig(form)
            setConfig(updated)
            setGuardado(true)
            setTimeout(() => setGuardado(false), 2500)
        } catch {
            setGuardado(false)
        }
        finally { setGuardando(false) }
    }

    const grupoUmbral = [
        { key: 'denuncias_advertencia',   label: 'Denuncias para advertir portafolio',            descripcion: 'Al llegar a este número se envía un aviso al dueño.' },
        { key: 'denuncias_suspension',    label: 'Denuncias para suspender portafolio',            descripcion: 'Al llegar a este número el portafolio se suspende automáticamente.' },
        { key: 'portafolios_advertencia', label: 'Portafolios suspendidos para advertir usuario',  descripcion: 'Al llegar a este número se envía un aviso al usuario.' },
        { key: 'portafolios_suspension',  label: 'Portafolios suspendidos para suspender usuario', descripcion: 'Al llegar a este número la cuenta se suspende automáticamente.' },
    ]

    const grupoDuracion = [
        { key: 'dias_suspension_portafolio', label: 'Días de suspensión de portafolio', descripcion: 'Duración de la suspensión automática de un portafolio.' },
        { key: 'dias_suspension_usuario',    label: 'Días de suspensión de usuario',    descripcion: 'Duración de la suspensión automática de una cuenta de usuario.' },
    ]

    return (
        <DashboardLayout>
            <Banner titulo="Configuración" descripcion="Ajusta los límites del sistema de suspensiones automáticas" />

            <div className="mt-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="font-bold text-slate-800 text-base mb-1">Límites de suspensión</h2>
                    <p className="text-slate-400 text-sm mb-6">Los cambios aplican inmediatamente para las próximas denuncias.</p>

                    {form ? (
                        <form onSubmit={handleGuardar} className="flex flex-col gap-3">
                            {grupoUmbral.map(field => (
                                <div key={field.key} className="flex items-center justify-between gap-6 py-3 border-b border-gray-100 last:border-0">
                                    <div className="flex flex-col gap-0.5">
                                        <label className="text-sm text-left font-semibold text-slate-700">{field.label}</label>
                                        <p className="text-xs text-left text-slate-400">{field.descripcion}</p>
                                    </div>
                                    <input
                                        type="number"
                                        min={1}
                                        value={form[field.key as keyof typeof form]}
                                        onChange={e => setForm(p => p ? { ...p, [field.key]: Number(e.target.value) } : p)}
                                        className="w-24 shrink-0 border border-gray-200 rounded-xl px-4 py-2 text-sm text-center text-slate-700 font-semibold focus:outline-none focus:border-[#1e2a5e] transition-colors"
                                    />
                                </div>
                            ))}

                            <div className="pt-2 pb-1">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Duración de suspensiones</p>
                            </div>

                            {grupoDuracion.map(field => (
                                <div key={field.key} className="flex items-center justify-between gap-6 py-3 border-b border-gray-100 last:border-0">
                                    <div className="flex flex-col gap-0.5">
                                        <label className="text-sm text-left font-semibold text-slate-700">{field.label}</label>
                                        <p className="text-xs text-left text-slate-400">{field.descripcion}</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <input
                                            type="number"
                                            min={1}
                                            value={form[field.key as keyof typeof form]}
                                            onChange={e => setForm(p => p ? { ...p, [field.key]: Number(e.target.value) } : p)}
                                            className="w-24 border border-gray-200 rounded-xl px-4 py-2 text-sm text-center text-slate-700 font-semibold focus:outline-none focus:border-[#1e2a5e] transition-colors"
                                        />
                                        <span className="text-xs text-slate-400">días</span>
                                    </div>
                                </div>
                            ))}

                            {guardado && (
                                <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">
                                    <Check size={16} className="shrink-0" />
                                    Configuración guardada correctamente.
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={guardando || !hayCambios}
                                className="flex items-center justify-center gap-2 w-full mt-2 py-3 bg-[#1e2a5e] hover:bg-[#16266B] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-colors"
                            >
                                {guardando ? 'Guardando...' : 'Guardar cambios'}
                            </button>
                        </form>
                    ) : (
                        <p className="text-slate-400 text-sm">Cargando configuración...</p>
                    )}
                </div>
            </div>
        </DashboardLayout>
    )
}
