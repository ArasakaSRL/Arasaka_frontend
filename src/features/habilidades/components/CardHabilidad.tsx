import { SquarePen,Trash2  } from 'lucide-react';
import { useState } from 'react';
import ConfirmDeleteModal from './ConfirmDeleteModal';
type Props = {
  nombre: string;
  nivel: string;
  onEditar: () => void;
  onEliminar: () => void;
};

const nivelesOrden = [
  "Principiante",
  "Intermedio",
  "Competente",
  "Avanzado",
  "Experto",
];

const getWidth = (nivel: string) => {
  const index = nivelesOrden.indexOf(nivel);
  return index >= 0 ? `${(index + 1) * 20}%` : "10%";
};

export default function HabilidadItem({ nombre, nivel, onEditar, onEliminar }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="w-full border border-primary-500 rounded-lg p-3 bg-white flex items-center justify-between">
      
      {/* CONTENIDO IZQUIERDO */}
      <div className="flex-1 space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-medium text-left text-sm text-black">{nombre}</span>
          <span className="text-xs text-gray-500">{nivel}</span>
        </div>

        <div className="w-full bg-gray-200 h-2 rounded">
          <div
            className="bg-green-600 h-2 rounded"
            style={{ width: getWidth(nivel) }}
          />
        </div>
      </div>

      {/* ICONOS DERECHA */}
      <div className="flex items-center gap-2 ml-3">
        <button onClick={onEditar}>
          <SquarePen size={16} className="text-gray-500 hover:text-black" />
        </button>
<>
  <button onClick={() => setIsModalOpen(true)}>
    <Trash2 size={16} className="text-gray-500 hover:text-black" />
  </button>

  <ConfirmDeleteModal
    isOpen={isModalOpen}
    nombre={nombre}
    onClose={() => setIsModalOpen(false)}
    onConfirm={() => {
      onEliminar();
      setIsModalOpen(false);
    }}
  />
</>
      </div>
    </div>
  );
}