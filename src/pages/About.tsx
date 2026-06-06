import SeccionHexagono from "@/features/plantillas/components/plantilla2/cards/SeccionHexagono";
import NavbarHorizontal from "@/features/plantillas/components/plantilla2/NavbarHorizontal";
import { ORBITA_ITEMS } from "@/features/plantillas/service/orbitaData";
import { useState, useCallback, useRef } from "react";

const TOTAL = ORBITA_ITEMS.length;
const STEP_DEG = 360 / TOTAL;

export default function About() {
  const [rotation,     setRotation]     = useState(0);
  const [activeIndex,  setActiveIndex]  = useState(0);
  const [externalStep, setExternalStep] = useState(0);
  const isAdvancingRef = useRef(false);

  const advance = useCallback((steps: number) => {
    isAdvancingRef.current = true;
    setActiveIndex((prev) => {
      const newIndex = ((prev + steps) % TOTAL + TOTAL) % TOTAL;
      setRotation((r) => r + steps * STEP_DEG);
      setExternalStep((s) => s + steps);
      return newIndex;
    });
    setTimeout(() => { isAdvancingRef.current = false; }, 300);
  }, []);

  const handleRotate = () => advance(1);

  const handleSectionChange = (index: number) => {
    setActiveIndex((prev) => {
      if (index === prev) return prev;
      const stepsForward  = ((index - prev) + TOTAL) % TOTAL;
      const stepsBackward = stepsForward - TOTAL;
      const steps = stepsForward <= TOTAL / 2 ? stepsForward : stepsBackward;
      setRotation((r) => r + steps * STEP_DEG);
      setExternalStep((s) => s + steps);
      return ((prev + steps) % TOTAL + TOTAL) % TOTAL;
    });
  };

  // Órbita llegó a un ítem: setea índice y color DIRECTO, sin calcular pasos
  const handleOrbitaChange = useCallback((id: string) => {
    if (isAdvancingRef.current) return;
    const index = ORBITA_ITEMS.findIndex((item) => item.id === id);
    if (index === -1) return;
    // Setea directo — el hexágono toma el color del índice que la órbita reporta
    setActiveIndex(index);
    // La rotación del hexágono la ignoramos cuando viene de la órbita,
    // porque la órbita ya está mostrando el ítem correcto
  }, []);

  return (
    <div>
      <SeccionHexagono
        rotation={rotation}
        activeIndex={activeIndex}
        externalStep={externalStep}
        onRotate={handleRotate}
        onActiveChange={handleOrbitaChange}
      />
      <NavbarHorizontal
        activeIndex={activeIndex}
        onChange={handleSectionChange}
      />
    </div>
  );
}