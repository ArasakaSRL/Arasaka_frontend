import { useRef, useState } from 'react';
import { Briefcase } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { Profesion, Telefono } from '@/features/auth/types/update-perfilPersonal';
import { perfilSchema } from '@/features/auth/utils/perfilSchema';
import { useDirtyStore } from '@/stores/dirtyStore';
import InfoBasicaFields from './InfoBasicaFields';
import TelefonosSection from './TelefonosSection';
import ProfesionesSection from './ProfesionesSection';

export interface PerfilFormData {
    nombre: string;
    apellido: string;
    biografia: string;
    correo: string;
    pais: string;
}

type FormErrors = Partial<Record<keyof PerfilFormData, string>>;

interface PerfilFormProps {
    formData: PerfilFormData;
    setFormData: React.Dispatch<React.SetStateAction<PerfilFormData>>;
    asignadas: Profesion[];
    setAsignadas: React.Dispatch<React.SetStateAction<Profesion[]>>;
    telefonos: Telefono[];
    onAgregarTelefono: (numero: string) => Promise<void>;
    onEliminarTelefono: (id: string) => Promise<void>;
    onActualizarTelefono: (id: string, numero: string) => Promise<void>;
    loading: boolean;
    apiError: string | null;
    success: boolean;
    setSuccess: (val: boolean) => void;
    handleSave: () => void;
}

export default function PerfilForm({
    formData, setFormData, asignadas, setAsignadas, telefonos,
    onAgregarTelefono, onEliminarTelefono, onActualizarTelefono,
    loading, apiError, success, setSuccess, handleSave
}: PerfilFormProps) {

    const [errors, setErrors] = useState<FormErrors>({})
    const [isDirty, setIsDirty] = useState(false)
    const { setDirty } = useDirtyStore()

    const [initialData, setInitialData] = useState({
        nombre: formData.nombre,
        apellido: formData.apellido,
        pais: formData.pais,
        biografia: formData.biografia,
    })

    const hasChanges =
        formData.nombre !== initialData.nombre ||
        formData.apellido !== initialData.apellido ||
        formData.pais !== initialData.pais ||
        formData.biografia !== initialData.biografia

    const nombreRef = useRef<HTMLInputElement>(null)
    const apellidoRef = useRef<HTMLInputElement>(null)
    const correoRef = useRef<HTMLInputElement>(null)
    const biografiaRef = useRef<HTMLInputElement>(null)

    function handleChange(field: keyof PerfilFormData, val: string) {
        setFormData(prev => ({ ...prev, [field]: val }))
        setIsDirty(true)
        setDirty(true)
        setErrors(prev => ({ ...prev, [field]: undefined }))
        if (success) setSuccess(false)
    }

    function validate(): boolean {
        setFormData(prev => ({
            ...prev,
            nombre: prev.nombre.trim(),
            apellido: prev.apellido.trim(),
            correo: prev.correo.trim(),
            biografia: prev.biografia.trim(),
        }))
        const result = perfilSchema.safeParse({
            ...formData,
            nombre: formData.nombre.trim(),
            apellido: formData.apellido.trim(),
            correo: formData.correo.trim(),
        })
        if (result.success) { setErrors({}); return true; }
        const fieldErrors: FormErrors = {}
        result.error.issues.forEach(e => {
            const field = e.path[0] as keyof PerfilFormData
            if (!fieldErrors[field]) fieldErrors[field] = e.message
        })
        setErrors(fieldErrors)
        if (fieldErrors.nombre) nombreRef.current?.focus()
        else if (fieldErrors.apellido) apellidoRef.current?.focus()
        else if (fieldErrors.correo) correoRef.current?.focus()
        else if (fieldErrors.biografia) biografiaRef.current?.focus()
        return false
    }

    function handleSubmit() {
        if (validate()) {
            handleSave()
            setIsDirty(false)
            setDirty(false)
            setInitialData({
                nombre: formData.nombre.trim(),
                apellido: formData.apellido.trim(),
                pais: formData.pais,
                biografia: formData.biografia.trim(),
            })
        }
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter' && !loading) handleSubmit()
    }

    return (
        <div className="lg:col-span-7 space-y-4" onKeyDown={handleKeyDown}>
            <div>
                <p className="text-2xl! text-left font-bold text-black">Perfil Personal</p>
                <p className="text-sm text-gray-700! text-left">Administra tu información personal y profesional</p>
            </div>

            <div className="bg-white border border-gray-300 rounded-2xl p-5 shadow-sm">
                <h2 className="text-lg! font-semibold! text-left text-black">Información Básica</h2>
                <p className="text-sm text-gray-700! text-left mb-8!">Tu información personal será visible en tu portafolio público</p>

                <div className="space-y-2">
                    <InfoBasicaFields
                        formData={formData}
                        errors={errors}
                        onChange={handleChange}
                        nombreRef={nombreRef}
                        apellidoRef={apellidoRef}
                        correoRef={correoRef}
                        biografiaRef={biografiaRef}
                    />

                    <TelefonosSection
                        telefonos={telefonos}
                        onAgregar={onAgregarTelefono}
                        onEliminar={onEliminarTelefono}
                        onActualizar={onActualizarTelefono}
                    />

                    <ProfesionesSection
                        asignadas={asignadas}
                        setAsignadas={setAsignadas}
                    />

                    <Input
                        ref={biografiaRef}
                        label="Descripción Profesional"
                        icon={Briefcase}
                        type="textarea"
                        placeholder="Ej: Desarrollador Fullstack"
                        value={formData.biografia}
                        onChange={(val) => handleChange('biografia', val)}
                        error={errors.biografia}
                        maxLength={270}
                        showCounter={true}
                    />
                </div>

                <div className="h-2" />

                {hasChanges && !success && !apiError && <p className="text-orange-500 text-left text-xs">● Cambios sin guardar</p>}
                {apiError && <p className="text-red-500 text-left text-xs">{apiError}</p>}
                {success && <p className="text-green-600 text-left text-xs">Cambios guardados correctamente</p>}

                <div className="flex justify-end pt-4">
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !hasChanges}
                        className="bg-[#1e2a5e] text-white px-8 py-2 rounded-xl font-normal hover:bg-[#151d41] transition-colors shadow-lg shadow-blue-900/20 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </div>
        </div>
    )
}
