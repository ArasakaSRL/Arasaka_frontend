interface Props {
  nombre: string;
  total: number;
}

export function TotalVisitas({ nombre, total }: Props) {
  return (
    <div className="w-full max-w-lg mx-auto bg-[#27357a] rounded-2xl py-10 px-6 text-center shadow-md">
      {/* Título */}
      <p className="text-white text-lg md:text-xl font-medium mb-2">
        {nombre}
      </p>

      {/* Número */}
      <h2 className="text-white text-4xl md:text-6xl font-extrabold">
        {total.toLocaleString()}
      </h2>
    </div>
  );
}