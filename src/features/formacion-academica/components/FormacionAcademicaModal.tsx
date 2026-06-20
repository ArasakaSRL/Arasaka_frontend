import { GraduationCap, Building2, Calendar, FileText, X } from 'lucide-react'
import type { FormacionType } from '../hooks/useFormacionAcademica'

type Props = {
    isOpen: boolean
    onClose: () => void
    formData: FormacionType
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
    handleSubmit: (e: React.FormEvent) => Promise<boolean | undefined>
    loading: boolean
}

export default function FormacionAcademicaModal({
    isOpen,
    onClose,
    formData,
    handleChange,
    handleSubmit,
    loading,
}: Props) {
    if (!isOpen) return null

    const onSubmitInternal = async (e: React.FormEvent) => {
        const success = await handleSubmit(e)
        if (success) onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-2xl overflow-hidden transform transition-all scale-100">
                

                <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-[#1e2a5e]">
                        <GraduationCap size={22} className="text-[#1e2a5e]" />
                        <h2 className="text-lg font-bold">Agregar Nueva Formación</h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={onSubmitInternal} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-[#1e2a5e] mb-1">
                            <Building2 size={16} /> Institución *
                        </label>
                        <input
                            type="text"
                            name="institucion"
                            required
                            minLength={5}
                            maxLength={80}
                            pattern="^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]+$"
                            value={formData.institucion}
                            onChange={handleChange}
                            placeholder="Universidad Mayor de San Simón"
                            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1e2a5e]"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-[#1e2a5e] mb-1">
                            <GraduationCap size={16} /> Título *
                        </label>
                        <input
                            type="text"
                            name="titulo"
                            required
                            maxLength={50}
                            pattern="^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]+$"
                            value={formData.titulo}
                            onChange={handleChange}
                            placeholder="Ingeniería de Sistemas"
                            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1e2a5e]"
                        />
                        <div className="text-right text-[10px] text-gray-400 mt-0.5">
                            {formData.titulo?.length || 0}/50
                        </div>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-[#1e2a5e] mb-1">
                            <FileText size={16} /> Nivel Académico *
                        </label>
                        <select
                            name="nivel"
                            required
                            value={formData.nivel}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-[#1e2a5e]"
                        >
                    <option value="">Selecciona un nivel</option>
                    <option value="Tecnico">Técnico</option>
                    <option value="Licenciatura">Licenciatura</option>
                    <option value="Especialidad">Especialidad</option>
                    <option value="Maestria">Maestría</option>
                    <option value="Doctorado">Doctorado</option>
                    <option value="PostDoctorado">Post Doctorado</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-[#1e2a5e] mb-1">
                                <Calendar size={16} /> Fecha de Emision
                            </label>
                            <input
                                type="date"
                                name="fecha_fin"
                                max={new Date().toISOString().split("T")[0]}
                                required
                                value={formData.fecha_fin}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1e2a5e]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-[#1e2a5e] mb-1">
                            <FileText size={16} /> Descripción
                        </label>
                        <textarea
                            name="descripcion"
                            rows={3}
                            maxLength={550}
                            value={formData.descripcion}
                            onChange={handleChange}
                            placeholder="Describe tu formación académica... (Opcional)"
                            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm resize-none outline-none focus:ring-2 focus:ring-[#1e2a5e]"
                        />
                        <div className="text-right text-[10px] text-gray-400 mt-0.5">
                            {formData.descripcion?.length || 0}/550
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-medium text-gray-500 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[#1e2a5e] hover:bg-[#162047] text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Guardando...' : 'Guardar Formación'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}