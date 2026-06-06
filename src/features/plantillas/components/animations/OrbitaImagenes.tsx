import FotoPerfil from "@/features/plantillas/components/plantilla1/FotoPerfil";
import { ORBITA_ITEMS } from "@/features/plantillas/service/orbitaData";
import { motion, useAnimationFrame } from "framer-motion";
import { useState, useRef, useEffect } from "react";

interface Props {
  fotoPerfil?: string;
  externalStep?: number;
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

const STEP = 360 / ORBITA_ITEMS.length;
const ANGULO_ACTIVO = 30; // ← corregido: -90 + 120 (2 pasos de 60°)

export default function OrbitaImagenes({ fotoPerfil, externalStep = 0, onActiveChange }: Props) {
  const [orbitaRotation, setOrbitaRotation] = useState(ANGULO_ACTIVO);
  const lastStepRef   = useRef(0);
  const lastActiveRef = useRef<string | null>(null);
  const debounceRef   = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const delta = externalStep - lastStepRef.current;
    if (delta === 0) return;
    lastStepRef.current = externalStep;
    setOrbitaRotation((prev) => prev - delta * STEP);
  }, [externalStep]);

  useAnimationFrame((_, delta) => {
    setOrbitaRotation((prev) => prev + delta * CONFIG.velocidadOrbita);
  });

  const getAngle = (index: number) => -(index * STEP) + orbitaRotation;

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

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onActiveChange?.(activeItem.id);
    }, 150);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [activeItem, onActiveChange]);

  return (
    <div className="relative" style={{ width: CONFIG.anchoOrbita, height: CONFIG.altoOrbita }}>
      {ORBITA_ITEMS.map((item, index) => {
        const angle = getAngle(index);
        const rad = (angle * Math.PI) / 180;
        const x = Math.cos(rad) * CONFIG.radio;
        const y = Math.sin(rad) * CONFIG.radio;
        const isActive = activeItem?.id === item.id;

        return (
          <motion.div
            key={item.id}
            className="absolute top-1/2 left-1/2"
            animate={{ scale: isActive ? 1.3 : 0.9 }}
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
    </div>
  );
}