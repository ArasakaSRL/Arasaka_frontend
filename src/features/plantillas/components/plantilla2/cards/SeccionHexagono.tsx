import HexagonoRotatorio from "@/features/plantillas/components/animations/HexagonoRotatorio";

type Props = {
  rotation: number;
  activeIndex: number;
  onRotate: () => void;
};

export default function SeccionHexagono({
  rotation,
  activeIndex,
  onRotate,
}: Props) {
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
        className="absolute top-10 right-10 z-50 bg-white px-4 py-2 rounded"
        onClick={onRotate}
      >
        Rotar
      </button>
    </div>
  );
}