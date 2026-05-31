import { useEffect, useState } from "react";
import { EyeOff, FileX, Info } from "lucide-react";

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
  const [mostrarConfirm, setMostrarConfirm] = useState(false);

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

  const CAMPOS_CONTENIDO: (keyof ConfiguracionPortafolio)[] = [
    "mostrar_proyectos",
    "mostrar_habilidades",
    "mostrar_experiencias",
    "mostrar_certificaciones",
    "mostrar_redes_profesionales",
    "mostrar_contacto",
  ];

  const todoOculto = config
    ? CAMPOS_CONTENIDO.every((k) => !config[k])
    : false;
  const cvOculto = config ? !config.mostrar_cv : false;

  const doGuardar = async () => {
    if (!config) return;
    setMostrarConfirm(false);
    setGuardando(true);
    try {
      const { id_configuracion_portafolio, ...datos } = config;
      await actualizarConfiguracion(datos as ActualizarConfiguracionDTO);
      toast.success("Configuración actualizada");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error al guardar");
    } finally {
      setGuardando(false);
    }
  };

  const handleGuardar = () => {
    if (!config) return;
    if (todoOculto) {
      setMostrarConfirm(true);
      return;
    }
    doGuardar();
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
   
      {mostrarConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <EyeOff size={20} className="text-red-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-base">¿Ocultar todos los componentes?</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Todos los componentes del portafolio quedarán ocultos para los visitantes. El portafolio se verá completamente vacío. ¿Está seguro de que desea continuar?
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setMostrarConfirm(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={doGuardar}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
              >
                Sí, guardar así
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">

        <Banner
          titulo="Visibilidad de Componentes"
          descripcion=""
        />

    
        {todoOculto && (
          <div className="flex items-start justify-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div>
              <p className="text-sm font-semibold text-red-700">Portafolio completamente vacío</p>
              <p className="text-xs text-red-500 mt-0.5">
                Todos los componentes están desactivados. Los visitantes verán un portafolio sin contenido.
              </p>
            </div>
          </div>
        )}

        <ConfiguracionGeneral titulo="Visibilidad Componentes">
          <div className="space-y-4">
            <div className="flex items-start gap-2 px-3 py-2.5 bg-blue-50 border border-blue-200 rounded-lg">
              <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                Las secciones que desactives <span className="font-semibold">tampoco aparecerán en el CV generado</span>. Esto aplica tanto al portafolio público como al PDF descargable.
              </p>
            </div>
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
            <SwitchVisibilidad
              nombre="Redes Profesionales"
              value={config.mostrar_redes_profesionales}
              onChange={(val) => handleToggle("mostrar_redes_profesionales", val)}
            />

          
            <div className="flex flex-col gap-1.5">
              <SwitchVisibilidad
                nombre="Descargar CV"
                value={config.mostrar_cv}
                onChange={(val) => handleToggle("mostrar_cv", val)}
              />
              {cvOculto && (
                <div className="flex items-center gap-2 ml-1 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                  <FileX size={14} className="text-amber-500 shrink-0" />
                  <p className="text-xs text-amber-700">
                    El botón de descarga no aparecerá en el portafolio público, y las secciones desactivadas tampoco se incluirán al generar el PDF desde el dashboard.
                  </p>
                </div>
              )}
            </div>

            <SwitchVisibilidad
              nombre="Contacto"
              value={config.mostrar_contacto}
              onChange={(val) => handleToggle("mostrar_contacto", val)}
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