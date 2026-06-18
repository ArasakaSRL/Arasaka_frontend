import { FechaHito } from "./fechaHito";

type CardHitosProps = {
  color?: "blue" | "green" | "red" | "orange" | "disabled";

  cargo: string;
  organizacion: string;
  descripcion: string;

  fechaInicio: string;
  fechaFin: string | null;

  diaAbreviado: string;
  diaNumero: number;
  fechaTexto: string;

  disabled?: boolean;

  eliminando?: boolean;
  seleccionado?: boolean;

  onSelect?: () => void;
};

const borderColors = {
  blue: "border-blue-900",
  green: "border-green-500",
  red: "border-red-500",
  orange: "border-orange-500",
  disabled:
    "bg-[var(--color-dark-200)] text-[var(--color-dark-600)]",
};

export function CardHitos({
  color = "green",
  cargo,
  organizacion,
  descripcion,
  fechaInicio,
  fechaFin,
  diaAbreviado,
  diaNumero,
  fechaTexto,
  disabled = false,
  eliminando,
  seleccionado,
  onSelect,
}: CardHitosProps) {
  return (
    <div className="w-full max-w-5xl">

      {/* ───────── CARD ───────── */}
      <div
        onClick={onSelect}
        className={`
          w-full
          p-2
          rounded-xl
          transition-all duration-300

          ${
            eliminando
              ? seleccionado
                ? `
                  border border-red-500
                  bg-red-50
                  ring-2 ring-red-500
                  cursor-pointer
                `
                : `
                  border border-[#f8fafc]
                  cursor-pointer
                  hover:bg-red-50
                  hover:border-red-400
                `
              : `
                border border-[#f8fafc]
              `
          }

          ${
            eliminando
              ? `
                cursor-pointer
                hover:bg-red-50
              `
              : ""
          }

          ${
            disabled
              ? "opacity-60 grayscale"
              : ""
          }
        `}
      >

        <div
          className="
            grid w-full items-start
            gap-3 sm:gap-6
            grid-cols-[110px_1fr]
            sm:grid-cols-[160px_1fr]
          "
        >

          {/* ───────── FECHA ───────── */}
          <div>
            <div className="text-left text-gray-500">
              <span>Fecha de Inicio:</span>
            </div>
            <FechaHito
              diaAbreviado={diaAbreviado}
              diaNumero={diaNumero}
              fechaTexto={fechaTexto}
              color={
                disabled
                  ? "disabled"
                  : color
              }
            />
            
          </div>

          {/* ───────── CONTENIDO ───────── */}
          <div className="flex w-full">

            {/* Línea lateral */}
            <div
              className={`
                border-r-4
                pr-3 mr-3

                ${
                  disabled
                    ? "border-dark-300"
                    : borderColors[color]
                }
              `}
            />

            {/* Texto */}
            <div
              className={`
                grid
                gap-x-2 gap-y-1

                text-[10px]
                sm:text-sm
                md:text-base

                grid-cols-[max-content_1fr]

                ${
                  disabled
                    ? "text-dark-500"
                    : ""
                }
              `}
            >

              <div className="font-semibold text-left">
                Cargo:
              </div>

              <div className="text-left">
                {cargo}
              </div>

              <div className="font-semibold text-left">
                Organización:
              </div>

              <div className="text-left">
                {organizacion}
              </div>

              <div className="font-semibold text-left">
                Descripción:
              </div>

              <div className="text-left">
                {descripcion}
              </div>

              <div className="font-semibold text-left">
                Fecha fin:
              </div>

              <div className="text-left">
                {fechaFin
                  ? new Date(fechaFin).toLocaleDateString("es-BO")
                  : "Actualidad"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ───────── LÍNEA EXTERNA ───────── */}
      <div
        className={`
          mt-4
          border-b

          ${
            disabled
              ? "border-dark-200"
              : "border-gray-300"
          }
        `}
      />

    </div>
  );
}