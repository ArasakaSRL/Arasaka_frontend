import React, { useRef, useEffect, useState } from 'react';
import { GraduationCap } from 'lucide-react';

interface Experiencia {
  id_experiencia: string;
  cargo: string;
  Nombre_empresa: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string | null;
}

interface Props {
  experiencias: Experiencia[];
}

const ExperienceTimeline: React.FC<Props> = ({ experiencias }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-10 bg-transparent font-sans">
  
      <div className="flex items-center gap-4 mb-16">
        <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100 shadow-sm">
          <GraduationCap size={28} className="text-blue-600" strokeWidth={2.5} />
        </div>
        <h2 className="text-3xl font-bold tracking-tight" style={{ color: '#0F1A45' }}>
          Experiencia
        </h2>
      </div>

   
      <div className="relative border-l-2 ml-4 md:ml-6" style={{ borderColor: '#E5E5E5' }}>
        {experiencias.map((exp) => (
          <TimelineItem key={exp.id_experiencia} exp={exp} formatDate={formatDate} />
        ))}
      </div>
    </div>
  );
};

const TimelineItem = ({ exp, formatDate }: { exp: Experiencia, formatDate: (s: string) => string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { 
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, []);

  return (
    <div
      ref={domRef}
      data-experiencia-id={exp.id_experiencia}
      className={`mb-12 ml-10 transition-all duration-1000 ease-in-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
   
      <div 
        className="absolute w-4 h-4 rounded-full -left-12.25 top-1.5 border-4 border-white shadow-sm"
        style={{ backgroundColor: '#0F1A45' }} 
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8">
    
        <div className="md:col-span-4">
          <h3 className="text-lg font-bold leading-snug mb-0.5" style={{ color: '#0F1A45' }}>
            {exp.cargo}
          </h3>
          <p className="text-sm font-semibold mb-2" style={{ color: '#1A334F' }}>
            {exp.Nombre_empresa}
          </p>
          <span 
            className="text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-widest"
            style={{ backgroundColor: '#F0F0F0', color: '#1A334F' }}
          >
            {formatDate(exp.fecha_inicio)} — {exp.fecha_fin ? formatDate(exp.fecha_fin) : 'Actualidad'}
          </span>
        </div>

        <div className="md:col-span-8">
          <p className="text-gray-500 leading-relaxed text-justify text-[13px] md:text-sm">
            {exp.descripcion}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExperienceTimeline;