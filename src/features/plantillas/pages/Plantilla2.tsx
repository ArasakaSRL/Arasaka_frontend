import { useState, useCallback, useRef } from "react";

import { CardCatalogo } from "@/features/plantillas/components/plantilla2/cards/CardCatalogo";
import SeccionHexagono from "@/features/plantillas/components/plantilla2/cards/SeccionHexagono";
import NavbarHorizontal from "@/features/plantillas/components/plantilla2/NavbarHorizontal";
import { ORBITA_ITEMS } from "@/features/plantillas/service/orbitaData";
import { usePortfolioData } from "@/features/reportesUsuario/hooks/usePortfolioData";
import { useAuthStore } from "@/stores/authStore";


const TOTAL = ORBITA_ITEMS.length;
const STEP_DEG = 360 / TOTAL;

const PRODUCTOS = [
  {
    id: 1,
    titulo: "Worktop",
    descripcion: "110 x 110",
    imagen:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
  },
  {
    id: 2,
    titulo: "Couch capsule",
    descripcion: "110 x 110",
    imagen:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
  },
  {
    id: 3,
    titulo: "Couch cake",
    descripcion: "110 x 110",
    imagen:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
  },
];

export default function Plantilla2() {
  const [rotation,     setRotation]     = useState(0);
  const [activeIndex,  setActiveIndex]  = useState(0);
  const [externalStep, setExternalStep] = useState(0);
  const [targetIndex,  setTargetIndex]  = useState<number>(0);
  const isAdvancingRef = useRef(false);

  const slug = useAuthStore((state) => state.portafolioSeleccionado?.slug);
  const { data, loading, noDisponible } = usePortfolioData(slug);

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

  const handleSectionChange = (index: number) => {
    setActiveIndex((prev) => {
      if (index === prev) return prev;
      const stepsForward  = ((index - prev) + TOTAL) % TOTAL;
      const stepsBackward = stepsForward - TOTAL;
      const steps = stepsForward <= TOTAL / 2 ? stepsForward : stepsBackward;
      setRotation((r) => r + steps * STEP_DEG);
      setTargetIndex(index);
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

  if (!slug)        return <div>No tienes un portafolio asignado.</div>;
  if (loading)      return <div>Cargando...</div>;
  if (noDisponible || !data) return <div>Portafolio no disponible.</div>;

  const { usuario, habilidadesTecnicas, habilidadesBlandas, experiencias, proyectos, configuracion, certificaciones } = data;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#F0EAD6]">

      {/* Hexágono + órbita — ocupa toda la pantalla */}
      <SeccionHexagono
        rotation={rotation}
        activeIndex={activeIndex}
        externalStep={externalStep}
        targetIndex={targetIndex}
        titulo={ORBITA_ITEMS[activeIndex].titulo}
        onRotate={handleRotate}
        onActiveChange={handleOrbitaChange}
      />

      {/* Navbar flotante — misma fila derecha del hexágono */}
      <div
        className="absolute z-50 flex flex-col gap-3 w-[500px]"
        style={{
          top: "10%",
          left: "65%",
          transform: "translateX(-50%)",
        }}
      >
        <h1 className="text-black">Mi Portafolio</h1>
        <NavbarHorizontal
          activeIndex={activeIndex}
          onChange={handleSectionChange}
        />

        {PRODUCTOS.map((item) => (
          <CardCatalogo
            key={item.id}
            titulo={item.titulo}
            descripcion={item.descripcion}
            imagen={item.imagen}
            onClick={() => console.log(item.id)}
          />
        ))}
      </div>

    </div>
  );
}