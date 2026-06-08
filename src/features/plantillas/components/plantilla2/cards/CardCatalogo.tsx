import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  titulo: string;
  descripcion: string;
  detalle?: string;
  imagen?: ReactNode | string;
  indexLabel?: string;
  onClick?: () => void;
};

export function CardCatalogo({ titulo, descripcion, detalle, imagen, indexLabel, onClick }: Props) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="
        flex items-center
        px-5 py-4
        rounded-2xl
        bg-white/70
        backdrop-blur-xl
        border border-black/8
        shadow-[0_2px_12px_rgba(0,0,0,0.07)]
        cursor-pointer
      "
    >
      <div className="flex-1 min-w-0 flex items-center gap-2 pr-2">
        {indexLabel && (
          <span className="text-xs font-semibold text-gray-400 bg-black/5 px-2 py-0.5 rounded shrink-0">
            {indexLabel}
          </span>
        )}
        <h3 className="font-medium text-gray-900 truncate">{titulo}</h3>
      </div>

      <div className="w-40 flex flex-col items-center justify-center text-center px-2 shrink-0">
        <span className="text-sm text-gray-500 line-clamp-2">{descripcion}</span>
        {detalle && (
          <span className="text-[11px] text-gray-400 mt-1 leading-tight">{detalle}</span>
        )}
      </div>

      <div className="w-16 flex justify-end shrink-0">
        {imagen ? (
          typeof imagen === "string" ? (
            <img src={imagen} alt={titulo} className="w-12 h-12 object-contain rounded-lg" />
          ) : (
            <div className="w-12 h-12 flex items-center justify-center">{imagen}</div>
          )
        ) : (
          <div className="w-12 h-12" />
        )}
      </div>
    </motion.div>
  );
}