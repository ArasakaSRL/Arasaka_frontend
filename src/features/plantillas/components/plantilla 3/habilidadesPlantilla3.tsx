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

  const getLevelStyles = (nivel?: string | null) => {
    switch (nivel?.toLowerCase()) {
      case "experto":
        return {
          bg: "bg-[#7bdff2]",
          text: "text-cyan-700",
        };

      case "avanzado":
        return {
          bg: "bg-[#b2f7ef]",
          text: "text-emerald-700",
        };

      case "competente":
        return {
          bg: "bg-[#f2b5d4]",
          text: "text-pink-700",
        };

      case "intermedio":
        return {
          bg: "bg-[#f7d6e0]",
          text: "text-purple-700",
        };

      default:
        return {
          bg: "bg-slate-300",
          text: "text-slate-600",
        };
    }
  };

  return (
    <section className="bg-white border-4 border-slate-900 rounded-[36px] p-6 md:p-8 shadow-[14px_14px_0px_0px_rgba(178,247,239,1)]  space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#f2b5d4] border-2 border-slate-900 flex items-center justify-center font-black">
            ★
          </div>
          <h2 className="font-black text-xl uppercase tracking-tight">
            Habilidades
          </h2>
        </div>
        <div className="bg-[#eff7f6] p-1.5 rounded-2xl border-2 border-slate-900 flex gap-2">
          <button
            onClick={() => setTipo("tech")}
            className={`
              px-4 py-2 rounded-xl text-xs font-black uppercase transition-all
              ${
                tipo === "tech"
                  ? "bg-[#7bdff2] border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
                  : "text-slate-500 hover:text-slate-900"
              }
            `}
          >
            🛠 Técnicas
          </button>
          <button
            onClick={() => setTipo("soft")}
            className={`
              px-4 py-2 rounded-xl text-xs font-black uppercase transition-all
              ${
                tipo === "soft"
                  ? "bg-[#f7d6e0] border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
                  : "text-slate-500 hover:text-slate-900"
              }
            `}
          >
            ✨ Blandas
          </button>
        </div>
      </div>
      {tipo === "tech" ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {tecnicas.map((skill) => {
            const styles = getLevelStyles(skill.nivel);
            return (
              <div
                key={skill.id_habilidad}
                className=" group bg-[#eff7f6] p-4 rounded-3xl border-2 border-slate-900 hover:bg-white hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-all duration-300 "
              >

                <div className="flex items-center gap-3">
                  <div className=" w-12 h-12 rounded-full bg-[#c2e0e6] border-2 border-slate-900 flex items-center justify-center shrink-0 overflow-hidden ">
                    {skill.tecnologias?.[0]?.logo ? (
                      <img
                        src={skill.tecnologias[0].logo}
                        alt={skill.nombre ?? ""}
                        className="w-7 h-7 object-contain"
                      />
                    ) : (
                      <span className="font-black text-xs">
                        UI
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-sm text-slate-900 truncate">
                      {skill.nombre}
                    </h4>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden border border-slate-900">
                    <div
                      className={`h-full rounded-full ${styles.bg}`}
                      style={{
                        width: getWidth(skill.nivel),
                      }}
                    />

                  </div>
                  <span
                    className={`text-[10px] font-black uppercase mt-1 block ${styles.text}`}
                  >
                    {skill.nivel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {blandas.map((skill) => {
            const styles = getLevelStyles(skill.nivel);
            return (
              <div
                key={skill.id_habilidad}
                className=" bg-white p-3.5 rounded-2xl border-2 border-slate-900 flex items-center justify-between hover:shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-all duration-300 "
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className=" w-3.5 h-3.5 rounded-full bg-[#f2b5d4] border border-slate-900 "
                  />
                  <span className="font-bold text-xs text-slate-900">
                    {skill.nombre}
                  </span>
                </div>
                <span
                  className={` px-3 py-1 rounded-full border border-slate-900 text-[10px] font-black uppercase shadow-[1.5px_1.5px_0px_0px_rgba(15,23,42,1)]
                    ${styles.bg}
                  `}
                >
                  {skill.nivel}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}