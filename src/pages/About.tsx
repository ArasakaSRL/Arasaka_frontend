import SeccionHexagono from "@/features/plantillas/components/plantilla2/cards/SeccionHexagono";
import NavbarHorizontal from "@/features/plantillas/components/plantilla2/NavbarHorizontal";
import { ORBITA_ITEMS } from "@/features/plantillas/service/orbitaData";
import { useState } from "react";

export default function About() {
  const [rotation, setRotation] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleRotate = () => {
    setRotation((prev) => prev + 60);
    setActiveIndex((prev) => (prev + 1) % ORBITA_ITEMS.length);
  };

  const handleSectionChange = (index: number) => {
    const total = ORBITA_ITEMS.length;
    const diff = (index - activeIndex + total) % total;
    setRotation((prev) => prev + diff * 60);
    setActiveIndex(index);
  };

  const handleOrbitaChange = (id: string) => {
    const index = ORBITA_ITEMS.findIndex(item => item.id === id);
    if (index === -1 || index === activeIndex) {
      return;
    }
    const total = ORBITA_ITEMS.length;
    const diff =(index - activeIndex + total) % total;
    setRotation(prev => prev + diff * 60);
    setActiveIndex(index);
  };

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