interface Props {
  nombre: string;
  total: number;
}

export function BoxCantidad({ nombre, total }: Props) {
  return (
    <div className="w-[220px] rounded-xl overflow-hidden border border-gray-300 shadow-sm">
      {/* Header */}
      <div className="bg-[#0f172a] text-white text-center py-2 text-sm font-medium">
        {nombre}
      </div>

      {/* Body */}
      <div className="bg-gray-200 text-center py-6">
        <span className="text-3xl font-bold text-[#0f172a]">
          {total.toLocaleString()}
        </span>
      </div>
    </div>
  );
}