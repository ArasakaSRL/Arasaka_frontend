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

const STEP = 360 / ORBITA_ITEMS.length; // 60°
const ANGULO_ACTIVO = -90;              // ítem activo = posición arriba

export default function OrbitaImagenes({ fotoPerfil, onActiveChange }: Props) {
  const [orbitaRotation, setOrbitaRotation] = useState(-90);
  const lastActiveRef = useRef<string | null>(null);

  // Auto-rotación horaria continua
  useAnimationFrame((_, delta) => {
    setOrbitaRotation((prev) => prev + delta * CONFIG.velocidadOrbita);
  });

  // Ángulo real de cada ítem en pantalla
  // index * STEP en negativo → orden 1-2-3-4-5-6 horario
  const getAngle = (index: number) => -(index * STEP) + orbitaRotation;

  // Ítem más cercano a ANGULO_ACTIVO (-90° = arriba)
  const activeItem = ORBITA_ITEMS.reduce<{
    item: (typeof ORBITA_ITEMS)[0];
    dist: number;
  } | null>((closest, item, index) => {
    const norm   = ((getAngle(index) % 360) + 360) % 360;
    const target = ((ANGULO_ACTIVO  % 360) + 360) % 360;
    const dist   = Math.min(Math.abs(norm - target), 360 - Math.abs(norm - target));
    if (!closest || dist < closest.dist) return { item, dist };
    return closest;
  }, null)?.item;

  useEffect(() => {
    if (!activeItem || lastActiveRef.current === activeItem.id) return;
    lastActiveRef.current = activeItem.id;
    onActiveChange?.(activeItem.id);
  }, [activeItem, onActiveChange]);

  return (
    <div
      className="relative"
      style={{ width: CONFIG.anchoOrbita, height: CONFIG.altoOrbita }}
    >
      {ORBITA_ITEMS.map((item, index) => {
        const angle = getAngle(index); // ← mismo cálculo para render y detección
        const rad = (angle * Math.PI) / 180;
        const x = Math.cos(rad) * CONFIG.radio;
        const y = Math.sin(rad) * CONFIG.radio;
        const isActive = activeItem?.id === item.id;

        return (
          <motion.div
            key={item.id}
            className="absolute top-1/2 left-1/2"
            animate={{ scale: isActive ? 1.5 : 1.0 }}
            transition={{ scale: { duration: 1.2, ease: "easeInOut" } }}
            style={{ x, y, translateX: "-50%", translateY: "-50%" }}
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
                  style={{ width: CONFIG.sizeImagen, height: CONFIG.sizeImagen }}
                  className="object-contain"
                />
              )}
            </div>
          </motion.div>
        );
      })}

      <button onClick={() => setOrbitaRotation((prev) => prev - STEP)}>
        Rotar órbita
      </button>
    </div>
  );
}