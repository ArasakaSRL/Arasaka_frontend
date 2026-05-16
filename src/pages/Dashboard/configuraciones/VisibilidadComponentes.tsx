import { useEffect, useState } from "react";

import DashboardLayout from "@/layout/DashboardLayout";
import { Banner } from "@/components/Banner";
import { Boton2 } from "@/components/ui/Boton2";
import { toast } from "@/components/Alerta";

import {
  actualizarConfiguracion,
  getConfiguracion,
} from "@/features/configuracion/apis/configuracionApi";

import type {
  ActualizarConfiguracionDTO,
  ConfiguracionPortafolio,
} from "@/features/configuracion/types/index";
import { ConfiguracionGeneral } from "@/features/configuracion/components/ConfiguracionGeneral";
import { SwitchVisibilidad } from "@/features/configuracion/components/SwitchVisibilidad";

export default function VisibilidadComponentes() {
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
    fetchDatos();
  }, []);

  const handleToggle = (
    campo: keyof ConfiguracionPortafolio,
    valor: boolean
  ) => {
    setConfig((prev) =>
      prev
        ? {
            ...prev,
            [campo]: valor,
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

  return (
    <DashboardLayout>
      <div className="space-y-6">

        <Banner
          titulo="Visibilidad de Componentes"
          descripcion=""
        />

        <ConfiguracionGeneral titulo="Visibilidad Componentes">
          <div className="space-y-4"> 
            <SwitchVisibilidad
              nombre="Proyectos"
              value={config.mostrar_proyectos}
              onChange={(val) => handleToggle("mostrar_proyectos", val)}
            />
            <SwitchVisibilidad
              nombre="Habilidades"
              value={config.mostrar_habilidades}
              onChange={(val) => handleToggle("mostrar_habilidades", val)}
            />
            <SwitchVisibilidad
              nombre="Experiencias"
              value={config.mostrar_experiencias}
              onChange={(val) => handleToggle("mostrar_experiencias", val)}
            />
            <SwitchVisibilidad
              nombre="Certificaciones"
              value={config.mostrar_certificaciones}
              onChange={(val) => handleToggle("mostrar_certificaciones", val)}
            />
          </div>
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