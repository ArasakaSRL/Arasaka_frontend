import SeccionHexagono from "@/features/plantillas/components/plantilla2/cards/SeccionHexagono";
import { ORBITA_ITEMS } from "@/features/plantillas/service/orbitaData";
import { useState } from "react";

export default function About() {
  const [rotation, setRotation] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleRotate = () => {
    setRotation((prev) => prev + 60);
    setActiveIndex((prev) => (prev + 1) % ORBITA_ITEMS.length);
  };

  return (
    <SeccionHexagono
      rotation={rotation}
      activeIndex={activeIndex}
      onRotate={handleRotate}
    />
  );
}