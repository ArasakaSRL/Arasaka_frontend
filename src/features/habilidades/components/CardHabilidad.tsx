
type Props = {
  nombre: string;
  nivel: string;
};

const nivelWidth: Record<string, string> = {
  Experto: "100%",
  Avanzado: "75%",
  Intermedio: "50%",
  Principiante: "25%",
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
          className="bg-green-400 h-2 rounded"
          style={{ width: nivelWidth[nivel] }}
        />
      </div>
    </div>
  );
}