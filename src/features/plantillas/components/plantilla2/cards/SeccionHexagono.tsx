import HexagonoRotatorio from "@/features/plantillas/components/animations/HexagonoRotatorio";
import OrbitaImagenes from "../../animations/OrbitaImagenes";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  rotation: number;
  activeIndex: number;
  externalStep: number;
  targetIndex: number;     
  titulo: string;     
  onRotate: () => void;
  onActiveChange: (id: string) => void;
};

export default function SeccionHexagono({
  rotation,
  activeIndex,
  externalStep,
  targetIndex,
  titulo,
  onRotate,
  onActiveChange,
}: Props) {
  return (
    <div className="relative w-screen h-screen overflow-hidden">

      <div className="absolute" style={{ left: "-250px", top: "-150px" }}>
        <HexagonoRotatorio rotation={rotation} activeIndex={activeIndex} />
      </div>

      <div className="absolute z-30" style={{ left: "-480px", top: "-350px" }}>
        <OrbitaImagenes
          fotoPerfil="https://res.cloudinary.com/dkopjpuqx/image/upload/v1775345490/look-my-medal_apeb4v.jpg"
          externalStep={externalStep}
          targetIndex={targetIndex}
          onActiveChange={onActiveChange}
        />
      </div>

      <div className="absolute left-[60px] top-[200px] z-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={titulo}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >

            <h1 className="text-6xl font-black text-white leading-none">
              {titulo.split(" ").map((palabra) => (
                <div key={palabra}>{palabra}</div>
              ))}
            </h1>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}