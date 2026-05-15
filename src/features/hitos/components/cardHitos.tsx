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
  eliminando?: boolean;
  onSelect?: () => void;
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
  eliminando,
  onSelect,
}: CardHitosProps) {
  return (
    <div 
    onClick={onSelect}
    className={`
      w-full
      p-2
      rounded-xl
      transition-colors
      ${
        eliminando
          ? `
            cursor-pointer
            hover:bg-red-50
          `
          : ""
      }
      ${disabled ? "opacity-60 grayscale" : ""}
    `}
    >
      
      <div className="grid w-full items-start gap-3 sm:gap-6 grid-cols-[110px_1fr] sm:grid-cols-[160px_1fr]">
        
        {/* Fecha */}
        <div >
          <FechaHito
            diaAbreviado={diaAbreviado}
            diaNumero={diaNumero}
            fechaTexto={fechaTexto}
            color={disabled ? "disabled" : color} 
          />
        </div>

        <div className="flex w-full">
          
          {/* Línea lateral dinámica */}
          <div
            className={`border-r-4 pr-3 mr-3 ${
              disabled
                ? "border-dark-300"
                : borderColors[color]
            }`}
          />

          {/* Contenido */}
          <div
            className={`grid gap-x-2 gap-y-1 text-[10px] sm:text-sm md:text-base grid-cols-[max-content_1fr]  ${
              disabled
                ? "text-dark-500"
                : ""
            }`}
          >
            <div className="font-semibold text-left">Cargo:</div>
            <div className="text-left">{cargo}</div>

            <div className="font-semibold text-left">Organización:</div>
            <div className="text-left">{organizacion}</div>

            <div className="font-semibold text-left">Descripción:</div>
            <div className="text-left">{descripcion}</div>
          </div>

        </div>
      </div>

      <div
        className={`mt-4 border-b ${
          disabled
            ? "border-dark-200"
            : "border-gray-300"
        }`}
      ></div>
    </div>
  );
}