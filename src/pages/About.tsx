import HexagonoRotatorio from "@/features/plantillas/components/animations/HexagonoRotatorio";
import { useState } from "react";

export default function About() {
  const [rotation, setRotation] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div className="relative min-h-screen bg-gray-100 overflow-hidden">
      <div
        className="absolute"
        style={{
          left: "-250px",
          top: "-150px",
        }}
      >
        <HexagonoRotatorio 
          rotation={rotation}
          activeIndex={activeIndex}
        />
      </div>
      
      <button
        className=" absolute top-10 right-10 z-50 bg-white px-4 py-2 rounded "
        onClick={() => {
          setRotation((prev) => prev + 60);
          setActiveIndex((prev) => (prev + 1) % 6);
        }}
      >
        Rotar
      </button>
    </div>
  );
}