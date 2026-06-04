import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Calendar, Building2, X, ZoomIn, ChevronLeft, ChevronRight ,GraduationCap} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { certificaciones } from '../types/portafolioType';

interface Props {
  certificaciones: certificaciones[];
  mostrarTitulo?: boolean;
}

export const CertificacionesSection = ({ certificaciones,mostrarTitulo = true, }: Props) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const selectedCert = certificaciones.find(c => c.id_certificacion === selectedId);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div data-track="clic_general" className="w-full max-w-5xl mx-auto p-4 md:p-12 font-sans bg-transparent">

      {mostrarTitulo && (
      <div className="flex flex-col mb-16 px-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100 shadow-sm">
              <GraduationCap
                size={28}
                className="text-blue-600"
                strokeWidth={2.5}
              />
            </div>

            <div>
              <h2 className="text-3xl font-black tracking-tight text-[#0a1120]">
                Certificaciones
              </h2>

              <div className="h-1.5 w-10 bg-blue-600/30 rounded-full mt-1" />
            </div>
          </div>

          {certificaciones.length > 3 && (
            <div className="hidden md:flex items-center gap-4 text-sm font-bold text-[#0a1120]/40 uppercase tracking-widest">
              <button
                onClick={() => scroll("left")}
                className="flex items-center gap-1 hover:text-blue-600 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>

              <span className="text-slate-200">|</span>

              <button
                onClick={() => scroll("right")}
                className="flex items-center gap-1 hover:text-blue-600 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    )}


      <div className="relative group/container">
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-8 px-2 pb-10 snap-x snap-mandatory no-scrollbar"
        >
          {certificaciones.map((cert) => (
            <motion.div 
              key={cert.id_certificacion}
              data-cert-id={cert.id_certificacion}     
              data-cert-action="clic_abrir_modal"       
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="flex-none w-75 md:w-[calc(33.333%-1.35rem)] snap-start"
              onClick={() => setSelectedId(cert.id_certificacion)}
            >
              <div className="group relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-slate-50 border border-slate-200 shadow-sm transition-all duration-300 hover:border-blue-300 cursor-pointer">
                

                <div className="absolute inset-0 p-4">
                  <motion.img 
                    layoutId={`img-${cert.id_certificacion}`}
                    src={cert.url_certificado?.toString()} 
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>


                <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/5 transition-colors duration-300 flex items-center justify-center">
                   <div className="opacity-0 group-hover:opacity-100 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-xl transition-all translate-y-2 group-hover:translate-y-0">
                      <ZoomIn className="text-blue-600" size={20} />
                   </div>
                </div>
              </div>
              <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center px-2 truncate">
                {cert.titulo}
              </p>
            </motion.div>
          ))}
        </div>
      </div>


      <AnimatePresence>
        {selectedId && selectedCert && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="absolute inset-0 bg-[#0a1120]/95 backdrop-blur-md"
            />
            <motion.div 
              layoutId={`img-${selectedId}`}
              className="relative max-w-5xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              <div className="flex-[1.4] bg-slate-50 flex items-center justify-center p-6 md:p-10 border-r border-slate-100">
                <img 
                  src={selectedCert.url_certificado?.toString()} 
                  className="w-full h-auto max-h-[60vh] md:max-h-[75vh] object-contain shadow-2xl rounded-sm" 
                  alt={selectedCert.titulo} 
                />
              </div>

              <div className="flex-1 p-8 md:p-12 flex flex-col justify-between bg-white">
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100">
                      {selectedCert.categoria}
                    </span>
                    <button data-cert-id={selectedId} data-cert-action="clic_cerrar_modal" onClick={() => setSelectedId(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-all">
                      <X size={20} />
                    </button>
                  </div>

                  <h3 className="text-3xl font-black text-[#0a1120] uppercase italic tracking-tighter leading-[0.9]">
                    {selectedCert.titulo}
                  </h3>

                  <div className="space-y-4 pt-2">
                    <div className="flex items-center gap-3 text-slate-600">
                      <div className="p-2 bg-slate-100 rounded-lg text-blue-600">
                        <Building2 size={16} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-tight">{selectedCert.institucion}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 text-[11px] font-bold uppercase tracking-[0.15em]">
                      <Calendar size={16} />
                      {format(new Date(selectedCert.fecha_emision), "dd MMMM yyyy", { locale: es })}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100">
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                      {selectedCert.descripcion}
                    </p>
                  </div>
                </div>

                <a 
                  data-cert-id={selectedCert.id_certificacion} 
                  data-cert-action="clic_ver_credencial"  
                  href={ selectedCert.url_certificado || undefined } target="_blank" rel="noopener noreferrer"
                  className="mt-10 flex items-center justify-center gap-3 w-full py-4 bg-[#0a1120] text-white font-black uppercase text-xs rounded-2xl hover:bg-blue-700 transition-all shadow-xl active:scale-95"
                >
                  Ver Credencial Original <ExternalLink size={16} />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};