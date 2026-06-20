import React, { useState, useEffect } from 'react';
import { X, Edit3, Save, Loader2 } from 'lucide-react';
// Importamos tus nuevas funciones basadas en tu apiClient de Axios
import { obtenerRedesProfesionales, guardarRedesProfesionales } from '../lib/portfolioSocialService'; 

interface SocialModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioId: string;
  portfolioName: string;
}

export const SocialModal: React.FC<SocialModalProps> = ({ isOpen, onClose, portfolioId, portfolioName }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [inputLinkedin, setInputLinkedin] = useState('');
  const [inputGithub, setInputGithub] = useState('');


  useEffect(() => {
    if (isOpen && portfolioId) {
      const fetchSocialData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const data = await obtenerRedesProfesionales(portfolioId);
          

          const linkedinData = data.find(red => red.nombre.toLowerCase() === 'linkedin');
          const githubData = data.find(red => red.nombre.toLowerCase() === 'github');

          setInputLinkedin(linkedinData ? linkedinData.url : '');
          setInputGithub(githubData ? githubData.url : '');
        } catch (err: any) {
          setError(err.response?.data?.message || 'No se pudieron cargar las redes profesionales.');
        } finally {
          setIsLoading(false);
        }
      };

      fetchSocialData();
    }
  }, [isOpen, portfolioId]);

  if (!isOpen) return null;


  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    const payload = {
      redes: [
        { nombre: 'LinkedIn', url: inputLinkedin.trim() },
        { nombre: 'GitHub', url: inputGithub.trim() }
      ]
    };

    try {
      await guardarRedesProfesionales(portfolioId, payload);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar los cambios en el servidor.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl border border-gray-100 relative animate-in fade-in zoom-in-95 duration-150">
        
        <button 
          onClick={() => { onClose(); setIsEditing(false); }}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          disabled={isSaving}
        >
          <X size={18} />
        </button>
        
        <div className="flex items-center justify-between mb-1 pr-6">
          <h4 className="text-base font-bold text-gray-800">Redes Profesionales</h4>
          {!isLoading && !error && (
            <>
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 px-2 py-1 rounded-md transition-colors cursor-pointer"
                >
                  <Edit3 size={10} /> Editar
                </button>
              ) : (
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-md transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={10} className="animate-spin" /> : <Save size={10} />}
                  Guardar
                </button>
              )}
            </>
          )}
        </div>
        <p className="text-xs text-gray-400 mb-4 font-normal">Portafolio: {portfolioName}</p>
        
        {error && (
          <div className="text-xs text-red-600 bg-red-50 border border-red-100 p-2.5 rounded-xl mb-4">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2 text-gray-400">
            <Loader2 size={24} className="animate-spin text-purple-600" />
            <span className="text-xs">Cargando redes...</span>
          </div>
        ) : (
          <div className="space-y-4">

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linkedin/linkedin-original.svg" alt="LinkedIn" className="w-3.5 h-3.5" />
                LinkedIn URL
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={inputLinkedin}
                  onChange={(e) => setInputLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/tu-usuario"
                  disabled={isSaving}
                  className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:outline-hidden focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all bg-gray-50/30 disabled:opacity-60"
                />
              ) : inputLinkedin ? (
                <a
                  href={inputLinkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full p-2.5 bg-blue-50/40 hover:bg-blue-50 border border-blue-100/70 rounded-xl text-xs font-medium text-blue-700 transition-colors"
                >
                  <span className="truncate max-w-60">{inputLinkedin}</span>
                  <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded-md shrink-0">Ir</span>
                </a>
              ) : (
                <div className="text-[11px] text-gray-400 italic p-2.5 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  No configurado
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" alt="GitHub" className="w-3.5 h-3.5" />
                GitHub URL
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={inputGithub}
                  onChange={(e) => setInputGithub(e.target.value)}
                  placeholder="https://github.com/tu-usuario"
                  disabled={isSaving}
                  className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:outline-hidden focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all bg-gray-50/30 disabled:opacity-60"
                />
              ) : inputGithub ? (
                <a
                  href={inputGithub}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full p-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 transition-colors"
                >
                  <span className="truncate max-w-60">{inputGithub}</span>
                  <span className="text-[10px] bg-gray-900 text-white px-1.5 py-0.5 rounded-md shrink-0">Ir</span>
                </a>
              ) : (
                <div className="text-[11px] text-gray-400 italic p-2.5 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  No configurado
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};