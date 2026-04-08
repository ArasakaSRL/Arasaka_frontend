
type Props = {
  nombre: string;
  nivel: string;
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

export default function HabilidadItem({ nombre, nivel }: Props) {
  return (
    <div className="border border-primary-500 rounded-lg p-3 space-y-2 bg-white">
      <div className="flex justify-between items-center">
        <span className="font-medium text-sm text-left text-black">{nombre}</span>

        <div className="flex items-center gap-2 text-gray-500">
          <span className="text-xs">{nivel}</span>
          {/* <Pencil size={14} className="cursor-pointer" />
          <Trash2 size={14} className="cursor-pointer" /> */}
        </div>
      </div>

      <div className="w-full bg-gray-200 h-2 rounded">
        <div
          className="bg-green-600 h-2 rounded"
          style={{ width: getWidth(nivel) }}
        />
      </div>
    </div>
  );
}