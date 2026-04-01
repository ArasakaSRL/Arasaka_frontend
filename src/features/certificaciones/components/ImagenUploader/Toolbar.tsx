// src/features/certificaciones/components/ImagenUploader/Toolbar.tsx
import { Scissors, RotateCw, Trash2, Check } from "lucide-react";

type Props = {
  onDelete: () => void;
  onRotate: () => void;
  onCrop: () => void;
  onSaveCrop: () => void;
  showCrop: boolean;  
};

export function Toolbar({ onDelete, onRotate, onCrop, onSaveCrop, showCrop }: Props) {
  return (
    // CAMBIO: flex-row en móvil, flex-col en escritorio
    <div className="flex flex-row md:flex-col items-center justify-center gap-4 md:gap-6 bg-[#1E1E1E] p-4 rounded-xl w-full md:w-[80px]">
      
      <button
        onClick={showCrop ? onSaveCrop : onCrop}
        className="flex-1 md:w-full flex flex-col items-center justify-center text-white hover:text-green-400 transition"
      >
        {showCrop ? <Check size={20} /> : <Scissors size={20} />}
        <span className="text-[10px] mt-1 hidden sm:block">
          {showCrop ? "Guardar" : "Recortar"}
        </span>
      </button>

      <button
        onClick={onRotate}
        className="flex-1 md:w-full flex flex-col items-center justify-center text-white hover:text-blue-400 transition"
      >
        <RotateCw size={20} />
        <span className="text-[10px] mt-1 hidden sm:block">Rotar</span>
      </button>

      <button
        onClick={onDelete}
        className="flex-1 md:w-full flex flex-col items-center justify-center text-white hover:text-red-400 transition"
      >
        <Trash2 size={20} />
        <span className="text-[10px] mt-1 hidden sm:block">Eliminar</span>
      </button>

    </div>
  );
}