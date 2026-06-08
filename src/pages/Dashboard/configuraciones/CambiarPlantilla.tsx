import React, { useEffect, useState } from "react";
import DashboardLayout from "@/layout/DashboardLayout";
import { Banner } from "@/components/Banner";
import { ConfiguracionGeneral } from "@/features/configuracion/components/ConfiguracionGeneral";
import Dropdown from "@/components/MenuDesplegable";

// APIs y Tipos
import { getConfiguracionPortafolio, actualizarConfiguracion } from "@/features/plantillas/api/configuracionApi";
import type { TipoPlantilla } from "@/features/plantillas/types";

export default function CambiarPlantilla() {
  const [plantillaActual, setPlantillaActual] = useState<TipoPlantilla | "">("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  // NUEVO: Estados para manejar el feedback visual del usuario
  const [error, setError] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState(false);

  const opcionesPlantillas: { label: string; value: string }[] = [
    { label: "Clásica / Predeterminada", value: "predeterminado" },
    { label: "Minimalista (Plantilla 1)", value: "minimalista" },
    { label: "Profesional (Plantilla 2)", value: "profesional" },
    { label: "Estilo Pastel (Plantilla 3)", value: "stiloPastel" },
  ];

  // 1. OBTENER DATOS (GET)
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setCargando(true);
        setError(null);
        
        // Aquí se ejecuta tu API (getConfiguracionPortafolio)
        const config = await getConfiguracionPortafolio();
        
        // Asignamos la plantilla que viene de Laravel. Si por alguna razón es null, usamos predeterminado.
        setPlantillaActual(config?.plantilla || "predeterminado");
        
      } catch (err: any) {
        console.error("Error al cargar la configuración", err);
        setError(err.message || "No se pudo cargar la configuración actual.");
      } finally {
        setCargando(false);
      }
    };

    fetchConfig();
  }, []);

  // 2. ACTUALIZAR DATOS (PUT/PATCH)
  const handleChangePlantilla = async (valor: string) => {
    const nuevaPlantilla = valor as TipoPlantilla;
    if (nuevaPlantilla === plantillaActual) return;

    try {
      setGuardando(true);
      setError(null);
      setMensajeExito(false);

      // Aquí se ejecuta tu API (actualizarConfiguracion)
      await actualizarConfiguracion({ plantilla: nuevaPlantilla });
      
      // Si todo sale bien, actualizamos el estado y mostramos mensaje de éxito
      setPlantillaActual(nuevaPlantilla);
      setMensajeExito(true);
      
      // Ocultamos el mensaje de éxito después de 3 segundos
      setTimeout(() => setMensajeExito(false), 3000);

    } catch (err: any) {
      console.error("Error al guardar la plantilla", err);
      setError(err.message || "Hubo un problema al guardar los cambios.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Banner 
          titulo="Cambiar Plantilla del Portafolio" 
          descripcion="Selecciona el diseño visual que prefieras para tu portafolio público."
        />
        
        <ConfiguracionGeneral titulo="Plantillas">
          <div className="max-w-md">
            <p className="text-sm text-gray-500 mb-4">
              Elige cómo quieres que los visitantes vean tu información.
            </p>

            {/* Manejo de errores globales (ej: no hay portafolio seleccionado en Zustand) */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            {cargando ? (
              <div className="text-sm text-gray-400 animate-pulse">
                Cargando tu configuración...
              </div>
            ) : (
              <div className="space-y-2">
                <Dropdown
                  mode="single"
                  options={opcionesPlantillas}
                  value={plantillaActual}
                  onChange={handleChangePlantilla}
                  isOpen={isOpen}
                  onToggle={() => setIsOpen(!isOpen)}
                  disabled={guardando}
                  placeholder="Selecciona una plantilla"
                />
                
                {/* Feedback dinámico: Guardando vs Éxito */}
                <div className="h-5 ml-1 mt-1">
                  {guardando && (
                    <p className="text-xs text-blue-600 animate-pulse">
                      Guardando cambios...
                    </p>
                  )}
                  {!guardando && mensajeExito && (
                    <p className="text-xs text-green-600 font-medium transition-opacity">
                      ¡Plantilla actualizada con éxito!
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </ConfiguracionGeneral>
      </div>
    </DashboardLayout>
  );
}