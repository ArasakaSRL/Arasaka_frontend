import React, { useRef, useEffect, useState } from 'react';
import { Layers3, X } from 'lucide-react';
import type { HabilidadTecnica } from '../types/portafolioType';

interface Props {
  tecnicas: HabilidadTecnica[];
  onExpandir?:   (id: string) => void
  onCerrar?:     (id: string) => void
  mostrarTitulo?: boolean;
}

const HabilidadesTecnicas: React.FC<Props> = ({ tecnicas, onExpandir, onCerrar ,mostrarTitulo = true,}) => {
  const todasLasTecnologias = tecnicas.flatMap(grupo => 
    grupo.tecnologias.map(tech => ({ ...tech, nivelPadre: grupo.nivel, id_habilidad: grupo.id_habilidad }))
  );

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-10 bg-transparent font-sans relative">
      {mostrarTitulo && (
      <div className="flex items-center gap-4 mb-12">
        <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100 shadow-sm">
          <Layers3
            size={28}
            className="text-blue-600"
            strokeWidth={2.5}
          />
        </div>

        <div>
          <h2 className="text-3xl font-black tracking-tight text-[#0a1120]">
            Habilidades Técnicas
          </h2>

          <div className="h-1.5 w-10 bg-blue-600/30 rounded-full mt-1" />
        </div>
      </div>
    )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {todasLasTecnologias.map((tech, index) => (
          <TarjetaInteractiva key={`${tech.nombre}-${index}`} tech={tech} onExpandir={onExpandir} onCerrar={onCerrar}  />
        ))}
      </div>
    </div>
  );
};

const TarjetaInteractiva = ({ tech, onExpandir, onCerrar }: { tech: any; onExpandir?: (id: string) => void; onCerrar?:   (id: string) => void}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  function handleClic() {
    const nuevoEstado = !isExpanded
    setIsExpanded(nuevoEstado)

    if (nuevoEstado) {
      onExpandir?.(tech.id_habilidad)  
    } else {
      onCerrar?.(tech.id_habilidad)   
    }
  }
  const porcentajeNivel = (nivel: string) => {
    const n = nivel?.toLowerCase();
    if (n?.includes('avanzado') || n?.includes('experto')) return '90%';
    if (n?.includes('intermedio')) return '65%';
    if (n?.includes('basico') || n?.includes('principiante')) return '35%';
    return '50%';
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={domRef}
      data-track="clic_general"
      onClick={handleClic}
      className={`group relative h-48 cursor-pointer transition-all duration-700 transform ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
      }`}
    >
  
      <div className={`absolute inset-0 flex items-center justify-center rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-500 z-10 ${
        isExpanded ? 'opacity-0 pointer-events-none rotate-y-180' : 'opacity-100'
      } hover:border-blue-400 hover:shadow-xl hover:-translate-y-2`}>
        <img
          src={tech.logo}
          alt={tech.nombre}
          className="w-20 h-20 md:w-24 md:h-24 object-contain transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className={`absolute inset-0 p-6 flex flex-col justify-center rounded-2xl border-2 border-blue-500 bg-white shadow-2xl transition-all duration-500 z-20 ${
        isExpanded ? 'opacity-100 scale-105' : 'opacity-0 pointer-events-none scale-95'
      }`}>
        <button className="absolute top-4 right-4 text-slate-400 hover:text-blue-600">
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-2">
           <img src={tech.logo} className="w-6 h-6 object-contain" alt="" />
           <span className="font-bold text-[#0a1120] text-sm">{tech.nombre}</span>
        </div>

        <p className="text-[10px] text-slate-500 leading-tight mb-4 line-clamp-2">
          {tech.description || "Desarrollo y optimización con tecnologías modernas."}
        </p>

       
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">
              {tech.nivelPadre}
            </span>
            <span className="text-[10px] font-bold text-slate-400">
              {porcentajeNivel(tech.nivelPadre)}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: isExpanded ? porcentajeNivel(tech.nivelPadre) : '0%' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabilidadesTecnicas;