import { User, Briefcase, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';


interface PerfilFormData {
    nombre: string;
    apellido: string;
    descripcion_laboral: string;
    correo: string;
}

interface PerfilFormProps {
    formData: PerfilFormData;
    setFormData: React.Dispatch<React.SetStateAction<PerfilFormData>>;
    loading: boolean;
    apiError: string | null;
    success: boolean;
    handleSave: () => void;
}


export default function PerfilForm({
    formData,
    setFormData,
    loading,
    apiError,
    success,
    handleSave
}: PerfilFormProps) {
    return (
        <div className="lg:col-span-7 space-y-4">
            <div>
                <p className="text-2xl! text-left font-bold text-black">Perfil Personal</p>
                <p className="text-sm text-gray-700! text-left">Administra tu información personal y profesional</p>
            </div>

            <div className="bg-white border border-gray-300 rounded-2xl p-5 shadow-sm">
                <h2 className="text-lg! font-semibold! text-left text-black">Información Básica</h2>
                <p className="text-sm text-gray-700! text-left mb-8!">Tu información personal será visible en tu portafolio público</p>

                <div className="space-y-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                            label="Nombre"
                            icon={User}
                            type="text"
                            placeholder="Tu nombre"
                            value={formData.nombre}
                            onChange={(val) => setFormData(prev => ({ ...prev, nombre: val }))}
                        />
                        <Input
                            label="Apellido"
                            icon={User}
                            type="text"
                            placeholder="Tu apellido"
                            value={formData.apellido}
                            onChange={(val) => setFormData(prev => ({ ...prev, apellido: val }))}
                        />
                    </div>

                    <Input
                        label="Profesión / Título"
                        icon={Briefcase}
                        type="text"
                        placeholder="Ej: Desarrollador Fullstack"
                        value={formData.descripcion_laboral}
                        onChange={(val) => setFormData(prev => ({ ...prev, descripcion_laboral: val }))}
                    />

                    <Input
                        label="Correo"
                        icon={Mail}
                        type="text"
                        placeholder="tu@correo.com"
                        value={formData.correo}
                        onChange={(val) => setFormData(prev => ({ ...prev, correo: val }))}
                    />

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-left text-slate-700">Descripción Profesional</label>
                        <textarea
                            rows={4}
                            value={formData.descripcion_laboral}
                            onChange={(e) => setFormData({ ...formData, descripcion_laboral: e.target.value })}
                            className="w-full text-sm px-4 py-3 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-700 outline-none transition-all text-gray-500"
                        />
                    </div>

                </div>

                {apiError && <p className="text-red-500 text-xs mt-4">{apiError}</p>}
                {success && <p className="text-green-600 text-xs mt-4">Cambios guardados correctamente</p>}

                <div className="flex justify-end pt-4">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-[#1e2a5e] text-white px-8 py-2 rounded-xl font-normal hover:bg-[#151d41] transition-colors shadow-lg shadow-blue-900/20 disabled:opacity-60"
                    >
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </div>
        </div>
    );
}