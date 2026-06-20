import React, { useState } from 'react';
import { Eye, Lock, Calendar, Settings, CheckCircle2, ShieldOff, Share2 } from 'lucide-react';
import type { Portfolio } from '@/features/portafolio/types/portafolioType';
import { SocialModal } from './SocialModal'; 

interface PortfolioCardProps {
  portfolio: Portfolio;
  viewMode: 'grid' | 'list';
  onManage?: (id: string) => void;
  isActive?: boolean;
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({ portfolio, viewMode, onManage, isActive }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isList = viewMode === 'list';

  if (isList) {
    /* ================= VISTA LISTA: TODO EN UNA SOLA LÍNEA HORIZONTAL ================= */
    return (
      <>
        <div className={`bg-white border rounded-xl p-4 transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-4 w-full ${isActive ? 'border-blue-400 shadow-[0_0_0_2px_rgba(59,130,246,0.15)]' : 'border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.01)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.03)]'}`}>
          
          {/* Bloque Izquierdo: Estado + Título + Descripción */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1 min-w-0">
            {/* 1. Visibilidad + Suspendido */}
            <div className="shrink-0 w-24 flex flex-col gap-1">
              {portfolio.visibility === 'public' ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium text-emerald-600 bg-emerald-50 rounded-full border border-emerald-100">
                  <Eye size={12} /> Público
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium text-gray-500 bg-gray-50 rounded-full border border-gray-200">
                  <Lock size={12} /> Privado
                </span>
              )}
              {portfolio.suspendido && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-red-600 bg-red-50 border border-red-200 rounded-full">
                  <ShieldOff size={10} /> Suspendido
                </span>
              )}
            </div>

           
            <div className="flex items-center gap-2 min-w-0 shrink-0">
              <h3 className="text-base font-bold text-gray-800 capitalize truncate max-w-40">
                {portfolio.name}
              </h3>
              {isActive && (
                <>
                  <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-full">
                    <CheckCircle2 size={10} /> Activo
                  </span>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-purple-600 bg-purple-50 border border-purple-200 hover:bg-purple-100 rounded-full transition-colors cursor-pointer"
                  >
                    <Share2 size={10} /> Redes Profesionales
                  </button>
                </>
              )}
            </div>

            
            <p className="text-sm text-gray-400 font-normal truncate flex-1">
              {portfolio.description}
            </p>

           
            <div className="flex items-center gap-1 text-xs text-gray-400 shrink-0 md:w-32">
              <Calendar size={12} />
              <span>{portfolio.createdAt}</span>
            </div>
          </div>

        
          <div className="flex items-center gap-3 shrink-0 self-end lg:self-auto w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0">
            <div className="flex gap-2">
              {portfolio.githubUrl && (
                <a
                  href={portfolio.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200/60 rounded-lg text-xs font-medium text-gray-600 transition-colors flex items-center gap-1"
                >
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" alt="GitHub" className="w-3.5 h-3.5" />
                  GitHub
                </a>
              )}
              {portfolio.linkedinUrl && (
                <a
                  href={portfolio.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200/60 rounded-lg text-xs font-medium text-gray-600 transition-colors flex items-center gap-1"
                >
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linkedin/linkedin-original.svg" alt="LinkedIn" className="w-3.5 h-3.5" />
                  LinkedIn
                </a>
              )}
            </div>

            <button
              onClick={() => onManage?.(portfolio.id)}
              className="flex items-center gap-1 px-3 py-1.5 bg-linear-to-br from-[#0a1a3a] to-[#112e57] text-white text-xs font-semibold rounded-lg transition-opacity hover:opacity-95 shadow-xs cursor-pointer"
            >
              <Settings size={12} />
              Gestionar
            </button>
          </div>
        </div>

        {/* Modal de Redes Profesionales */}
        <SocialModal 
isOpen={isModalOpen} 
  onClose={() => setIsModalOpen(false)} 
  portfolioId={portfolio.id}
  portfolioName={portfolio.name}
        />
      </>
    );
  }

  /* ================= VISTA CUADRÍCULA: COMPACTA Y DELGADA ================= */
  return (
    <>
      <div className={`bg-white border rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between h-full w-full max-w-77.5 mx-auto ${isActive ? 'border-blue-400 shadow-[0_0_0_2px_rgba(59,130,246,0.15)]' : 'border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_4px_25px_rgba(0,0,0,0.04)]'}`}>
        <div>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5 flex-wrap">
              {portfolio.visibility === 'public' ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium text-emerald-600 bg-emerald-50 rounded-full border border-emerald-100">
                  <Eye size={12} /> Público
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium text-gray-500 bg-gray-50 rounded-full border border-gray-200">
                  <Lock size={12} /> Privado
                </span>
              )}
              {portfolio.suspendido && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-red-600 bg-red-50 border border-red-200 rounded-full">
                  <ShieldOff size={10} /> Suspendido
                </span>
              )}
            </div>

            <span className="text-[11px] text-gray-400 flex items-center gap-1 shrink-0">
              <Calendar size={10} /> {portfolio.createdAt}
            </span>
          </div>

          {/* Fila del título y botón en grid (Condicionado a isActive) */}
          <div className="flex items-center flex-wrap gap-2 mb-1">
            <h3 className="text-lg font-bold text-gray-800 capitalize truncate max-w-36">
              {portfolio.name}
            </h3>
            {isActive && (
              <div className="flex flex-wrap gap-1 items-center">
                <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-full">
                  <CheckCircle2 size={10} /> Activo
                </span>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-purple-600 bg-purple-50 border border-purple-200 hover:bg-purple-100 rounded-full transition-colors cursor-pointer"
                >
                  <Share2 size={10} /> Redes
                </button>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-400 leading-relaxed font-normal mb-6 line-clamp-3">
            {portfolio.description}
          </p>
        </div>

        <div className="space-y-2 mt-auto">
          <div className="flex gap-2">
            {portfolio.githubUrl && (
              <a
                href={portfolio.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200/60 rounded-xl text-xs font-medium text-gray-600 transition-colors flex items-center gap-1"
              >
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" alt="GitHub" className="w-3.5 h-3.5" />
                GitHub
              </a>
            )}
            {portfolio.linkedinUrl && (
              <a
                href={portfolio.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200/60 rounded-xl text-xs font-medium text-gray-600 transition-colors flex items-center gap-1"
              >
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linkedin/linkedin-original.svg" alt="LinkedIn" className="w-3.5 h-3.5" />
                LinkedIn
              </a>
            )}
          </div>

          <button
            onClick={() => onManage?.(portfolio.id)}
            className="w-full py-2 bg-linear-to-br from-[#0a1a3a] to-[#112e57] text-white text-xs font-semibold rounded-xl transition-opacity hover:opacity-95 shadow-xs flex items-center justify-center gap-1 cursor-pointer"
          >
            <Settings size={12} /> Gestionar portafolio
          </button>
        </div>
      </div>


      <SocialModal 
         isOpen={isModalOpen} 
         onClose={() => setIsModalOpen(false)} 
         portfolioId={portfolio.id}
         portfolioName={portfolio.name}
      />
    </>
  );
};