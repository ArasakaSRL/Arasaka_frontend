import { useRef, useState } from 'react';
import { Briefcase } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { Profesion, Telefono } from '@/features/auth/types/update-perfilPersonal';
import { perfilSchema } from '@/features/auth/utils/perfilSchema';
import { useDirtyStore } from '@/stores/dirtyStore';
import InfoBasicaFields, { type InfoBasicaFormData } from './InfoBasicaFields';
import TelefonosSection from './TelefonosSection';
import ProfesionesSection from './ProfesionesSection';

export interface PerfilFormData {
    nombre_completo: string;
    nombre: string;
    apellido: string;
    gmail: string;
    correo: string;
    biografia: string;
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
        nombre_completo: formData.nombre_completo,
        gmail: formData.gmail,
        pais: formData.pais,
        biografia: formData.biografia,
    })

    // Verificar si hay cambios en los datos
    const hasChanges =
        formData.nombre_completo !== initialData.nombre_completo ||
        formData.gmail !== initialData.gmail ||
        formData.pais !== initialData.pais ||
        formData.biografia !== initialData.biografia

    // Si el usuario revirtió todos los cambios, limpiar el estado dirty
    if (!hasChanges && isDirty) {
        setIsDirty(false)
        setDirty(false)
    }

    const nombreRef = useRef<HTMLInputElement>(null)
    const gmailRef = useRef<HTMLInputElement>(null)

    // Función para manejar cambios en los campos del formulario
    function handleChange(field: keyof InfoBasicaFormData, val: string) {
        setFormData(prev => ({ ...prev, [field]: val }))
        setIsDirty(true)
        setDirty(true)
        if (success) setSuccess(false)

        // Validar el campo en tiempo real
        const result = perfilSchema.shape[field as keyof typeof perfilSchema.shape]?.safeParse(val)
        if (result && !result.success) {
            setErrors(prev => ({ ...prev, [field]: result.error.issues[0]?.message }))
        } else {
            setErrors(prev => ({ ...prev, [field]: undefined }))
        }
    }

    // Función para validar el formulario
    function validate(): boolean {
        setFormData(prev => ({
            ...prev,
            nombre_completo: prev.nombre_completo.trim(),
            gmail: prev.gmail.trim(),
            biografia: prev.biografia.trim(),
        }))
        const result = perfilSchema.safeParse({
            nombre_completo: formData.nombre_completo.trim(),
            gmail: formData.gmail.trim(),
            pais: formData.pais,
            biografia: formData.biografia.trim(),
        })
        if (result.success) { setErrors({}); return true; }

        const fieldErrors: FormErrors = {}

        result.error.issues.forEach(e => {
            const field = e.path[0] as keyof PerfilFormData
            if (!fieldErrors[field]) fieldErrors[field] = e.message
        })
        setErrors(fieldErrors)

        if (fieldErrors.nombre_completo) nombreRef.current?.focus()
        else if (fieldErrors.gmail) gmailRef.current?.focus()
        return false
    }

    // Función para manejar el envío del formulario
    function handleSubmit() {
        if (validate()) {
            handleSave()
            setIsDirty(false)
            setDirty(false)
            setInitialData({
                nombre_completo: formData.nombre_completo.trim(),
                gmail: formData.gmail.trim(),
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

                <div className="space-y-3!">
                    <InfoBasicaFields
                        formData={formData}
                        errors={errors}
                        onChange={handleChange}
                        nombreRef={nombreRef}
                        gmailRef={gmailRef}
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
