import type { experiencias } from "@/features/portafolio/types/portafolioType";
import { CalendarFold, GraduationCap } from "lucide-react";
type Props = {
  experiencias: experiencias[];
};

export default function Experiencia({
  experiencias,
}: Props) {

  const formatDate = (date: string | null) => {
  if (!date) return "Actualidad";

  return new Date(date).toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });
};
  return (
    <section className="bg-white border-4 border-slate-900 rounded-[36px] p-6 md:p-8 shadow-[14px_14px_0px_0px_rgba(247,214,224,1)] space-y-6">
      <div className="flex items-center gap-2 border-b-2 border-slate-100 pb-4">
        <div className="w-8 h-8 rounded-full bg-[#7bdff2] border-2 border-slate-900 flex items-center justify-center">
          <GraduationCap size={20} color="black"/>
        </div>
        <h3 className="font-black text-xl tracking-tight text-slate-900 uppercase">
          Experiencia
        </h3>
      </div>
      <div className="space-y-6 relative before:absolute before:left-4.25 before:top-2 before:bottom-2 before:w-0.75 before:bg-slate-900">
        {experiencias.map((exp, idx) => {
          const fechaFin =
            exp.fecha_fin ??
            exp.vigencia ??
            "Actualidad";
          return (
            <div
              key={exp.id_experiencia}
              className="relative pl-10 group"
            >
              <span
                className={`
                  absolute left-2.5 top-1
                  w-4 h-4 rounded-full
                  border-2 border-slate-900
                  z-10 transition
                  group-hover:scale-125
                  ${
                    idx === 0
                      ? "bg-[#7bdff2]"
                      : "bg-[#f2b5d4]"
                  }
                `}
              />
              {/*card*/}
              <div className="bg-[#eff7f6]/40 hover:bg-[#eff7f6]/95 border-2 border-slate-900 p-5 px-8 rounded-3xl transition duration-300 flex flex-col md:flex-row gap-4 justify-between">
                <div className="space-y-1 md:w-1/3 text-left self-start">
                  <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider">
                    Estación {idx + 1}
                  </span>
                  <h4 className="font-black text-base text-slate-900">
                    {exp.cargo}
                  </h4>
                  <p className="text-sm text-[#f2b5d4] font-black">
                    {exp.Nombre_empresa}
                  </p>
                  <span className="inline-flex gap-1 text-[9px] font-black text-slate-900 bg-white border border-slate-900 px-2.5 py-1 rounded-full uppercase mt-1">
                    <CalendarFold size={12} />
                    {formatDate(exp.fecha_inicio)} — {formatDate(fechaFin)}
                  </span>
                </div>
                <div className="md:w-2/3 flex items-center">
                  <p className="text-xs text-left sm:text-xs md:text-sm text-slate-700 leading-relaxed font-medium">
                    {exp.descripcion}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}