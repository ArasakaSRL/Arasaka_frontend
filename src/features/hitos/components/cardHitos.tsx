import { FechaHito } from "./fechaHito";

// 👇 1. AQUÍ ESTÁ LA SOLUCIÓN: Agregamos las nuevas propiedades al Type
type CardHitosProps = {
  color?: "blue" | "green" | "red" | "orange";
  cargo: string;
  organizacion: string;
  descripcion: string;
  diaAbreviado: string; // <-- NUEVO
  diaNumero: number;    // <-- NUEVO
  fechaTexto: string;   // <-- NUEVO
};

const borderColors = {
  blue: "border-blue-900",
  green: "border-green-500",
  red: "border-red-500",
  orange: "border-orange-500",
};

export function CardHitos({
  color = "green",
  cargo,
  organizacion,
  descripcion,
  // 👇 2. Las extraemos aquí
  diaAbreviado, 
  diaNumero,
  fechaTexto,
}: CardHitosProps) {
  return (
    <div className="w-full">
      
      <div className="grid gap-3 items-start grid-cols-[auto_1fr]">
        
        {/* Fecha */}
        <div>
          {/* 👇 3. Y se las pasamos a FechaHito */}
          <FechaHito
            diaAbreviado={diaAbreviado}
            diaNumero={diaNumero}
            fechaTexto={fechaTexto}
            color={color}
          />
        </div>

        <div className="flex">
          
          <div className={`border-r-4 pr-3 mr-3 ${borderColors[color]}`} />

          <div className="grid gap-x-2 gap-y-1 text-[10px] sm:text-sm md:text-base grid-cols-[max-content_1fr]">
            <div className="font-semibold">Cargo:</div>
            <div>{cargo}</div>

            <div className="font-semibold">Organización:</div>
            <div>{organizacion}</div>

            <div className="font-semibold">Descripción:</div>
            <div>{descripcion}</div>
          </div>

        </div>

      </div>

      <div className="mt-4 border-b border-gray-300"></div>

    </div>
  );
}