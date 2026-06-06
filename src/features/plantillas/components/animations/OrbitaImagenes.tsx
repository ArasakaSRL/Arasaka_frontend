import FotoPerfil from "@/features/plantillas/components/plantilla1/FotoPerfil";
import { ORBITA_ITEMS } from "@/features/plantillas/service/orbitaData";
import { motion, useAnimationFrame } from "framer-motion";
import { useState } from "react";

interface Props {
  fotoPerfil?: string;
}

const CONFIG = {
  radio: 300,
  velocidadOrbita: 0.003,
  sizeImagen: 164,
  sizePerfil: 160,
  anchoOrbita: 800,
  altoOrbita: 800,
};

export default function OrbitaImagenes({
    fotoPerfil,
  }: Props) {
  
  const [orbitaRotation, setOrbitaRotation] = useState(0);

  useAnimationFrame((time, delta) => {
    setOrbitaRotation(
      (prev) => prev + delta * CONFIG.velocidadOrbita
    );
  });

  return (
    <div
      className="relative"
      style={{
        width: CONFIG.anchoOrbita,
        height: CONFIG.altoOrbita,
      }}
    >
      {ORBITA_ITEMS.map((item, index) => {
        const angle =
        (index * 360) / ORBITA_ITEMS.length -
        90 +
        orbitaRotation;

        const rad = (angle * Math.PI) / 180;

        const x = Math.cos(rad) * CONFIG.radio;
        const y = Math.sin(rad) * CONFIG.radio;

        return (
        <motion.div
          key={item.id}
          className="absolute top-1/2 left-1/2"
          animate={{
            x,
            y,
          }}
          transition={{
            duration: 0,
          }}
          style={{
            x,
            y,
            translateX: "-50%",
            translateY: "-50%",
            
          }}
        >
            <div className="flex flex-col items-center gap-2">
              {item.tipo === "perfil" ? (
                <FotoPerfil
                  imagenUrl={"" + fotoPerfil}
                  ancho={CONFIG.sizePerfil}
                  alto={CONFIG.sizePerfil}
                />
              ) : (
                <img
                  src={item.imagen}
                  alt={item.titulo}
                  style={{
                    width: CONFIG.sizeImagen,
                    height: CONFIG.sizeImagen,
                  }}
                  className="object-contain"
                />
              )}
            </div>
          </motion.div>
        );
      })}
      <button
        onClick={() =>
          setOrbitaRotation((prev) => prev + 15)
        }
      >
        Rotar órbita
      </button>
    </div>
  );
}