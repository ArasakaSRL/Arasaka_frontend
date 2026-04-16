import { useState, useEffect } from "react";
import { Banner } from "@/components/Banner";
import DashboardLayout from "@/layout/DashboardLayout";
import { ConfiguracionGeneral } from "../components/ConfiguracionGeneral";
import { DropdownCertificaciones } from "@/features/certificaciones/components/DropdownCertificaciones";
import { SwitchVisibilidad } from "../components/SwitchVisibilidad";
import { toast } from "@/components/Alerta";

import { actualizarConfiguracion, getConfiguracion } from "../apis/configuracionApi";
import { Boton2 } from "@/components/ui/Boton2";

import type {
  ActualizarConfiguracionDTO,
  ConfiguracionPortafolio,
} from "../types";

type Option = {
  label: string;
  value: string;
};

const opciones = [
  { label: "Público", value: "publico" },
  { label: "Privado", value: "privado" },
];

export default function Configuracion() {
  const [config, setConfig] = useState<ConfiguracionPortafolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // 🔥 Función reutilizable para cargar datos
  const fetchDatos = async () => {
    try {
      const data = await getConfiguracion();
      setConfig(data);
    } catch (error: any) {
      console.error("Error al cargar:", error);

      const mensaje =
        error?.response?.data?.message ||
        "Error al cargar la configuración";

      toast.error(mensaje);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, []);

  // 🔹 Manejo de switches
  const handleToggle = (
    campo: keyof ConfiguracionPortafolio,
    nuevoValor: boolean
  ) => {
    setConfig((prev) =>
      prev ? { ...prev, [campo]: nuevoValor } : prev
    );
  };

  // 🔹 Manejo dropdown
  const handleChangeDropdown = (option: Option | null) => {
    if (!option) return;

    const esVisible = option.value === "publico";

    setConfig((prev) =>
      prev ? { ...prev, visibilidad: esVisible } : prev
    );
  };

  // 🔹 Guardar cambios
  const handleGuardar = async () => {
    if (!config) return;

    setGuardando(true);

    try {
      const { id_configuracion_portafolio, ...datosAGuardar } = config;

      await actualizarConfiguracion(datosAGuardar as ActualizarConfiguracionDTO);
      await fetchDatos();

      toast.success("Cambios guardados correctamente");

    } catch (error: any) {
      console.error(error);

      const mensaje =
        error?.response?.data?.message ||
        "Error al guardar";

      toast.error(mensaje);

    } finally {
      setGuardando(false);
    }
  };

  // 🔹 Loading inicial
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64 text-gray-500">
          Cargando configuración...
        </div>
      </DashboardLayout>
    );
  }

  if (!config) return null;

  const selectedOption =
    opciones.find(
      (o) =>
        o.value === (config.visibilidad ? "publico" : "privado")
    ) || null;

  return (
    <DashboardLayout>
      <Banner titulo="Configuración del portafolio" descripcion="" />

      <ConfiguracionGeneral titulo="Visibilidad Componentes">
        <SwitchVisibilidad
          nombre="Proyectos"
          value={config.mostrar_proyectos}
          onChange={(val) =>
            handleToggle("mostrar_proyectos", val)
          }
        />
        <SwitchVisibilidad
          nombre="Habilidades"
          value={config.mostrar_habilidades}
          onChange={(val) =>
            handleToggle("mostrar_habilidades", val)
          }
        />
        <SwitchVisibilidad
          nombre="Experiencias"
          value={config.mostrar_experiencias}
          onChange={(val) =>
            handleToggle("mostrar_experiencias", val)
          }
        />
        <SwitchVisibilidad
          nombre="Certificaciones"
          value={config.mostrar_certificaciones}
          onChange={(val) =>
            handleToggle("mostrar_certificaciones", val)
          }
        />
      </ConfiguracionGeneral>

      <ConfiguracionGeneral titulo="Configuración General">
        <DropdownCertificaciones
          titulo="Visibilidad portafolio"
          opciones={opciones}
          value={selectedOption}
          onChange={handleChangeDropdown}
        />
      </ConfiguracionGeneral>

      {/* 🔹 Botón */}
      <div className="mt-8 flex justify-end">
        <Boton2 onClick={handleGuardar} disabled={guardando}>
          {guardando ? "Guardando..." : "Guardar Cambios"}
        </Boton2>
      </div>
    </DashboardLayout>
  );
}