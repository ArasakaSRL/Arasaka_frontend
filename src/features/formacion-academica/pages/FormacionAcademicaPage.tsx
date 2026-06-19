import { useState } from "react"
import DashboardLayout from "@/layout/DashboardLayout"
import { Banner } from "@/components/Banner"

import FormacionAcademicaModal from "../components/FormacionAcademicaModal"
import FormacionCardList from "../components/FormacionCardList"

import { useFormacionAcademica } from "../hooks/useFormacionAcademica"

export default function FormacionAcademicaPage() {
    const [open, setOpen] = useState(false)
    const {
        loading,
        formaciones, 
        formData,
        handleChange,
        handleSubmit,
        resetForm
    } = useFormacionAcademica()

    const handleOpenModal = () => {
        resetForm()
        setOpen(true)
    }

    return (
        <DashboardLayout>
          
            <Banner
                titulo="Formación Académica"
                descripcion="Gestiona tus credenciales de estudio, títulos profesionales y cursos para potenciar tu portafolio."
                onAgregar={handleOpenModal}
            />
            

            <div className="max-w-5xl mx-auto w-full space-y-8 mt-8 px-2">
                




                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-sm font-bold text-slate-800 tracking-wide uppercase">
                            Historial de estudios
                        </h3>
                       
                        <span className="text-xs font-bold bg-[#1e2a5e]/10 text-[#1e2a5e] px-2.5 py-1 rounded-full">
                            {formaciones.length} {formaciones.length === 1 ? 'registro' : 'registros'}
                        </span>
                    </div>


                    <FormacionCardList formaciones={formaciones} />
                </div>


            </div>

            <FormacionAcademicaModal
                isOpen={open}
                onClose={() => setOpen(false)}
                formData={formData}
                loading={loading}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
            />
        </DashboardLayout>
    )
}