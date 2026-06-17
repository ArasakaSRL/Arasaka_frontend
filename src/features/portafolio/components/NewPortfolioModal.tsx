import React, { useState } from 'react';
import { X, Eye, Lock } from 'lucide-react';
import type { Portfolio } from '@/features/portafolio/types/portafolioType';

interface NewPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (portfolio: Omit<Portfolio, 'id'>) => void;
}

export const NewPortfolioModal: React.FC<NewPortfolioModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');

  const MAX_NAME = 30;
  const MAX_DESCRIPTION = 300;

  // Permite letras, números y espacios simples
  // No permite símbolos raros ni espacios dobles
  const TITLE_REGEX = /^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/;

  if (!isOpen) return null;

  const resetForm = () => {
    setName('');
    setDescription('');
    setVisibility('public');
    setGithubUrl('');
    setLinkedinUrl('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName || !trimmedDescription) return;

    // mínimo 6 caracteres
    if (trimmedName.length < 6) return;

    // validación de caracteres
    if (!TITLE_REGEX.test(trimmedName)) return;

    if (
      trimmedName.length > MAX_NAME ||
      trimmedDescription.length > MAX_DESCRIPTION
    ) {
      return;
    }

    onCreate({
      name: trimmedName,
      description: trimmedDescription,
      visibility,
      githubUrl,
      linkedinUrl,
      createdAt: new Date().toISOString(),
    });

    resetForm();
    onClose();
  };

  const isNameLimit = name.length >= MAX_NAME;

  const isDescriptionLimit =
    description.length >= MAX_DESCRIPTION;

  const hasInvalidCharacters =
    name.length > 0 && !TITLE_REGEX.test(name);

  const hasMinLengthError =
    name.length > 0 && name.trim().length < 6;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-100">

        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Nuevo Portafolio
            </h2>
          </div>

          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="
            p-5
            space-y-4
            overflow-y-auto
            max-h-[95vh]
            md:max-h-none
          "
        >
          {/* NOMBRE */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-left text-sm font-semibold text-gray-700">
                Nombre del Portafolio
              </label>

              <span
                className={`text-xs font-medium ${
                  isNameLimit
                    ? 'text-red-500'
                    : 'text-gray-400'
                }`}
              >
                {name.length}/{MAX_NAME}
              </span>
            </div>

            <input
              type="text"
              required
              maxLength={MAX_NAME}
              placeholder="Mi Portafolio"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`
                w-full px-3 py-2.5 text-sm
                bg-gray-50 border rounded-xl
                outline-none transition
                ${
                  isNameLimit ||
                  hasInvalidCharacters ||
                  hasMinLengthError
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-gray-200 focus:border-blue-900'
                }
              `}
            />

            {hasMinLengthError && (
              <p className="text-xs text-left text-red-500 mt-1">
                El nombre debe tener mínimo 6 caracteres.
              </p>
            )}

            {hasInvalidCharacters && (
              <p className="text-xs text-left text-red-500 mt-1">
                Solo se permiten letras, números y espacios simples.
              </p>
            )}

            {isNameLimit && (
              <p className="text-xs text-left text-red-500 mt-1">
                Has alcanzado el límite máximo.
              </p>
            )}
          </div>

          {/* DESCRIPCIÓN */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-left text-sm font-semibold text-gray-700">
                Descripción Profesional
              </label>

              <span
                className={`text-xs font-medium ${
                  isDescriptionLimit
                    ? 'text-red-500'
                    : 'text-gray-400'
                }`}
              >
                {description.length}/{MAX_DESCRIPTION}
              </span>
            </div>

            <textarea
              required
              rows={4}
              maxLength={MAX_DESCRIPTION}
              placeholder="Desarrollador Full Stack"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`
                w-full px-3 py-2.5 text-sm
                bg-gray-50 border rounded-xl
                outline-none resize-none transition
                ${
                  isDescriptionLimit
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-gray-200 focus:border-blue-900'
                }
              `}
            />

            {isDescriptionLimit && (
              <p className="text-xs text-left text-red-500 mt-1">
                Has alcanzado el límite máximo.
              </p>
            )}
          </div>

          {/* VISIBILIDAD */}
          <div>
            <label className="block text-left text-sm font-semibold text-gray-700 mb-2">
              Visibilidad
            </label>

            <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setVisibility('public')}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition ${
                  visibility === 'public'
                    ? 'bg-white shadow-sm text-gray-800'
                    : 'text-gray-500'
                }`}
              >
                <Eye size={15} />
                Público
              </button>

              <button
                type="button"
                onClick={() => setVisibility('private')}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition ${
                  visibility === 'private'
                    ? 'bg-white shadow-sm text-gray-800'
                    : 'text-gray-500'
                }`}
              >
                <Lock size={15} />
                Privado
              </button>
            </div>
          </div>

          {/* GITHUB */}
          <div>
            <label className="block text-left text-sm font-semibold text-gray-700 mb-1">
              GitHub
            </label>

            <input
              type="url"
              placeholder="https://github.com/usuario"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-900 transition"
            />
          </div>

          {/* LINKEDIN */}
          <div>
            <label className="block text-left text-sm font-semibold text-gray-700 mb-1">
              LinkedIn
            </label>

            <input
              type="url"
              placeholder="https://linkedin.com/in/usuario"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-900 transition"
            />
          </div>

          {/* BOTONES */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={
                hasInvalidCharacters ||
                hasMinLengthError
              }
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white bg-linear-to-br from-[#0a1a3a] to-[#112e57] hover:opacity-95 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};