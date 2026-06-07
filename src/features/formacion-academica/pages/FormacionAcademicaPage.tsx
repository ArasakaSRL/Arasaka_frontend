import DashboardLayout from "@/layout/DashboardLayout"

import FormacionAcademicaHeader
from "../components/FormacionAcademicaHeader"

import FormacionAcademicaInfo
from "../components/FormacionAcademicaInfo"

import FormacionAcademicaForm
from "../components/FormacionAcademicaForm"

import { useFormacionAcademica }
from "../hooks/useFormacionAcademica"

export default function FormacionAcademicaPage() {

    const {
        loading,
        tieneFormacion,
        formData,
        handleChange,
        handleSubmit,
    } = useFormacionAcademica()

    return (
        <DashboardLayout>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                <div className="lg:col-span-12">
                    <FormacionAcademicaHeader />
                </div>

                <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

                    <div className="p-8">

                        <FormacionAcademicaForm
                            formData={formData}
                            loading={loading}
                            tieneFormacion={tieneFormacion}
                            handleChange={handleChange}
                            handleSubmit={handleSubmit}
                        />

                    </div>

                </div>

                <div className="lg:col-span-4">
                    <FormacionAcademicaInfo />
                </div>

            </div>

        </DashboardLayout>
    )
}