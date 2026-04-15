import { FechaHito } from "./fechaHito";

// 👇 1. AQUÍ ESTÁ LA SOLUCIÓN: Agregamos las nuevas propiedades al Type
type CardHitosProps = {
  color?: "blue" | "green" | "red" | "orange"| "disabled";
  cargo: string;
  organizacion: string;
  descripcion: string;
  diaAbreviado: string; 
  diaNumero: number;    
  fechaTexto: string;   
  disabled?: boolean;
};

const borderColors = {
  blue: "border-blue-900",
  green: "border-green-500",
  red: "border-red-500",
  orange: "border-orange-500",
  disabled: "bg-[var(--color-dark-200)] text-[var(--color-dark-600)]",
};

export function CardHitos({
  color = "green",
  cargo,
  organizacion,
  descripcion,
  diaAbreviado,
  diaNumero,
  fechaTexto,
  disabled = false, 
}: CardHitosProps) {
  return (
    <div className={`w-full ${disabled ? "opacity-60 grayscale" : ""}`}>
      
      <div className="grid gap-3 items-start grid-cols-[auto_1fr]">
        
        {/* Fecha */}
        <div>
          <FechaHito
            diaAbreviado={diaAbreviado}
            diaNumero={diaNumero}
            fechaTexto={fechaTexto}
            color={disabled ? "disabled" : color} 
          />
        </div>

        <div className="flex">
          
          {/* Línea lateral dinámica */}
          <div
            className={`border-r-4 pr-3 mr-3 ${
              disabled
                ? "border-[var(--color-dark-300)]"
                : borderColors[color]
            }`}
          />

          {/* Contenido */}
          <div
            className={`grid gap-x-2 gap-y-1 text-[10px] sm:text-sm md:text-base grid-cols-[max-content_1fr] ${
              disabled
                ? "text-[var(--color-dark-500)]"
                : ""
            }`}
          >
            <div className="font-semibold">Cargo:</div>
            <div>{cargo}</div>

            <div className="font-semibold">Organización:</div>
            <div>{organizacion}</div>

            <div className="font-semibold">Descripción:</div>
            <div>{descripcion}</div>
          </div>

        </div>
      </div>

      <div
        className={`mt-4 border-b ${
          disabled
            ? "border-[var(--color-dark-200)]"
            : "border-gray-300"
        }`}
      ></div>
    </div>
  );
}