import { useState } from "react";

interface BotonEliminarProps {
  count: number;
  onDeleteAll?: () => void;
  onDeselectAll: () => void;
}

export function BotonEliminar({ count, onDeleteAll, onDeselectAll }: BotonEliminarProps) {
  const [hovered, setHovered] = useState(false);

  if (count === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className="relative inline-flex items-center cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          className="flex items-center bg-[#1a1a1a] rounded-full h-[52px] overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          style={{ maxWidth: hovered ? "320px" : "52px" }} 
        >
          {/* Acciones deslizables */}
          <div
            className="flex items-center overflow-hidden whitespace-nowrap transition-all duration-300"
            style={{ width: hovered ? "260px" : 0, opacity: hovered ? 1 : 0 }} 
          >
            <button
              onClick={onDeleteAll}
              className="flex flex-col items-center justify-center px-[22px] h-[52px] gap-1 hover:bg-white/10 transition-colors" // ✅ sin border-r
            >
              <span className="text-green-400 text-base leading-none">✓</span>
              <span className="text-[10px] text-white/70 font-medium tracking-wide">
                Eliminar 
              </span>
            </button>
            <button
              onClick={onDeselectAll}
              className="flex flex-col items-center justify-center px-[22px] h-[52px] gap-1 hover:bg-white/10 transition-colors"
            >
              <span className="text-red-400 text-base leading-none">✕</span>
              <span className="text-[10px] text-white/70 font-medium tracking-wide">
                Desmarcar todo
              </span>
            </button>
          </div>

          {/* Círculo rojo */}
          <div className="w-[52px] h-[52px] min-w-[52px] bg-[#e63946] rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
            </svg>

          <span className="absolute top-0 right-0 text-black text-[11px] font-bold leading-none pointer-events-none">
            {count}
          </span>
          </div>
        </div>
      </div>
    </div>
  );
}