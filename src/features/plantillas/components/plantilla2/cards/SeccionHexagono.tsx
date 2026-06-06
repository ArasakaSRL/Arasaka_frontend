import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import Hexagono from "@/features/plantillas/components/plantilla2/Hexagono";
import type { HexagonoVariant } from "@/features/plantillas/components/plantilla2/Hexagono";


interface SeccionHexagonoProps {
  title: string;
  icon?: LucideIcon;
  variant: HexagonoVariant;
  size?: number;
  children?: React.ReactNode;
}

export default function SeccionHexagono({
  title,
  icon: Icon,
  variant,
  size = 220,
  children,
}: SeccionHexagonoProps) {
  return (
    <motion.div
      whileHover={{
        scale: 1.08,
      }}
      animate={{
        y: [0, -8, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="cursor-pointer"
    >
      <Hexagono
        variant={variant}
        size={1000}
      >
        <div className="flex flex-col items-center gap-4">
          {Icon && <Icon size={42} />}

          <span className="text-center text-lg font-semibold px-6">
            {title}
          </span>
        </div>
      </Hexagono>
    </motion.div>
  );
}