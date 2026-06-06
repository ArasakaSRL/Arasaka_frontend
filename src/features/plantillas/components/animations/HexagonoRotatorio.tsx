import { motion } from "framer-motion";
import { ORBITA_ITEMS } from "@/features/plantillas/service/orbitaData";
import Hexagono from "../plantilla2/Hexagono";

type Props = {
  rotation: number;
  activeIndex: number;
};

export default function HexagonoRotatorio({ rotation, activeIndex }: Props) {
  // activeIndex viene del padre = fuente de verdad
  const variant = ORBITA_ITEMS[activeIndex].color;

  return (
    <div>
      <motion.div
        animate={{ rotate: rotation }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <Hexagono variant={variant} size={400} />
      </motion.div>
    </div>
  );
}