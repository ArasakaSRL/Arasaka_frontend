import { ORBITA_ITEMS } from "@/features/plantillas/service/orbitaData";
import { motion, useAnimationFrame } from "framer-motion";
import { useState, useRef, useEffect } from "react";

interface Props {
  readonly fotoPerfil?: string;       // ← sonar: props read-only
  readonly externalStep?: number;
  readonly targetIndex?: number;
  readonly onActiveChange?: (id: string) => void;
}

const CONFIG = {
  radio: 500,
  velocidadOrbita: 0.002,
  sizeImagen: 264,
  sizePerfil: 180,
  anchoOrbita: 800,
  altoOrbita: 800,
} as const;

const STEP = 360 / ORBITA_ITEMS.length;
const ANGULO_ACTIVO = 30;

export default function OrbitaImagenes({
  fotoPerfil,
  externalStep = 0,
  targetIndex,
  onActiveChange,
}: Props) {
  const [orbitaRotation, setOrbitaRotation] = useState(ANGULO_ACTIVO);
  const lastStepRef   = useRef(0);
  const lastTargetRef = useRef<number | undefined>(undefined);
  const lastActiveRef = useRef<string | null>(null);
  const debounceRef   = useRef<ReturnType<typeof setTimeout> | null>(null);

  // externalStep: pasos relativos — se guarda el delta en ref y se aplica en el frame
  const pendingDeltaRef = useRef(0);

  useEffect(() => {
    const delta = externalStep - lastStepRef.current;
    if (delta === 0) return;
    lastStepRef.current  = externalStep;
    pendingDeltaRef.current += delta; // ← acumula, no llama setState
  }, [externalStep]);

  // targetIndex: posición absoluta — igual, guarda en ref
  const pendingTargetRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (targetIndex === undefined) return;
    if (lastTargetRef.current === targetIndex) return;
    lastTargetRef.current  = targetIndex;
    pendingTargetRef.current = targetIndex; // ← guarda en ref, no llama setState
  }, [targetIndex]);

  // Un único lugar que mueve la órbita: el animation frame
  useAnimationFrame((_, delta) => {
    setOrbitaRotation((prev) => {
      let next = prev + delta * CONFIG.velocidadOrbita;

      // Aplicar pasos externos acumulados
      if (pendingDeltaRef.current !== 0) {
        next -= pendingDeltaRef.current * STEP;
        pendingDeltaRef.current = 0;
      }

      // Aplicar salto a targetIndex absoluto
      if (pendingTargetRef.current !== undefined) {
        const idx = pendingTargetRef.current;
        pendingTargetRef.current = undefined;
        const currentAngle = -(idx * STEP) + next;
        const currentNorm  = ((currentAngle % 360) + 360) % 360;
        const targetNorm   = ((ANGULO_ACTIVO % 360) + 360) % 360;
        let diff = targetNorm - currentNorm;
        if (diff > 180)  diff -= 360;
        if (diff < -180) diff += 360;
        next += diff;
      }

      return next;
    });
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
        const y = Math.sin(rad) * CONFIG.radio;    // ← sonar: sin 0.0
        const isActive = activeItem?.id === item.id;

        return (
          <motion.div
            key={item.id}
            className="absolute top-1/2 left-1/2"
            animate={{ scale: isActive ? 1.5 : 1 }}  // ← sonar: 1.0 → 1
            transition={{ scale: { duration: 1.2, ease: "easeInOut" } }}
            style={{ x, y, translateX: "-50%", translateY: "-50%" }}
          >
            <div className="flex flex-col items-center gap-2">
             {item.tipo === "perfil" ? (
                <img
                  src={fotoPerfil || "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"} 
                  alt={item.titulo}
                  style={{ width: CONFIG.sizePerfil, height: CONFIG.sizePerfil }}
                  className="object-contain drop-shadow-lg" 
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