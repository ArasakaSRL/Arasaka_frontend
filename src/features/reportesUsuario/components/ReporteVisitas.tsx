import { useState } from "react";
import { BarChartVisitas } from "./BarChartVisitas";
import { LineChart } from "./LineChart";

interface Props {
  visitasPorMes: {
    mes: string;
    visitas: number;
  }[];

  crecimientoMensual: {
    mes: string;
    visitas: number;
  }[];
}

export function ReporteVisitas({
  visitasPorMes,
  crecimientoMensual,
}: Props) {
  const [tipoReporte, setTipoReporte] = useState<
    "visitas" | "crecimiento"
  >("visitas");

  return (
    <div className="w-fit max-w-full">
      {/* Encabezado: título a la izquierda, selector alineado con el borde derecho del marco */}
      <div className="flex items-center justify-between gap-4 mb-3">
        <h3 className="font-semibold text-slate-700">
          Reporte de Visitas
        </h3>

        <div className="relative inline-block">
          <select
            value={tipoReporte}
            onChange={(e) =>
              setTipoReporte(
                e.target.value as "visitas" | "crecimiento"
              )
            }
            className="appearance-none bg-white border border-slate-200 rounded-full pl-4 pr-9 py-2 text-sm font-medium text-slate-600 shadow-sm cursor-pointer transition-colors hover:border-indigo-300 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
          >
            <option value="visitas">
              Estadísticas de Visitas
            </option>

            <option value="crecimiento">
              Crecimiento Mensual
            </option>
          </select>

          {/* Flecha personalizada */}
          <svg
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>

      {/* Marco ajustado al tamaño del SVG (600x300 + padding + borde) */}
      <div className="overflow-x-auto max-w-full">
        <div className="bg-white rounded-xl border p-4 inline-block">
          {tipoReporte === "visitas" ? (
            <BarChartVisitas data={visitasPorMes} />
          ) : (
            <LineChart
              data={crecimientoMensual.map((d) => ({
                x: d.mes,
                y: d.visitas,
              }))}
            />
          )}
        </div>
      </div>
    </div>
  );
}