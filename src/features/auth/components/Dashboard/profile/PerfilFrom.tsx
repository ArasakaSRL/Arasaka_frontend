import { useEffect, useRef, useState } from 'react';
import { User, Briefcase, Mail, X, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getCatalogoProfesiones, getProfesiones, asignarProfesion, desasignarProfesion } from '@/features/auth/api/update-perfilPersonal';
import type { Profesion } from '@/features/auth/types/update-perfilPersonal';
import { perfilSchema } from '@/features/auth/utils/perfilSchema';
import { useDirtyStore } from '@/stores/dirtyStore';

interface PerfilFormData {
    nombre: string;
    apellido: string;
    biografia: string;
    correo: string;
}

type FormErrors = Partial<Record<keyof PerfilFormData, string>>;

interface PerfilFormProps {
    formData: PerfilFormData;
    setFormData: React.Dispatch<React.SetStateAction<PerfilFormData>>;
    asignadas: Profesion[];
    setAsignadas: React.Dispatch<React.SetStateAction<Profesion[]>>;
    loading: boolean;
    apiError: string | null;
    success: boolean;
    setSuccess: (val: boolean) => void;
    handleSave: () => void;
}

export default function PerfilForm({
    formData, setFormData, asignadas, setAsignadas, loading, apiError, success, setSuccess, handleSave
}: PerfilFormProps) {

    const [catalogo, setCatalogo] = useState<Profesion[]>([])
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [loadingProfesion, setLoadingProfesion] = useState<string | null>(null)
    const [errors, setErrors] = useState<FormErrors>({})
    const [isDirty, setIsDirty] = useState(false)
    const { setDirty } = useDirtyStore()

    const nombreRef = useRef<HTMLInputElement>(null)
    const apellidoRef = useRef<HTMLInputElement>(null)
    const correoRef = useRef<HTMLInputElement>(null)
    const biografiaRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        getCatalogoProfesiones().then(setCatalogo).catch(() => { })
        getProfesiones().then(setAsignadas).catch(() => { })
    }, [])

    const disponibles = catalogo.filter(p => !asignadas.some(a => a.id_profesion === p.id_profesion))

    // Marca el formulario como modificado y aplica trim
    function handleChange(field: keyof PerfilFormData, val: string) {
        setFormData(prev => ({ ...prev, [field]: val }))
        setIsDirty(true)
        setDirty(true)
        setErrors(prev => ({ ...prev, [field]: undefined }))
        if (success) setSuccess(false)
    }

    async function handleAsignar(profesion: Profesion) {
        setLoadingProfesion(profesion.id_profesion)
        try {
            await asignarProfesion({ id_profesion: profesion.id_profesion })
            setAsignadas(prev => [...prev, profesion])
        } finally {
            setLoadingProfesion(null)
            setDropdownOpen(false)
        }
    }

    async function handleDesasignar(profesion: Profesion) {
        setLoadingProfesion(profesion.id_profesion)
        try {
            await desasignarProfesion(profesion.id_profesion)
            setAsignadas(prev => prev.filter(p => p.id_profesion !== profesion.id_profesion))
        } finally {
            setLoadingProfesion(null)
        }
    }

    function validate(): boolean {
        // Trim antes de validar
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
        const fieldErrors: FormErrors = {};
        result.error.issues.forEach(e => {
            const field = e.path[0] as keyof PerfilFormData;
            if (!fieldErrors[field]) fieldErrors[field] = e.message;
        });
        setErrors(fieldErrors);
        // Foco en el primer campo con error
        if (fieldErrors.nombre) nombreRef.current?.focus()
        else if (fieldErrors.apellido) apellidoRef.current?.focus()
        else if (fieldErrors.correo) correoRef.current?.focus()
        else if (fieldErrors.biografia) biografiaRef.current?.focus()
        return false;
    }

    function handleSubmit() {
        if (validate()) {
            handleSave()
            setIsDirty(false)
            setDirty(false)
        }
    }

    // Guardar con Enter
    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter' && !loading) handleSubmit()
    }

    return (
        <div className="lg:col-span-7 space-y-4" onKeyDown={handleKeyDown}>
            <div>
                <p className="text-2xl! text-left font-bold text-black">Perfil Personal</p>
                <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-700! text-left">Administra tu información personal y profesional</p>
                </div>
            </div>

            <div className="bg-white border border-gray-300 rounded-2xl p-5 shadow-sm">
                <h2 className="text-lg! font-semibold! text-left text-black">Información Básica</h2>
                <p className="text-sm text-gray-700! text-left mb-8!">Tu información personal será visible en tu portafolio público</p>

                <div className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5! md:gap-3!">
                        <Input
                            ref={nombreRef}
                            label="Nombre"
                            icon={User} type="text"
                            placeholder="Tu nombre"
                            value={formData.nombre}
                            onChange={(val) => handleChange('nombre', val)}
                            error={errors.nombre}
                            maxLength={40}
                        />
                        <Input
                            ref={apellidoRef}
                            label="Apellido"
                            icon={User} type="text"
                            placeholder="Tu apellido"
                            value={formData.apellido}
                            onChange={(val) => handleChange('apellido', val)}
                            error={errors.apellido}
                            maxLength={40}
                        />
                    </div>

                    <Input
                        ref={correoRef}
                        label="Correo"
                        icon={Mail} type="text"
                        placeholder="tu@correo.com"
                        value={formData.correo}
                        onChange={(val) => handleChange('correo', val)}
                        error={errors.correo}
                        maxLength={50}
                    />

                    <div className="flex flex-col gap-1.5 w-full mb-2">
                        <label className="flex items-center gap-1.5 text-black font-semibold text-[14px] ml-1">
                            <Briefcase size={15} className="text-gray-500" />
                            Profesiones
                        </label>

                        <div className={`flex flex-wrap gap-2 ${asignadas.length > 0 ? 'mb-3' : '-mb-2.5'}`}>
                            {asignadas.map(p => (
                                <span key={p.id_profesion} className="flex items-center gap-1 px-4 py-3 bg-[#1e2a5e] text-white text-xs rounded-full">
                                    {p.nombre}
                                    <button onClick={() => handleDesasignar(p)} disabled={loadingProfesion === p.id_profesion} className="hover:text-red-300 transition-colors disabled:opacity-50">
                                        <X size={16} />
                                    </button>
                                </span>
                            ))}
                        </div>

                        <div className="relative">
                            <button
                                type="button"
                                tabIndex={0}
                                onClick={() => setDropdownOpen(prev => !prev)}
                                disabled={disponibles.length === 0}
                                className="flex items-center gap-2 px-4 py-3 w-full rounded-xl border border-gray-300 text-sm text-gray-500 hover:border-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="flex-1 text-left">{disponibles.length === 0 ? 'No hay más profesiones disponibles' : 'Agregar profesión...'}</span>
                                <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {dropdownOpen && disponibles.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                                    {disponibles.map(p => (
                                        <button key={p.id_profesion} onClick={() => handleAsignar(p)} disabled={loadingProfesion === p.id_profesion} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#1e2a5e] transition-colors disabled:opacity-50">
                                            {p.nombre}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <Input
                        ref={biografiaRef}
                        label="Descripción Profesional"
                        icon={Briefcase}
                        type="textarea"
                        placeholder="Ej: Desarrollador Fullstack"
                        value={formData.biografia}
                        onChange={(val) => handleChange('biografia', val)}
                        error={errors.biografia}
                        maxLength={200}
                        showCounter={true}
                    />
                </div>

                <div className="h-2" />

                {isDirty && !success && !apiError && <p className="text-orange-500 text-left text-xs -mt-2!">● Cambios sin guardar</p>}
                {apiError && <p className="text-red-500 text-left text-xs -mt-2!">{apiError}</p>}
                {success && <p className="text-green-600 text-left text-xs -mt-2!">Cambios guardados correctamente</p>}

                <div className="flex justify-end pt-4">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        tabIndex={0}
                        className="bg-[#1e2a5e] text-white px-8 py-2 rounded-xl font-normal hover:bg-[#151d41] transition-colors shadow-lg shadow-blue-900/20 disabled:opacity-60"
                    >
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </div>
        </div>
    );
}
