import {
    GraduationCap,
    Building2,
    Calendar, // Cambiado por un icono con mayor visibilidad en modo oscuro
    FileText,
} from 'lucide-react'

type FormDataType = {
    institucion: string
    titulo: string
    nivel: string
    fecha_inicio: string
    fecha_fin: string
    descripcion: string
}

type Props = {
    formData: FormDataType
    handleChange: (
        e: React.ChangeEvent<
            HTMLInputElement |
            HTMLTextAreaElement |
            HTMLSelectElement
        >
    ) => void
    handleSubmit: (e: React.FormEvent) => void
    loading: boolean
    tieneFormacion: boolean
}

export default function FormacionAcademicaForm({
    formData,
    handleChange,
    handleSubmit,
    loading,
    tieneFormacion,
}: Props) {
    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-5"
        >
            <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-[#1e2a5e] mb-2">
                    <Building2 size={16} />
                    Institución *
                </label>

                <input
                    disabled={tieneFormacion}
                    type="text"
                    name="institucion"
                    required
                    minLength={5}
                    maxLength={80}
                    pattern="^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]+$"
                    onInvalid={(e) => {
                        const target = e.target as HTMLInputElement;
                        if (target.validity.valueMissing) {
                            target.setCustomValidity('Por favor, rellena este campo.');
                        } else if (target.validity.tooShort) {
                            target.setCustomValidity('Debe tener al menos 5 caracteres.');
                        } else if (target.validity.patternMismatch) {
                            target.setCustomValidity('No se permiten signos de puntuación ni caracteres especiales.');
                        }
                    }}
                    onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                    value={formData.institucion}
                    onChange={handleChange}
                    placeholder="Universidad Mayor de San Simón"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1e2a5e]"
                />
            </div>

            <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-[#1e2a5e] mb-2">
                    <GraduationCap size={16} />
                    Título *
                </label>

                <input
                    disabled={tieneFormacion}
                    type="text"
                    name="titulo"
                    required
                    maxLength={50}
                    pattern="^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]+$"
                    onInvalid={(e) => {
                        const target = e.target as HTMLInputElement;
                        if (target.validity.valueMissing) {
                            target.setCustomValidity('Por favor, rellena este campo.');
                        } else if (target.validity.patternMismatch) {
                            target.setCustomValidity('No se permiten signos de puntuación ni caracteres especiales.');
                        }
                    }}
                    onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                    value={formData.titulo}
                    onChange={handleChange}
                    placeholder="Ingeniería de Sistemas"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1e2a5e]"
                />

                <div className="text-right text-xs text-gray-400 mt-1">
                    {formData.titulo.length}/50
                </div>
            </div>

            <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-[#1e2a5e] mb-2">
                    <FileText size={16} />
                    Nivel Académico *
                </label>

                <select
                    disabled={tieneFormacion}
                    name="nivel"
                    required
                    onInvalid={(e) => {
                        const target = e.target as HTMLSelectElement;
                        if (target.validity.valueMissing) {
                            target.setCustomValidity('Por favor, selecciona una opción de la lista.');
                        }
                    }}
                    onInput={(e) => (e.target as HTMLSelectElement).setCustomValidity('')}
                    value={formData.nivel}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm bg-white outline-none focus:ring-2 focus:ring-[#1e2a5e]"
                >
                    <option value="">Selecciona un nivel</option>
                    <option value="Tecnico">Técnico</option>
                    <option value="Licenciatura">Licenciatura</option>
                    <option value="Maestria">Maestría</option>
                    <option value="Doctorado">Doctorado</option>
                    <option value="Diplomado">Diplomado</option>
                    <option value="Curso">Curso</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-[#1e2a5e] mb-2">
                        <Calendar size={16} />
                        Fecha Inicio *
                    </label>

                    <input
                        disabled={tieneFormacion}
                        type="date"
                        name="fecha_inicio"
                        max={formData.fecha_fin || undefined}
                        required
                        onInvalid={(e) => {
                            const target = e.target as HTMLInputElement;
                            if (target.validity.valueMissing) {
                                target.setCustomValidity('Por favor, introduce una fecha válida.');
                            }
                        }}
                        onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                        value={formData.fecha_inicio}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1e2a5e]"
                    />
                </div>

                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-[#1e2a5e] mb-2">
                        <Calendar size={16} />
                        Fecha Fin *
                    </label>

                    <input
                        disabled={tieneFormacion}
                        type="date"
                        name="fecha_fin"
                        min={formData.fecha_inicio || undefined}
                        required
                        onInvalid={(e) => {
                            const target = e.target as HTMLInputElement;
                            if (target.validity.valueMissing) {
                                target.setCustomValidity('Por favor, introduce una fecha válida.');
                            }
                        }}
                        onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                        value={formData.fecha_fin}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1e2a5e]"
                    />
                </div>
            </div>

            <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-[#1e2a5e] mb-2">
                    <FileText size={16} />
                    Descripción
                </label>

                <textarea
                    disabled={tieneFormacion}
                    name="descripcion"
                    rows={4}
                    maxLength={550}
                    value={formData.descripcion}
                    onChange={handleChange}
                    placeholder="Describe tu formación académica... (Opcional)"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm resize-none outline-none focus:ring-2 focus:ring-[#1e2a5e]"
                />

                <div className="text-right text-xs text-gray-400 mt-1">
                    {formData.descripcion.length}/550
                </div>
            </div>

            <div className="flex justify-end pt-2">
                <button
                    type="submit"
                    disabled={loading || tieneFormacion}
                    className={`text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all ${
                        loading || tieneFormacion
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-[#1e2a5e] hover:bg-[#162047]'
                    }`}
                >
                    {tieneFormacion
                        ? 'Información ya registrada'
                        : loading
                        ? 'Guardando...'
                        : 'Guardar'}
                </button>
            </div>
        </form>
    )
}