import SeccionHexagono from "@/features/plantillas/components/plantilla2/cards/SeccionHexagono";
import NavbarHorizontal from "@/features/plantillas/components/plantilla2/NavbarHorizontal";
import { ORBITA_ITEMS } from "@/features/plantillas/service/orbitaData";
import { useState, useCallback } from "react";

const TOTAL = ORBITA_ITEMS.length;
const STEP_DEG = 360 / TOTAL; // 60°

export default function About() {
  const [rotation, setRotation]     = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  // Fuente de verdad: avanzar N pasos en sentido horario
  // +1 paso = siguiente ítem en el array = hexágono gira +60°
  const advance = useCallback((steps: number) => {
    const newIndex = ((activeIndex + steps) % TOTAL + TOTAL) % TOTAL;
    setRotation((prev) => prev + steps * STEP_DEG);
    setActiveIndex(newIndex);
  }, [activeIndex]);

  // Botón rotar: avanza 1 paso horario
  const handleRotate = () => advance(1);

  // Navbar: ir directo a un índice — calcula pasos más cortos
  const handleSectionChange = (index: number) => {
    if (index === activeIndex) return;
    // pasos en sentido horario
    const stepsForward  = ((index - activeIndex) + TOTAL) % TOTAL;
    // pasos en sentido antihorario (negativo)
    const stepsBackward = stepsForward - TOTAL;
    // elige el camino más corto
    const steps = stepsForward <= TOTAL / 2 ? stepsForward : stepsBackward;
    advance(steps);
  };

  // Órbita: viene con id, convierte a índice y usa el mismo advance
  const handleOrbitaChange = useCallback((id: string) => {
    const index = ORBITA_ITEMS.findIndex((item) => item.id === id);
    if (index === -1 || index === activeIndex) return;
    const stepsForward  = ((index - activeIndex) + TOTAL) % TOTAL;
    const stepsBackward = stepsForward - TOTAL;
    const steps = stepsForward <= TOTAL / 2 ? stepsForward : stepsBackward;
    advance(steps);
  }, [activeIndex, advance]);

  return (
    <div>
      <SeccionHexagono
        rotation={rotation}
        activeIndex={activeIndex}
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