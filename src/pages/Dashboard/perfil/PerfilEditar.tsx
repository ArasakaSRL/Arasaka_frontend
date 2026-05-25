import { useState, useRef, useEffect } from 'react'
import DashboardLayout from '@/layout/DashboardLayout'
import PageHeader from '@/components/ui/PageHeader'
import { useAuthStore } from '@/stores/authStore'
import { actualizarInformacionBasica, getPortafolio, asignarProfesion, desasignarProfesion } from '@/features/auth/api/update-perfilPersonal'
import type { Profesion } from '@/features/auth/types/update-perfilPersonal'
import InfoBasicaFields from '@/features/auth/components/Dashboard/profile/InfoBasicaFields'
import type { InfoBasicaFormData } from '@/features/auth/components/Dashboard/profile/InfoBasicaFields'
import ProfesionesSection from '@/features/auth/components/Dashboard/profile/ProfesionesSection'
import { Input } from '@/components/ui/input'
import { Briefcase } from 'lucide-react'
import AvatarPerfil from '@/features/auth/components/Dashboard/profile/preview/AvatarPerfil'
import PortafolioContenido from '@/features/auth/components/Dashboard/profile/preview/PortafolioContenido'
import { perfilSchema } from '@/features/auth/utils/perfilSchema'
import { useDirtyStore } from '@/stores/dirtyStore'
import { AxiosError } from 'axios'
import { UserPen } from 'lucide-react'

type FormErrors = Partial<Record<keyof InfoBasicaFormData, string>>

export default function PerfilEditar() {
    const user = useAuthStore(s => s.user)
    const portafolioStore = useAuthStore(s => s.portafolio)
    const portafolioSeleccionado = useAuthStore(s => s.portafolioSeleccionado)
    const setPortafolioSeleccionado = useAuthStore(s => s.setPortafolioSeleccionado)
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

    const infoBasica = portafolioSeleccionado?.informacion_basica

    const [formData, setFormData] = useState<InfoBasicaFormData>({
        nombre_completo: infoBasica?.nombre_completo || '',
        gmail: infoBasica?.gmail || '',
        pais: infoBasica?.pais || '',
        biografia: infoBasica?.biografia || '',
    })

    useEffect(() => {
        if (!infoBasica) return
        setFormData({
            nombre_completo: infoBasica.nombre_completo || '',
            gmail: infoBasica.gmail || '',
            pais: infoBasica.pais || '',
            biografia: infoBasica.biografia || '',
        })
        initialData.current = {
            nombre_completo: infoBasica.nombre_completo || '',
            gmail: infoBasica.gmail || '',
            pais: infoBasica.pais || '',
            biografia: infoBasica.biografia || '',
        }
    }, [portafolioSeleccionado?.id])

    const [asignadas, setAsignadas] = useState<Profesion[]>([])
    const initialAsignadas = useRef<Profesion[]>([])
    const [profesionesAgregadas, setProfesionesAgregadas] = useState<Profesion[]>([])
    const [profesionesQuitadas, setProfesionesQuitadas] = useState<Profesion[]>([])
    const [errors, setErrors] = useState<FormErrors>({})
    const [loading, setLoading] = useState(false)
    const [apiError, setApiError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const initialData = useRef<InfoBasicaFormData>({ ...formData })
    const nombreRef = useRef<HTMLInputElement>(null)
    const gmailRef = useRef<HTMLInputElement>(null)

    const hasProfesionesChanges = profesionesAgregadas.length > 0 || profesionesQuitadas.length > 0

    const hasChanges =
        formData.nombre_completo !== initialData.current.nombre_completo ||
        formData.gmail !== initialData.current.gmail ||
        formData.pais !== initialData.current.pais ||
        formData.biografia !== initialData.current.biografia ||
        hasProfesionesChanges

    function handleChange(field: keyof InfoBasicaFormData, val: string) {
        setFormData(prev => ({ ...prev, [field]: val }))
        setDirty(true)
        if (success) setSuccess(false)
        const shape = perfilSchema.shape as Record<string, { safeParse: (v: unknown) => { success: boolean; error?: { issues: { message: string }[] } } }>
        const result = shape[field]?.safeParse(val)
        if (result && !result.success) {
            setErrors(prev => ({ ...prev, [field]: result.error?.issues[0]?.message }))
        } else {
            setErrors(prev => ({ ...prev, [field]: undefined }))
        }
    }

    function validate(): boolean {
        const result = perfilSchema.safeParse({
            nombre_completo: formData.nombre_completo.trim(),
            gmail: formData.gmail.trim(),
            pais: formData.pais,
            biografia: formData.biografia,
        })
        if (result.success) { setErrors({}); return true }
        const fieldErrors: FormErrors = {}
        result.error.issues.forEach(e => {
            const field = e.path[0] as keyof InfoBasicaFormData
            if (!fieldErrors[field]) fieldErrors[field] = e.message
        })
        setErrors(fieldErrors)
        if (fieldErrors.nombre_completo) nombreRef.current?.focus()
        else if (fieldErrors.gmail) gmailRef.current?.focus()
        return false
    }

    async function handleSave() {
        if (!validate() || !portafolioSeleccionado) return
        setApiError(null)
        setLoading(true)
        try {
            await actualizarInformacionBasica(portafolioSeleccionado.id_portafolio, {
                nombre_completo: formData.nombre_completo.trim(),
                gmail: formData.gmail.trim(),
                pais: formData.pais || undefined,
                biografia: formData.biografia || undefined,
            })

            // Guardar cambios de profesiones
            const idPortafolio = portafolioSeleccionado.id_portafolio
            await Promise.all([
                ...profesionesAgregadas.map(p => asignarProfesion(idPortafolio, { id_profesion: p.id_profesion })),
                ...profesionesQuitadas.map(p => desasignarProfesion(idPortafolio, p.id_profesion)),
            ])
            setProfesionesAgregadas([])
            setProfesionesQuitadas([])
            initialAsignadas.current = [...asignadas]

            // Reflejar cambios en el store inmediatamente
            const current = useAuthStore.getState().portafolioSeleccionado
            if (current) {
                setPortafolioSeleccionado({
                    ...current,
                    informacion_basica: current.informacion_basica
                        ? {
                            ...current.informacion_basica,
                            nombre_completo: formData.nombre_completo.trim(),
                            gmail: formData.gmail.trim(),
                            pais: formData.pais || current.informacion_basica.pais,
                            biografia: formData.biografia || null,
                        }
                        : current.informacion_basica,
                })
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
                    <PageHeader icon={UserPen} title="Perfil Personal" description="Administra la información básica de tu portafolio" />
                </div>

                {/* Formulario */}
                <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 shadow-sm">
                    <div className="p-6 flex flex-col gap-4">
                        <div>
                            <p className="text-lg font-semibold text-black">Información Básica</p>
                            <p className="text-sm text-gray-500">Esta información será visible en tu portafolio público</p>
                        </div>

                        <InfoBasicaFields
                            formData={formData}
                            errors={errors}
                            onChange={handleChange}
                            nombreRef={nombreRef}
                            gmailRef={gmailRef}
                        />

                        <ProfesionesSection
                            asignadas={asignadas}
                            setAsignadas={(val) => {
                                // primera carga desde la API — guarda el estado inicial
                                if (initialAsignadas.current.length === 0 && typeof val !== 'function') {
                                    initialAsignadas.current = val as Profesion[]
                                }
                                setAsignadas(val as Profesion[])
                            }}
                            onAgregar={(p) => {
                                setAsignadas(prev => [...prev, p])
                                setProfesionesAgregadas(prev => [...prev, p])
                                setProfesionesQuitadas(prev => prev.filter(q => q.id_profesion !== p.id_profesion))
                                setDirty(true)
                            }}
                            onQuitar={(p) => {
                                setAsignadas(prev => prev.filter(a => a.id_profesion !== p.id_profesion))
                                setProfesionesQuitadas(prev => [...prev, p])
                                setProfesionesAgregadas(prev => prev.filter(a => a.id_profesion !== p.id_profesion))
                                setDirty(true)
                            }}
                        />

                        <Input
                            label="Descripción"
                            icon={Briefcase}
                            type="textarea"
                            placeholder="Cuéntanos sobre ti, tu experiencia y habilidades..."
                            value={formData.biografia}
                            onChange={(val) => handleChange('biografia', val)}
                            error={errors.biografia}
                            maxLength={180}
                            showCounter={true}
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
                    <div className="bg-[#1e2a5e] rounded-2xl p-4 shadow-2xl flex flex-col gap-4 overflow-hidden">
                        <AvatarPerfil
                            user={user}
                            formData={{ nombre: formData.nombre_completo, apellido: '', biografia: formData.biografia, correo: formData.gmail, pais: formData.pais }}
                            profesiones={asignadas}
                        />
                        <PortafolioContenido portafolio={portafolioStore} loadingPortafolio={loadingPortafolio} />
                    </div>
                </div>

            </div>
        </DashboardLayout>
    )
}
