import FotoPerfil from "@/features/plantillas/components/plantilla1/FotoPerfil";
import { ORBITA_ITEMS } from "@/features/plantillas/service/orbitaData";
import { motion, useAnimationFrame } from "framer-motion";
import { useState, useRef, useEffect } from "react";

interface Props {
  fotoPerfil?: string;
  onActiveChange?: (id: string) => void;
}

const CONFIG = {
  radio: 500,
  velocidadOrbita: 0.002,
  sizeImagen: 264,
  sizePerfil: 220,
  anchoOrbita: 800,
  altoOrbita: 800,
};

export default function OrbitaImagenes({
  fotoPerfil,
  onActiveChange,
}: Props) {
  
  const [orbitaRotation, setOrbitaRotation] = useState(0);
  const lastActiveRef = useRef<string | null>(null);
  

  useAnimationFrame((time, delta) => {
    setOrbitaRotation(
      (prev) => prev + delta * CONFIG.velocidadOrbita
    );
  });

  const activeItem = ORBITA_ITEMS.find((item, index) => {
    const angle =
      (index * 360) / ORBITA_ITEMS.length -
      90 +
      orbitaRotation;

    const normalized =
      ((angle % 360) + 360) % 360;

    return (
      normalized >= 358 ||
      normalized <= 2
    );
  });

  useEffect(() => {
    if (!activeItem) return;

    if (
      lastActiveRef.current !== activeItem.id
    ) {
      lastActiveRef.current =
        activeItem.id;

      console.log(
        "ACTIVA:",
        activeItem.titulo
      );

      onActiveChange?.(activeItem.id);
    }
  }, [activeItem, onActiveChange]);

  return (
    <div
      className="relative"
      style={{
        width: CONFIG.anchoOrbita,
        height: CONFIG.altoOrbita,
      }}
    >
      
      {ORBITA_ITEMS.map((item, index) => {
        
        const angle =  (index * 360) / ORBITA_ITEMS.length - 90 +  orbitaRotation;

        const rad = (angle * Math.PI) / 180;

        const x = Math.cos(rad) * CONFIG.radio;
        const y = Math.sin(rad) * CONFIG.radio;
        const isActive =  x < -150 && y < -150;

        return (
        <motion.div
          key={item.id}
          className="absolute top-1/2 left-1/2"
          animate={{
            x,
            y,
            scale: isActive ? 1.5 : 1.0,
          }}
          transition={{
            x: { duration: 0 },
            y: { duration: 0 },
            scale: {
              duration: 1.2,
              ease: "easeInOut",
            },
          }}
          style={{
            x,
            y,
            translateX: "-50%",
            translateY: "-50%",
            
          }}
        >
            <div
              className={`
                flex
                flex-col
                items-center
                gap-2
                transition-all
                duration-300
              `}
            >
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