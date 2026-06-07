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

export function CardCatalogo({
  titulo,
  descripcion,
  detalle,
  imagen,
  indexLabel,
  onClick,
}: Props) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="
        flex items-center
        px-5 py-4
        rounded-2xl
        bg-white/5
        backdrop-blur-2xl
        border border-white/10
        shadow-[0_8px_32px_rgba(0,0,0,0.2)]
        cursor-pointer
      "
    >
      {/* 1. Izquierda: Título (y número de index si existe) */}
      <div className="flex-1 min-w-0 flex items-center gap-2 pr-2">
        {indexLabel && (
          <span className="text-xs font-bold text-black/60 bg-black/10 px-2 py-0.5 rounded shrink-0">
            {indexLabel}
          </span>
        )}
        <h3 className="font-medium text-black truncate">
          {titulo}
        </h3>
      </div>

      {/* 2. Centro: Descripción (y Detalle debajo si existe) */}
      <div className="w-40 flex flex-col items-center justify-center text-center px-2 shrink-0">
        <span className="text-sm text-black/60 line-clamp-2">
          {descripcion}
        </span>
        {detalle && (
          <span className="text-[11px] font-medium text-black/40 mt-1 leading-tight">
            {detalle}
          </span>
        )}
      </div>

      {/* 3. Derecha: Imagen o Ícono */}
      <div className="w-24 flex justify-end shrink-0">
        {imagen ? (
          typeof imagen === "string" ? (
            <img
              src={imagen}
              alt={titulo}
              className="w-16 h-16 object-contain"
            />
          ) : (
            <div className="w-16 h-16 flex items-center justify-center">
              {imagen}
            </div>
          )
        ) : (
          // Espaciador invisible para que la tarjeta no pierda su forma si no hay imagen
          <div className="w-16 h-16" />
        )}
      </div>
    </motion.div>
  );
}