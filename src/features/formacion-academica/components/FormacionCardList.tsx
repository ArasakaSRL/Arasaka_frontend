import { Calendar, GraduationCap, School } from "lucide-react"
import type { FormacionType } from "../hooks/useFormacionAcademica"

type Props = {
    formaciones: FormacionType[]
}

export default function FormacionCardList({ formaciones }: Props) {
    if (formaciones.length === 0) {
        return (
            <div className="text-center py-20 bg-slate-50/40 rounded-3xl border-2 border-dashed border-slate-200/60 backdrop-blur-sm max-w-4xl mx-auto w-full">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400 shadow-sm">
                    <GraduationCap size={26} />
                </div>

                <p className="text-slate-600 font-semibold text-base">
                    Tu historial académico está impecable
                </p>
            </div>
        )
    }

    const getNivelBadgeStyles = (nivel: string) => {
        const base =
            "text-[10px] px-3 py-0.5 rounded-full font-bold tracking-wider uppercase border "

        switch (nivel) {
            case "Licenciatura":
                return base + "bg-blue-50/80 text-blue-700 border-blue-100"

            case "Maestria":
                return base + "bg-indigo-50/80 text-indigo-700 border-indigo-100"

            case "Doctorado":
                return base + "bg-purple-50/80 text-purple-700 border-purple-100"

            case "Tecnico":
                return base + "bg-emerald-50/80 text-emerald-700 border-emerald-100"

            default:
                return base + "bg-slate-50 text-slate-600 border-slate-100"
        }
    }

    return (
        <div className="max-w-5xl mx-auto w-full space-y-4 antialiased">
            {formaciones.map((item, index) => {

                const fecha = item.fecha_fin
                    ? item.fecha_fin.split("-")[0]
                    : "Sin fecha"

                return (
                    <div
                        key={item.id_formacion || index}
                        className="group relative bg-white hover:bg-slate-50/30 rounded-2xl border border-slate-100 hover:border-slate-200/70 p-5 transition-all duration-300 ease-out shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_30px_-10px_rgba(30,42,94,0.06)] overflow-hidden"
                    >

                        <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#1e2a5e] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center" />

                        <div className="flex items-start sm:items-center gap-5">

                            <div className="hidden sm:flex w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 group-hover:text-[#1e2a5e] group-hover:bg-blue-50/40 group-hover:border-blue-100 items-center justify-center transition-all duration-300 shrink-0 shadow-sm">
                                <School size={20} strokeWidth={1.5} />
                            </div>

                            <div className="space-y-1 flex-1 min-w-0">

                                <div className="flex flex-wrap items-center gap-2.5">

                                    <span className={getNivelBadgeStyles(item.nivel)}>
                                        {item.nivel}
                                    </span>

                                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 bg-slate-50/80 px-2.5 py-0.5 rounded-full border border-slate-100">
                                        <Calendar size={12} />
                                        {fecha}
                                    </span>

                                </div>

                                <h4 className="text-base font-bold text-slate-800 tracking-tight truncate group-hover:text-black transition-colors">
                                    {item.titulo}
                                </h4>

                                <p className="text-xs text-slate-500 font-medium tracking-wide">
                                    {item.institucion}
                                </p>

                                {item.descripcion && (
                                    <div className="max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100 group-hover:mt-3 transition-all duration-300 ease-in-out overflow-hidden">
                                        <p className="text-xs text-slate-400 bg-slate-50/60 p-3 rounded-xl border border-slate-100/50 italic">
                                            {item.descripcion}
                                        </p>
                                    </div>
                                )}

                            </div>

                        </div>
                    </div>
                )
            })}
        </div>
    )
}