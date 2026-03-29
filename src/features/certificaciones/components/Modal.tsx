import type { ReactNode } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function Modal({ isOpen, onClose, children }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      <div
        className="
          absolute inset-0 
          bg-black/50 backdrop-blur-sm
        "
        onClick={onClose}
      />

      <div
        className="
          relative z-10
          w-[90%] max-w-lg
          bg-white rounded-xl shadow-xl
          p-6
          animate-fadeIn
        "
      >
        {children}
      </div>
    </div>
  );
}