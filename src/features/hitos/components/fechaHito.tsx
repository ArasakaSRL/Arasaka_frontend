type FechaHitoProps = {
  diaAbreviado: string;
  diaNumero: number;
  fechaTexto: string;
  color?: "blue" | "green" | "red" | "orange";
};

const colorVariants = {
  blue: {
    badge: "bg-blue-900 text-white",
    border: "border-blue-900",
  },
  green: {
    badge: "bg-green-500 text-white",
    border: "border-green-500",
  },
  red: {
    badge: "bg-red-500 text-white",
    border: "border-red-500",
  },
  orange: {
    badge: "bg-orange-500 text-white",
    border: "border-orange-500",
  },
};

export function FechaHito({
  diaAbreviado,
  diaNumero,
  fechaTexto,
  color = "blue",
}: FechaHitoProps) {
  const styles = colorVariants[color];

  return (
    <div className="flex items-start gap-4">
      {/* Línea lateral */}
      <div className={` ${styles.border}`}>
        
        {/* GRID */}
        <div className="grid grid-cols-2 grid-rows-2 items-center">
          
          {/* [1] Día */}
          <div
            className={`
              ${styles.badge}
              rounded font-semibold w-fit

              /* tamaños */
              text-[10px] px-2 py-1
              sm:text-xs sm:px-2 sm:py-1
              md:text-sm md:px-3 md:py-1.5
              lg:text-base lg:px-3 lg:py-2
            `}
          >
            {diaAbreviado}
          </div>

          {/* [2] Número */}
          <div
            className="
              font-extrabold text-gray-900 leading-none

              text-2xl
              sm:text-3xl
              md:text-4xl
              lg:text-5xl
            "
          >
            {diaNumero}
          </div>

          {/* [3] Fecha */}
          <div
            className="
              col-span-2 text-gray-500 mt-1

              text-xs
              sm:text-sm
              md:text-base
              lg:text-lg
            "
          >
            {fechaTexto}
          </div>
        </div>
      </div>
    </div>
  );
}