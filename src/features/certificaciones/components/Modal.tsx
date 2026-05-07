import type { ReactNode } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function Modal({ isOpen, onClose, children }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* Overlay suave */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Contenido */}
      <div
        className="
          relative z-10
          w-full sm:w-[90%] max-w-4xl
          h-auto
          max-h-[90vh] 
          overflow-y-auto
          bg-white rounded-xl shadow-xl
          p-4 sm:p-6
        "
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="
            absolute top-3 right-3
            text-gray-500 hover:text-gray-800
            text-2xl font-bold
            w-8 h-8 flex items-center justify-center
            bg-white rounded-full
          "
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
}