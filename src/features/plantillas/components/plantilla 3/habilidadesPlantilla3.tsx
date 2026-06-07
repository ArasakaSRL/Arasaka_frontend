import { useState } from "react";

import type {
  HabilidadTecnica,
  HabilidadBlanda,
} from "@/features/portafolio/types/portafolioType";

type Props = {
  tecnicas: HabilidadTecnica[];
  blandas: HabilidadBlanda[];
};

export default function HabilidadesJam({
  tecnicas,
  blandas,
}: Props) {
  const [tipo, setTipo] = useState<"tech" | "soft">("tech");

  const getWidth = (nivel?: string | null) => {
    switch (nivel?.toLowerCase()) {
      case "experto":
        return "100%";

      case "avanzado":
        return "80%";

      case "competente":
        return "60%";

      case "intermedio":
        return "40%";

      default:
        return "25%";
    }
  };

  return (
    <section className="bg-white border-4 border-slate-900 rounded-[36px] p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(178,247,239,1)]">

      <div className="flex justify-between items-center border-b pb-4">

        <h2 className="font-black text-xl uppercase">
          Habilidades Jam
        </h2>

        <div className="bg-[#eff7f6] p-1.5 rounded-2xl border-2 border-slate-900 flex gap-2">

          <button
            onClick={() => setTipo("tech")}
            className={`px-4 py-2 rounded-xl text-xs font-black ${
              tipo === "tech"
                ? "bg-[#7bdff2] border-2 border-slate-900"
                : ""
            }`}
          >
            Técnicas
          </button>

          <button
            onClick={() => setTipo("soft")}
            className={`px-4 py-2 rounded-xl text-xs font-black ${
              tipo === "soft"
                ? "bg-[#f7d6e0] border-2 border-slate-900"
                : ""
            }`}
          >
            Blandas
          </button>

        </div>
      </div>

      {tipo === "tech" ? (
        <div className="grid md:grid-cols-3 gap-4 mt-6">

          {tecnicas.map((skill) => (
            <div
              key={skill.id_habilidad}
              className="bg-[#eff7f6] p-4 rounded-3xl border-2 border-slate-900"
            >
              <p className="text-[10px] uppercase text-slate-500 font-bold">
                {skill.tecnologias?.[0]?.categoria || "Tecnología"}
              </p>

              <h3 className="font-black text-sm mt-1">
                {skill.nombre}
              </h3>

              <div className="mt-3">

                <div className="w-full h-2 bg-slate-200 rounded-full border border-slate-900 overflow-hidden">
                  <div
                    className="h-full bg-[#7bdff2]"
                    style={{
                      width: getWidth(skill.nivel),
                    }}
                  />
                </div>

                <span className="text-[10px] font-black uppercase text-cyan-700 mt-1 block">
                  {skill.nivel}
                </span>

              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3 mt-6">

          {blandas.map((skill) => (
            <div
              key={skill.id_habilidad}
              className="bg-white p-4 rounded-2xl border-2 border-slate-900 flex justify-between items-center"
            >
              <span className="font-bold text-sm">
                {skill.nombre}
              </span>

              <span className="bg-[#7bdff2] border border-slate-900 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                {skill.nivel}
              </span>
            </div>
          ))}

        </div>
      )}
    </section>
  );
}