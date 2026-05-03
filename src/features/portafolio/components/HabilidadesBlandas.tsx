import React, { useRef, useEffect, useState } from 'react';
import { Smile, Sparkles } from 'lucide-react';
import type { HabilidadBlanda } from '../types/portafolioType';


interface Props {
  blandas: HabilidadBlanda[];
  onVisible: (id: string) => void;
}

const HabilidadesBlandas: React.FC<Props> = ({ blandas, onVisible  }) => {
  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-10 bg-transparent font-sans">
     
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100 shadow-sm">
          <Smile size={28} className="text-blue-600" strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-3xl font-black tracking-tight text-[#0a1120]">
            Habilidades Blandas
          </h2>
          <div className="h-1.5 w-10 bg-blue-600/30 rounded-full mt-1"></div>
        </div>
      </div>

     
      <div className="flex flex-wrap gap-4 justify-center md:justify-start">
        {blandas.map((habilidad, index) => (
          <PildoraBlanda key={habilidad.id_habilidad} habilidad={habilidad} index={index} onVisible={onVisible} />
        ))}
      </div>
    </div>
  );
};

const PildoraBlanda = ({ habilidad, index, onVisible  }: { habilidad: HabilidadBlanda; index: number; onVisible: (id: string) => void }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {setIsVisible(entry.isIntersecting)
        if (entry.isIntersecting) {
            onVisible(habilidad.id_habilidad)  
            observer.disconnect()              
        }
      },
      { threshold: 0.1 }
    );
    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={domRef}
      data-habilidad-id={habilidad.id_habilidad} 
      style={{ transitionDelay: `${index * 100}ms` }}
      className={`group flex items-center gap-3 px-6 py-4 rounded-full border border-slate-100 bg-white shadow-sm transition-all duration-700 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } hover:border-blue-400 hover:shadow-md hover:-translate-y-1`}
    >
      
      <Sparkles 
        size={16} 
        className="text-blue-500 opacity-40 group-hover:opacity-100 transition-opacity" 
      />
      
      <div className="flex flex-col">
        <span className="text-[14px] font-bold text-[#0a1120] leading-none">
          {habilidad.nombre}
        </span>
        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-blue-600/60 mt-1">
          Nivel {habilidad.nivel}
        </span>
      </div>

      <div className="ml-2 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
    </div>
  );
};

export default HabilidadesBlandas;