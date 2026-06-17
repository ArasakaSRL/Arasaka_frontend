import { useEffect, useState } from "react";

import { Eye, EyeOff } from "lucide-react";

import DashboardLayout from "@/layout/DashboardLayout";
import { Banner } from "@/components/Banner";
import { DropdownCertificaciones } from "@/features/certificaciones/components/DropdownCertificaciones";
import { Boton2 } from "@/components/ui/Boton2";
import { toast } from "@/components/Alerta";
import { actualizarConfiguracion, getConfiguracion } from "@/features/configuracion/apis/configuracionApi";
import { useAuthStore } from "@/stores/authStore";


import type {
  ActualizarConfiguracionDTO,
  ConfiguracionPortafolio,
} from "@/features/configuracion/types/index";
import { ConfiguracionGeneral } from "@/features/configuracion/components/ConfiguracionGeneral";

type Option = {
  label: string;
  value: string;
};

const opciones = [
  { label: "Público", value: "publico" },
  { label: "Privado", value: "privado" },
];

export default function VisibilidadGeneral() {
  const idPortafolio = useAuthStore(s => s.portafolioSeleccionado?.id_portafolio)
  const [config, setConfig] =
    useState<ConfiguracionPortafolio | null>(null);

  const [mostrarConfirm, setMostrarConfirm] = useState(false);
  const [accionPendiente, setAccionPendiente] = useState<"publico" | "privado" | null>(null);

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const fetchDatos = async () => {
    try {
      const data = await getConfiguracion();
      setConfig(data);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Error al cargar configuración"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!idPortafolio) return
    fetchDatos();
  }, [idPortafolio]);

  const handleChangeDropdown = (option: Option | null) => {
    if (!option) return;

    setConfig((prev) =>
      prev
        ? {
            ...prev,
            visibilidad: option.value === "publico",
          }
        : prev
    );
  };

  const handleGuardar = () => {
    if (!config) return;

    setAccionPendiente(
      config.visibilidad ? "publico" : "privado"
    );

    setMostrarConfirm(true);
  };

  const doGuardar = async () => {
    if (!config) return;

    setMostrarConfirm(false);
    setGuardando(true);

    try {
      const { id_configuracion_portafolio, ...datos } = config;

      await actualizarConfiguracion(
        datos as ActualizarConfiguracionDTO
      );

      toast.success("Configuración actualizada");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
        "Error al guardar"
      );
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="h-64 flex items-center justify-center">
          Cargando...
        </div>
      </DashboardLayout>
    );
  }

  if (!config) return null;

  const selectedOption =
    opciones.find(
      (o) =>
        o.value ===
        (config.visibilidad ? "publico" : "privado")
    ) || null;

  return (
    <DashboardLayout>
      {mostrarConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 flex flex-col gap-4">

            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  accionPendiente === "privado"
                    ? "bg-red-100"
                    : "bg-green-100"
                }`}
              >
                {accionPendiente === "privado" ? (
                  <EyeOff size={20} className="text-red-500" />
                ) : (
                  <Eye size={20} className="text-green-500" />
                )}
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 text-base">
                  {accionPendiente === "privado"
                    ? "¿Ocultar portafolio?"
                    : "¿Publicar portafolio?"}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  {accionPendiente === "privado"
                    ? "El portafolio dejará de estar disponible para los visitantes que accedan mediante el enlace público."
                    : "El portafolio será visible para cualquier persona que tenga acceso al enlace público."}
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setMostrarConfirm(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50"
              >
                Cancelar
              </button>

              <button
                onClick={doGuardar}
                className={`px-4 py-2 rounded-xl text-sm font-semibold text-white ${
                  accionPendiente === "privado"
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                Confirmar
              </button>
            </div>

          </div>
        </div>
      )}
      <div className="space-y-6">

        <Banner
          titulo="Visibilidad General"
          descripcion=""
        />

        <ConfiguracionGeneral titulo="Configuración General">
          <DropdownCertificaciones
            titulo="Visibilidad portafolio"
            opciones={opciones}
            value={selectedOption}
            onChange={handleChangeDropdown}
          />
        </ConfiguracionGeneral>

        <div className="flex justify-end">
          <Boton2
            onClick={handleGuardar}
            disabled={guardando}
          >
            {guardando ? "Guardando..." : "Guardar Cambios"}
          </Boton2>
        </div>
      </div>
    </DashboardLayout>
  );
}