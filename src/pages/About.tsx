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
  const [targetIndex,  setTargetIndex]  = useState<number>(0); // ← nuevo
  const isAdvancingRef = useRef(false);

  const advance = useCallback((steps: number) => {
    isAdvancingRef.current = true;
    setActiveIndex((prev) => {
      const newIndex = ((prev + steps) % TOTAL + TOTAL) % TOTAL;
      setRotation((r) => r + steps * STEP_DEG);
      setExternalStep((s) => s + steps);
      setTargetIndex(newIndex);
      return newIndex;
    });
    setTimeout(() => { isAdvancingRef.current = false; }, 300);
  }, []);

  const handleRotate = () => advance(1);

  // Navbar: usa targetIndex absoluto en vez de pasos relativos
  const handleSectionChange = (index: number) => {
    setActiveIndex((prev) => {
      if (index === prev) return prev;
      const stepsForward  = ((index - prev) + TOTAL) % TOTAL;
      const stepsBackward = stepsForward - TOTAL;
      const steps = stepsForward <= TOTAL / 2 ? stepsForward : stepsBackward;
      setRotation((r) => r + steps * STEP_DEG);
      setTargetIndex(index);   // ← absoluto, la órbita calcula sola cómo llegar
      // externalStep NO se toca: targetIndex maneja el movimiento
      return index;
    });
  };

  const handleOrbitaChange = useCallback((id: string) => {
    if (isAdvancingRef.current) return;
    const index = ORBITA_ITEMS.findIndex((item) => item.id === id);
    if (index === -1) return;
    setActiveIndex((prev) => {
      if (index === prev) return prev;
      const stepsForward  = ((index - prev) + TOTAL) % TOTAL;
      const stepsBackward = stepsForward - TOTAL;
      const steps = stepsForward <= TOTAL / 2 ? stepsForward : stepsBackward;
      setRotation((r) => r + steps * STEP_DEG);
      return index;
    });
  }, []);

  return (
    <div>
      <SeccionHexagono
        rotation={rotation}
        activeIndex={activeIndex}
        externalStep={externalStep}
        targetIndex={targetIndex}
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