import { useState, useRef, useEffect } from 'react'
import DashboardLayout from '@/layout/DashboardLayout'
import PageHeader from '@/components/ui/PageHeader'
import { useAuthStore } from '@/stores/authStore'
import { actualizarInformacion, actualizarPais, getPortafolio, asignarProfesion, desasignarProfesion } from '@/features/auth/api/update-perfilPersonal'
import InfoBasicaFields from '@/features/auth/components/Dashboard/profile/InfoBasicaFields'
import ProfesionesSection from '@/features/auth/components/Dashboard/profile/ProfesionesSection'
import AvatarPerfil from '@/features/auth/components/Dashboard/profile/preview/AvatarPerfil'
import PortafolioContenido from '@/features/auth/components/Dashboard/profile/preview/PortafolioContenido'
import { perfilSchema } from '@/features/auth/utils/perfilSchema'
import { useDirtyStore } from '@/stores/dirtyStore'
import type { Profesion } from '@/features/auth/types/update-perfilPersonal'
import type { PerfilFormData } from '@/features/auth/components/Dashboard/profile/PerfilFrom'
import { AxiosError } from 'axios'
import { UserPen, Briefcase } from 'lucide-react'
import { Input } from '@/components/ui/input'

type FormErrors = Partial<Record<keyof PerfilFormData, string>>

export default function PerfilEditar() {
    const user = useAuthStore(s => s.user)
    const setUser = useAuthStore(s => s.setUser)
    const portafolioStore = useAuthStore(s => s.portafolio)
    const setPortafolio = useAuthStore(s => s.setPortafolio)
    const { setDirty } = useDirtyStore()
    const [loadingPortafolio, setLoadingPortafolio] = useState(!portafolioStore)

    useEffect(() => {
        if (portafolioStore) return
        getPortafolio()
            .then(setPortafolio)
            .catch(() => setPortafolio(null))
            .finally(() => setLoadingPortafolio(false))
            //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const [formData, setFormData] = useState<PerfilFormData>({
        nombre: user?.nombre || '',
        apellido: user?.apellido || '',
        biografia: user?.biografia || '',
        correo: user?.correo || '',
        pais: user?.pais?.nombre || '',
    })
    const [asignadas, setAsignadas] = useState<Profesion[]>([])
    const [profesionesIniciales, setProfesionesIniciales] = useState<Profesion[]>([])
    const [errors, setErrors] = useState<FormErrors>({})
    const [loading, setLoading] = useState(false)
    const [apiError, setApiError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const initialData = useRef({ ...formData })
    const nombreRef = useRef<HTMLInputElement>(null)
    const apellidoRef = useRef<HTMLInputElement>(null)
    const correoRef = useRef<HTMLInputElement>(null)
    const biografiaRef = useRef<HTMLInputElement>(null)

    const profesionesModificadas =
        asignadas.length !== profesionesIniciales.length ||
        asignadas.some(a => !profesionesIniciales.find(p => p.id_profesion === a.id_profesion))

    const hasChanges =
        formData.nombre !== initialData.current.nombre ||
        formData.apellido !== initialData.current.apellido ||
        formData.pais !== initialData.current.pais ||
        formData.biografia !== initialData.current.biografia ||
        profesionesModificadas

    function handleChange(field: keyof PerfilFormData, val: string) {
        setFormData(prev => ({ ...prev, [field]: val }))
        setDirty(true)
        if (success) setSuccess(false)
        const result = perfilSchema.shape[field as keyof typeof perfilSchema.shape]?.safeParse(val)
        if (result && !result.success) {
            setErrors(prev => ({ ...prev, [field]: result.error.issues[0]?.message }))
        } else {
            setErrors(prev => ({ ...prev, [field]: undefined }))
        }
    }

    function validate(): boolean {
        const result = perfilSchema.safeParse({
            ...formData,
            nombre: formData.nombre.trim(),
            apellido: formData.apellido.trim(),
            correo: formData.correo.trim(),
        })
        if (result.success) { setErrors({}); return true }
        const fieldErrors: FormErrors = {}
        result.error.issues.forEach(e => {
            const field = e.path[0] as keyof PerfilFormData
            if (!fieldErrors[field]) fieldErrors[field] = e.message
        })
        setErrors(fieldErrors)
        if (fieldErrors.nombre) nombreRef.current?.focus()
        else if (fieldErrors.apellido) apellidoRef.current?.focus()
        else if (fieldErrors.correo) correoRef.current?.focus()
        return false
    }

    async function handleSave() {
        if (!validate()) return
        setApiError(null)
        setLoading(true)
        try {
            const res = await actualizarInformacion({
                nombre: formData.nombre.trim(),
                apellido: formData.apellido.trim(),
                correo: formData.correo.trim(),
                ...(formData.biografia && { biografia: formData.biografia }),
            })
            if (formData.pais.trim()) await actualizarPais({ nombre: formData.pais.trim() })
            if (user) setUser({ ...user, ...res.data, pais: { nombre: formData.pais } })

            // Guardar profesiones pendientes
            if (profesionesModificadas) {
                const agregar = asignadas.filter(a => !profesionesIniciales.find(p => p.id_profesion === a.id_profesion))
                const quitar = profesionesIniciales.filter(p => !asignadas.find(a => a.id_profesion === p.id_profesion))
                await Promise.all([
                    ...agregar.map(p => asignarProfesion({ id_profesion: p.id_profesion })),
                    ...quitar.map(p => desasignarProfesion(p.id_profesion)),
                ])
                setProfesionesIniciales(asignadas)
            }

            setSuccess(true)
            setDirty(false)
            initialData.current = { ...formData }
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>
            setApiError(error?.response?.data?.message ?? 'Error al guardar los cambios')
        } finally {
            setLoading(false)
        }
    }

    if (!user) return null

    return (
        <DashboardLayout>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                <div className="lg:col-span-12">
                    <PageHeader icon={UserPen} title="Actualizar Perfil" description="Actualiza tu información personal y profesional" />
                </div>

                {/* Formulario */}
                <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 shadow-sm">
                    
                    <div className="p-6 flex flex-col gap-4">
                        <InfoBasicaFields
                            formData={formData}
                            errors={errors}
                            onChange={handleChange}
                            nombreRef={nombreRef}
                            apellidoRef={apellidoRef}
                            correoRef={correoRef}
                            biografiaRef={biografiaRef}
                        />
                        <ProfesionesSection
                            asignadas={asignadas}
                            setAsignadas={(val) => {
                                const resolved = typeof val === 'function' ? val(asignadas) : val
                                setAsignadas(resolved)
                                if (profesionesIniciales.length === 0 && resolved.length > 0) {
                                    setProfesionesIniciales(resolved)
                                }
                            }}
                            onAgregar={p => { setAsignadas(prev => [...prev, p]); setDirty(true) }}
                            onQuitar={p => { setAsignadas(prev => prev.filter(a => a.id_profesion !== p.id_profesion)); setDirty(true) }}
                            onChange={() => setDirty(true)}
                        />
                        <Input
                            ref={biografiaRef}
                            label="Descripción Profesional"
                            icon={Briefcase}
                            type="textarea"
                            placeholder="Ej: Desarrollador Fullstack"
                            value={formData.biografia}
                            onChange={val => handleChange('biografia', val)}
                            error={errors.biografia}
                            maxLength={270}
                            showCounter
                        />

                        <div className="flex items-center justify-between pt-2">
                            <div>
                                {hasChanges && !success && !apiError && <p className="text-orange-500 text-xs">● Cambios sin guardar</p>}
                                {apiError && <p className="text-red-500 text-xs">{apiError}</p>}
                                {success && <p className="text-green-600 text-xs">✓ Cambios guardados correctamente</p>}
                            </div>
                            <button
                                onClick={handleSave}
                                disabled={loading || !hasChanges}
                                className="bg-[#1e2a5e] text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-[#151d41] transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Guardando...' : 'Guardar cambios'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Preview */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                    <div className="bg-[#1e2a5e] rounded-2xl p-4 shadow-2xl flex flex-col gap-4">
                        <AvatarPerfil
                            user={user}
                            formData={formData}
                            profesiones={asignadas}
                        />
                        <PortafolioContenido portafolio={portafolioStore} loadingPortafolio={loadingPortafolio} />
                    </div>
                </div>

            </div>
        </DashboardLayout>
    )
}
