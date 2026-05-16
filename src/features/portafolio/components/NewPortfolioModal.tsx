import React, { useState } from 'react';
import { X, Eye, Lock } from 'lucide-react';
import type { Portfolio } from '@/features/portafolio/types/portafolioType';

interface NewPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (portfolio: Omit<Portfolio, 'id'>) => void;
}

export const NewPortfolioModal: React.FC<NewPortfolioModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) return;
    
    onCreate({ name, description, visibility, githubUrl, linkedinUrl, createdAt: new Date().toISOString() });
    
    setName('');
    setDescription('');
    setVisibility('public');
    setGithubUrl('');
    setLinkedinUrl('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Nuevo Portafolio</h2>
            <p className="text-sm text-gray-400 mt-0.5">Completa tu información profesional</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Cuerpo */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Nombre del Portafolio <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Portafolio juanito"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-300 focus:outline-none focus:border-blue-900 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Descripción Profesional <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Desarrollador Laravel"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-300 focus:outline-none focus:border-blue-900 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Visibilidad</label>
            <div className="grid grid-cols-2 gap-3 p-1 bg-gray-100 rounded-xl">
              <button
                type="button"
                onClick={() => setVisibility('public')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  visibility === 'public' ? 'bg-white text-gray-800 shadow-xs' : 'text-gray-500'
                }`}
              >
                <Eye size={16} /> Público
              </button>
              <button
                type="button"
                onClick={() => setVisibility('private')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  visibility === 'private' ? 'bg-white text-gray-800 shadow-xs' : 'text-gray-500'
                }`}
              >
                <Lock size={16} /> Privado
              </button>
            </div>
          </div>

          <div className="space-y-3.5">
            <label className="block text-sm font-semibold text-gray-700">Redes Profesionales</label>
            <div className="space-y-1">
              <span className="text-xs font-medium text-gray-400">GitHub</span>
              <input
                type="url"
                placeholder="https://github.com/username"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-300 focus:outline-none focus:border-blue-900 transition-colors"
              />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-gray-400">LinkedIn</span>
              <input
                type="url"
                placeholder="https://linkedin.com/username"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-300 focus:outline-none focus:border-blue-900 transition-colors"
              />
            </div>
          </div>

          {/* Footer con el Gradiente solicitado */}
          <div className="pt-4 border-t border-gray-100 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium rounded-xl transition-colors text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-linear-to-br from-[#0a1a3a] to-[#112e57] text-white font-medium rounded-xl transition-opacity hover:opacity-95 text-sm shadow-md flex items-center justify-center gap-1.5"
            >
              Crear Portafolio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};