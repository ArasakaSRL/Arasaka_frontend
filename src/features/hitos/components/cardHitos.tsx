import { FechaHito } from "./fechaHito";

type CardHitosProps = {
  color?: "blue" | "green" | "red" | "orange";
  cargo: string;
  organizacion: string;
  descripcion: string;
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
}: CardHitosProps) {
  return (
    <div className="w-full">
      
      {/* GRID PRINCIPAL */}
      <div className="grid gap-3 items-start grid-cols-[auto_1fr]">
  
        {/* Fecha */}
        <div>
          <FechaHito
            diaAbreviado="MAR"
            diaNumero={99}
            fechaTexto="Octubre, 2019"
            color={color}
          />
        </div>

        {/* CONTENEDOR CON UNA SOLA LÍNEA */}
        <div className="flex">
          
          {/* Línea única */}
          <div
            className={`
              border-r-4 pr-3 mr-3
              ${borderColors[color]}
            `}
          />

          {/* Contenido */}
          <div
            className="
              grid gap-x-2 gap-y-1
              text-[10px] sm:text-sm md:text-base
              grid-cols-[max-content_1fr]
            "
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

      {/* Línea inferior */}
      <div className="mt-4 border-b border-gray-300"></div>

    </div>
  );
}