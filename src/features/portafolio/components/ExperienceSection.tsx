import React from 'react';
import { Briefcase } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type  { experiencias } from '../types/portafolioType';

interface Props {
  experiencias: experiencias[];
}

export const ExperienceSection = ({ experiencias }: Props) => {
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM yyyy", { locale: es });
  };

  const getDay = (dateString: string) => new Date(dateString).getDate();
  const getDayName = (dateString: string) => format(new Date(dateString), "EEE", { locale: es }).toUpperCase().replace('.', '');

  return (
    <div className="flex flex-col gap-3 w-full max-w-137.5">
      
   
      <div className="flex items-center gap-3 self-start">
        <div className="flex items-center gap-2 bg-primary-500 border border-secondary-500 px-4 py-1.5 rounded-xl shadow-lg">
          <Briefcase size={14} className="text-white" />
          <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">
            Timeline <span className="text-[#D3191C]">Experience</span>
          </span>
        </div>
      </div>


      <div className="bg-white rounded-4xl p-8 shadow-xl border border-gray-100">
        <div className="flex flex-col gap-8">
          {experiencias.map((exp, index) => (
            <div key={exp.id_experiencia} className="group">
              <div className="flex items-start gap-6">
                

                <div className="flex flex-col items-center min-w-18.75">
                  <div className={`
                    px-2 py-0.5 rounded text-[10px] font-black text-white mb-1 w-full text-center tracking-tighter
                    ${index === 0 ? 'bg-[#D3191C]' : 'bg-primary-500'}
                  `}>
                    {getDayName(exp.fecha_inicio)}
                  </div>
                  <span className="text-3xl font-black text-[#2C2C2C] leading-none">
                    {getDay(exp.fecha_inicio)}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 mt-1 capitalize text-center leading-none">
                    {formatDate(exp.fecha_inicio)}
                  </span>
                </div>


                <div className={`w-0.5 self-stretch rounded-full opacity-30 ${index === 0 ? 'bg-[#D3191C]' : 'bg-primary-500'}`}></div>


                <div className="flex flex-col gap-2 flex-1 pt-1">
                  

                  <div className="flex items-baseline gap-2">
                    <span className="text-[10px] font-black text-secondary-500 uppercase min-w-20">
                      Cargo:
                    </span>
                    <span className="text-[13px] font-bold text-[#2C2C2C] uppercase tracking-tight">
                      {exp.cargo}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-[10px] font-black text-secondary-500 uppercase min-w-20">
                      Organización:
                    </span>
                    <span className="text-xs font-semibold text-gray-600">
                      {exp.Nombre_empresa}
                    </span>
                  </div>


                  <div className="flex items-baseline gap-2">
                    <span className="text-[10px] font-black text-secondary-500 uppercase min-w-20">
                      Descripción:
                    </span>
                    <p className="text-[11px] text-gray-500 leading-relaxed italic">
                      {exp.descripcion}
                    </p>
                  </div>

                </div>
              </div>

              {index !== experiencias.length - 1 && (
                <div className="h-px w-full bg-gray-50 mt-8"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};