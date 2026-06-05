import { GraduationCap } from "lucide-react"

export default function FormacionAcademicaInfo() {
    return (
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
    )
}