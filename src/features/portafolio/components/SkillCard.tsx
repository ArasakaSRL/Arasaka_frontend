import React, { useState } from 'react';
import type { HabilidadTecnica } from "../types/portafolioType";
import { Terminal } from 'lucide-react';
interface Props {
  habilidades: HabilidadTecnica[];
}

export const SkillsSection = ({ habilidades }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getProgress = (nivel: string | null) => {
    const n = nivel?.toLowerCase() || '';
    if (n.includes('basico')) return { width: '15%', color: 'bg-red-500', label: 'Básico' };
    if (n.includes('medio')) return { width: '35%', color: 'bg-yellow-500', label: 'Medio' };
    if (n.includes('avanzado')) return { width: '75%', color: 'bg-blue-500', label: 'Avanzado' };
    if (n.includes('experto')) return { width: '100%', color: 'bg-green-600', label: 'Experto' };
    return { width: '25%', color: 'bg-slate-400', label: 'Nivel Inicial' };
  };

  const allLogos = habilidades.flatMap(h => h.tecnologias);

  return (
    <div className="w-full flex justify-start px-2">
      <div className="flex flex-col">
       <div className="flex items-center gap-3 self-start">
          <div className="flex items-center gap-2 bg-primary-500 border border-secondary-500 px-4 py-1.5 rounded-xl shadow-lg backdrop-blur-md">
            <Terminal size={14} className="text-light-500" />
            <span className="text-[11px] font-black text-light-500 uppercase tracking-[0.2em]">
              Tecnologias <span className="text-light-500">Habilidades</span>
            </span>
          </div>
          <div className="h-px w-8 bg-[#2C2C2C]"></div>
        </div>

        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            bg-white rounded-4xl transition-all duration-500 cursor-pointer overflow-hidden shadow-2xl
            ${isExpanded 
              ? 'w-112.5 p-2' 
              : 'p-6 hover:bg-white/95 border border-white/10 max-w-fit'}
          `}
        >
          {!isExpanded ? (
           
            <div className="grid grid-cols-5 gap-6 animate-in fade-in zoom-in-95 duration-300">
              {allLogos.slice(0, 15).map((tech, i) => (
                <img 
                  key={i} 
                  src={tech.logo} 
                  alt={tech.nombre} 
                  className="w-12 h-12 object-contain transition-transform hover:scale-110"
                />
              ))}
            </div>
          ) : (
           
            <div 
              className="
                flex flex-col gap-6 p-6
                /* max-h-95 equivale aproximadamente a 3.5 - 4 elementos */ overflow-y-auto 
                animate-in fade-in slide-in-from-left-3 duration-500
                scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent
                hover:scrollbar-thumb-blue-400
              "
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#e5e7eb transparent'
              }}
            >
              {habilidades.map((hab) => {
                const { width, color, label } = getProgress(hab.nivel);
                const mainTech = hab.tecnologias[0];

                return (
                  <div key={hab.id_habilidad} className="flex flex-col gap-3 group">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={mainTech?.logo} 
                          alt="" 
                          className="w-10 h-10 object-contain" 
                        />
                        <div className="flex flex-col">
                          <span className="font-black text-gray-800 text-sm tracking-tight leading-none uppercase">
                            {mainTech?.nombre || hab.nombre}
                          </span>
                          <span className="text-[9px] text-gray-400 font-bold uppercase mt-1 tracking-widest">
                            {mainTech?.categoria}
                          </span>
                        </div>
                      </div>
                      
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">
                        {label}
                      </span>
                    </div>

                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${color} transition-all duration-1000 ease-out`}
                        style={{ width: width }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};