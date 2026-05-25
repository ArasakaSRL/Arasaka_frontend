import { useEffect, useState } from "react";

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

  const handleGuardar = async () => {
    if (!config) return;

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