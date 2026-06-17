import React, { useEffect, useState } from "react";
import DashboardLayout from "@/layout/DashboardLayout";
import { Banner } from "@/components/Banner";
import { ConfiguracionGeneral } from "@/features/configuracion/components/ConfiguracionGeneral";
import { ClassicPreview } from "@/features/configuracion/components/ClassicPreview";
import { MinimalistaPreview } from "@/features/configuracion/components/MinimalistaPreview";
import { PastelPreview } from "@/features/configuracion/components/PastelPreview";
import { ProfesionalPreview } from "@/features/configuracion/components/ProfesionalPreview";
import {
  Sparkles,
  Palette,
  LayoutTemplate,
  Crown,
  BadgeCheck
} from "lucide-react";

import {
  getConfiguracionPortafolio,
  actualizarConfiguracion,
} from "@/features/plantillas/api/configuracionApi";

import type { TipoPlantilla } from "@/features/plantillas/types";

export default function CambiarPlantilla() {
  const [plantillaActual, setPlantillaActual] =
    useState<TipoPlantilla>("predeterminado");

  const [cargando, setCargando] = useState(true);
  const [guardandoPlantilla, setGuardandoPlantilla] = useState<TipoPlantilla | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarConfiguracion = async () => {
      try {
        setCargando(true);

        const config = await getConfiguracionPortafolio();

        setPlantillaActual(
          config?.plantilla || "predeterminado"
        );
      } catch (err: any) {
        console.error(err);

        setError(
          err?.message ||
            "No se pudo cargar la configuración."
        );
      } finally {
        setCargando(false);
      }
    };

    cargarConfiguracion();
  }, []);

  const seleccionarPlantilla = async (
    plantilla: TipoPlantilla
  ) => {
    if (plantilla === plantillaActual) return;

    try {
      setGuardandoPlantilla(plantilla);
      setError(null);

      await actualizarConfiguracion({
        plantilla,
      });

      setPlantillaActual(plantilla);
    } catch (err: any) {
      console.error(err);

      setError(
        err?.message ||
          "No se pudo actualizar la plantilla."
      );
    } finally {
      setGuardandoPlantilla(null);
    }
  };

  const PLANTILLAS = [
    {
      id: "predeterminado" as TipoPlantilla,
      nombre: "Clásica",
      badge: "PREDETERMINADA",
      icono: LayoutTemplate,
      premium: true,
      preview: <ClassicPreview />,
    },

    {
      id: "minimalista" as TipoPlantilla,
      nombre: "Minimalista",
      badge: "NUEVO",
      icono: Sparkles,
      premium: true,
      preview: <MinimalistaPreview />,
    },

    {
      id: "profesional" as TipoPlantilla,
      nombre: "Profesional",
      badge: "NUEVO",
      icono: Crown,
      premium: true,
      preview: <ProfesionalPreview />,
    },

    {
      id: "stiloPastel" as TipoPlantilla,
      nombre: "Estilo Pastel",
      badge: "NUEVO",
      icono: Palette,
      premium: true,
      preview: <PastelPreview />,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">

        <Banner
          titulo="Plantillas"
          descripcion="Personaliza la estructura y el impacto visual de tu marca personal. Cambia el diseño de tu portafolio con un solo clic."
        />

        <ConfiguracionGeneral titulo="Plantillas">

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {cargando ? (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-85 rounded-4xl bg-white animate-pulse border"
                />
              ))}
            </div>
          ) : (
            <>
              <div className="flex items-end mb-6">

                <span className="text-xs font-bold text-left text-gray-400">
                  {PLANTILLAS.length} plantillas
                </span>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">

                {PLANTILLAS.map((plantilla) => {
                  const activa =
                    plantillaActual === plantilla.id;

                  const Icono = plantilla.icono;

                  return (
                    <div
                      key={plantilla.id}
                      className={` bg-white rounded-4xl border shadow-sm p-6 transition-all duration-300 hover:shadow-lg relative overflow-hidden
                        ${
                          activa
                            ? "border-primary-500 ring-2 ring-blue-100"
                            : "border-gray-200"
                        }
                      `}
                    >
                      <div className="absolute top-5 right-5">

                        <span
                          className={`
                            px-3
                            py-1
                            rounded-full
                            text-[10px]
                            font-black
                            tracking-wider
                            ${
                              plantilla.premium
                                ? "bg-amber-100 text-amber-700"
                                : "bg-blue-50 text-primary-500"
                            }
                          `}
                        >
                          {plantilla.badge}
                        </span>

                      </div>

                      <div className="mb-6">
                        {plantilla.preview}
                      </div>

                      <div className="space-y-3">

                        <div className="flex items-center gap-2">

                          <Icono
                            size={18}
                            className="text-primary-500"
                          />

                          <h4 className="text-lg font-black text-gray-800">
                            {plantilla.nombre}
                          </h4>

                          {activa && (
                            <BadgeCheck
                              size={16}
                              className="text-green-500"
                            />
                          )}
                        </div>

                        <div className="pt-4">

                          {activa ? (
                            <div
                              className=" w-full py-3 rounded-2xl bg-green-50 border border-green-200 text-green-600 font-black text-center items-center justify-center flex gap-2 " >
                              <BadgeCheck size={20} />
                               Plantilla Activa
                            </div>
                          ) : (
                            <button
                              disabled={guardandoPlantilla !== null}
                              onClick={() =>
                                seleccionarPlantilla(
                                  plantilla.id
                                )
                              }
                              className=" w-full py-3 rounded-2xl bg-primary-500 text-white font-black transition-all hover:bg-[#243a86]">
                              {guardandoPlantilla === plantilla.id
                                ? "Guardando..."
                                : "Seleccionar"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </ConfiguracionGeneral>
      </div>
    </DashboardLayout>
  );
}