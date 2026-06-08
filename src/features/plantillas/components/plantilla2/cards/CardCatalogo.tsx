import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  izquierda: ReactNode;
  centro: ReactNode;
  derecha: ReactNode;
  onClick?: () => void;
};

export function CardCatalogo({ izquierda,derecha,centro, onClick }: Props) {
  return (
   <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="
        grid
        grid-cols-[1fr_2fr_1fr]
        items-center
        gap-4
        px-5 py-4
        rounded-2xl
        bg-white/70
        backdrop-blur-xl
        border border-black/8
        shadow-[0_2px_12px_rgba(0,0,0,0.07)]
        cursor-pointer
      "
    >
      <div className="min-w-0 text-left">
        {izquierda}
      </div>

      <div className="min-w-0 text-center">
        {centro}
      </div>

      <div className="min-w-0 flex justify-end">
        {derecha}
      </div>
    </motion.div>
  );
}