import { motion } from "framer-motion";
import { ORBITA_ITEMS } from "@/features/plantillas/service/orbitaData";
import Hexagono from "../plantilla2/Hexagono";
//import OrbitaImagenes from "./OrbitaImagenes";

type Props = {
  rotation: number;
  activeIndex: number;
};


export default function HexagonoRotatorio({
  rotation,
  activeIndex,
}: Props) {

  {/** si quieres girar todo solo colocar dentro del primer motion,dev
    <motion.div
      style={{
              width: 220,
              height: 220,
              position: "relative",
          }}
    */}
  return (
    <div className="">
      <motion.div
        animate={{
          rotate: rotation,
        }}
        transition={{
          duration: 0.8,
          ease: "easeInOut",
        }}

      >
        <Hexagono variant={ORBITA_ITEMS[activeIndex].color} size={400} />
      </motion.div>
      </div>
  );
}