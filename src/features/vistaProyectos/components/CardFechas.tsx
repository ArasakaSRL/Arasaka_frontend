import { CalendarDays } from "lucide-react";

interface Props {
  inicio: string;
  fin: string;
}

export const CardFechas = ({
  inicio,
  fin,
}: Props) => {

  const formatearFecha = (
    fecha: string
  ) => {

    if (!fecha) return "Sin fecha";

    const [dia, mes, anio] =
      fecha.split("-");

    const fechaValida = new Date(
      Number(anio),
      Number(mes) - 1,
      Number(dia)
    );

    return fechaValida.toLocaleDateString(
      "es-BO",
      {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    );
  };

  return (
    <div
      className=" bg-indigo-900 text-white rounded-3xl p-5 flex justify-between
      "
    >
      <div className="flex gap-3 items-start">
        <CalendarDays size={20} />
        <div>
          <p className="text-xs uppercase font-semibold text-left">
            Inicio
          </p>
          <p>
            {formatearFecha(inicio)}
          </p>
        </div>
      </div>
      <div className="flex gap-3 items-start">
        <CalendarDays size={20} />
        <div>
          <p className="text-xs uppercase font-semibold text-left">
            Fin
          </p>

          <p>
            {formatearFecha(fin)}
          </p>
        </div>
      </div>
    </div>
  );
};