import { Scissors, RotateCw, Trash2, Check } from "lucide-react";

type Props = {
  onDelete: () => void;
  onRotate: () => void;
  onCrop: () => void;
  onSaveCrop: () => void;
  showCrop: boolean;  
};

export function Toolbar({
  onDelete,
  onRotate,
  onCrop,
  onSaveCrop,
  showCrop,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 bg-[#1E1E1E] px-2 py-4 rounded-xl w-[80px]">

      {/* 🔥 CAMBIA SEGÚN ESTADO */}
      <button
        onClick={showCrop ? onSaveCrop : onCrop}
        className="w-full flex flex-col items-center justify-center text-white hover:text-green-400 transition"
      >
        {showCrop ? <Check size={18} /> : <Scissors size={18} />}
        <span className="text-[10px] mt-1">
          {showCrop ? "Guardar" : "Recortar"}
        </span>
      </button>

      <button
        onClick={onRotate}
        className="w-full flex flex-col items-center justify-center text-white hover:text-blue-400 transition"
      >
        <RotateCw size={18} />
        <span className="text-[10px] mt-1">Rotar</span>
      </button>

      <button
        onClick={onDelete}
        className="w-full flex flex-col items-center justify-center text-white hover:text-red-400 transition"
      >
        <Trash2 size={18} />
        <span className="text-[10px] mt-1">Eliminar</span>
      </button>

    </div>
  );
}