import HexagonoRotatorio from "@/features/plantillas/components/animations/HexagonoRotatorio";
import OrbitaImagenes from "../../animations/OrbitaImagenes";

type Props = {
  rotation: number;
  activeIndex: number;
  externalStep: number;
  targetIndex: number;          // ← nuevo
  onRotate: () => void;
  onActiveChange: (id: string) => void;
};

export default function SeccionHexagono({
  rotation,
  activeIndex,
  externalStep,
  targetIndex,
  onRotate,
  onActiveChange,
}: Props) {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div className="absolute" style={{ left: "-250px", top: "-150px" }}>
        <HexagonoRotatorio rotation={rotation} activeIndex={activeIndex} />
      </div>
      <div className="absolute" style={{ left: "-480px", top: "-350px" }}>
        <OrbitaImagenes
          fotoPerfil="https://res.cloudinary.com/dkopjpuqx/image/upload/v1775345490/look-my-medal_apeb4v.jpg"
          externalStep={externalStep}
          targetIndex={targetIndex}
          onActiveChange={onActiveChange}
        />
      </div>
    </div>
  );
}