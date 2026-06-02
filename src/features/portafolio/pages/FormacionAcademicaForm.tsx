import { useState } from 'react'
import DashboardLayout from '@/layout/DashboardLayout'
import PageHeader from '@/components/ui/PageHeader'
import {crearFormacionProfesional} from '@/features/portafolio/lib/formacionProfecional.service'
import {useAuthStore} from '@/stores/authStore'
import {
    GraduationCap,
    Building2,
    CalendarDays,
    FileText,
    LayoutDashboard,
} from 'lucide-react'

export default function FormacionAcademica() {
    const id = useAuthStore.getState().portafolioSeleccionado?.id_portafolio
    const [formData, setFormData] = useState({
        id_portafolio: id || '',
        institucion: '',
        titulo: '',
        nivel: '',
        fecha_inicio: '',
        fecha_fin: '',
        descripcion: '',
    })

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement |
            HTMLTextAreaElement |
            HTMLSelectElement
        >
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        crearFormacionProfesional(formData)
            .then((response) => {
                console.log('Formación profesional creada:', response);
            })
            .catch((error) => {
                console.error('Error al crear formación profesional:', error);
            });
    }

    return (
        <DashboardLayout>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* HEADER */}
                <div className="lg:col-span-12">
                    <PageHeader
                        icon={LayoutDashboard}
                        title="Formación Académica"
                        description="Administra tu información académica y profesional"
                    />
                </div>

                {/* FORMULARIO */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

                    <div className="p-8">

                        {/* TITULO */}
                        <div className="text-center mb-10">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 rounded-2xl bg-[#1e2a5e]/10 flex items-center justify-center">
                                    <GraduationCap className="w-8 h-8 text-[#1e2a5e]" />
                                </div>
                            </div>

                            <h2 className="text-3xl font-bold text-black">
                                Información Académica
                            </h2>

                            <p className="text-gray-500 mt-2">
                                Esta información será visible en tu portafolio público
                            </p>
                        </div>

                        {/* FORM */}
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
            type="text"
            name="institucion"
            required
            maxLength={80}
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
            type="text"
            name="titulo"
            required
            maxLength={50}
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
            name="nivel"
            required
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
                <CalendarDays size={16} />
                Fecha Inicio *
            </label>

            <input
                type="date"
                name="fecha_inicio"
                required
                value={formData.fecha_inicio}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1e2a5e]"
            />
        </div>

        <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-[#1e2a5e] mb-2">
                <CalendarDays size={16} />
                Fecha Fin *
            </label>

            <input
                type="date"
                name="fecha_fin"
                required
                value={formData.fecha_fin}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1e2a5e]"
            />
        </div>

    </div>

    <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-[#1e2a5e] mb-2">
            <FileText size={16} />
            Descripción *
        </label>

        <textarea
            name="descripcion"
            required
            rows={4}
            maxLength={550}
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Describe tu formación académica..."
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm resize-none outline-none focus:ring-2 focus:ring-[#1e2a5e]"
        />

        <div className="text-right text-xs text-gray-400 mt-1">
            {formData.descripcion.length}/550
        </div>
    </div>

    <div className="flex justify-end pt-2">
        <button
            type="submit"
            className="bg-[#1e2a5e] hover:bg-[#162047] text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all"
        >
            Guardar
        </button>
    </div>

</form>
                    </div>

                </div>

                {/* PANEL DERECHO */}
                <div className="lg:col-span-4">

                    <div className="bg-[#1e2a5e] rounded-2xl p-6 shadow-2xl text-white">

                        <div className="flex flex-col items-center text-center">

                            <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center mb-5">
                                <GraduationCap className="w-10 h-10" />
                            </div>

                            <h3 className="text-2xl font-bold">
                                Formación Profesional
                            </h3>

                            <p className="text-white/70 mt-3 text-sm leading-relaxed">
                                Agrega tu experiencia académica para fortalecer
                                tu perfil profesional y mejorar la presentación
                                de tu portafolio público.
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </DashboardLayout>
    )
}
export { FormacionAcademica as FormacionAcademicaForm }