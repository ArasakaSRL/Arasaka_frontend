import { useEffect, useState } from "react";
import type { HabilidadUI } from "../lib/HabilidadesApi";

interface TecnologiaOption {
  label: string;
  value: string;
}

export const useEditarHabilidad = (
  habilidadEditar?: HabilidadUI | null,
  tecnologias: TecnologiaOption[] = []
) => {

  const [formData, setFormData] = useState({
    categoria: "",
    nivel: "",
    tecnologia: "",
    habilidad: "",
  });

  const [datosIniciales, setDatosIniciales] = useState(formData);

  useEffect(() => {
    if (!habilidadEditar) return;

    const baseData = {
      categoria: habilidadEditar.categoria.toLowerCase(),
      nivel: habilidadEditar.nivel,
      tecnologia: "",
      habilidad: "",
    };

    const finalData = { ...baseData };

    if (habilidadEditar.categoria.toLowerCase() === "tecnica") {
      const tech = tecnologias.find(
        (t) =>
          t.label.toLowerCase() === habilidadEditar.nombre.toLowerCase()
      );

      finalData.tecnologia = tech?.value || "";
    } else {
      finalData.habilidad = habilidadEditar.nombre;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData(finalData);

    setDatosIniciales(finalData);

  }, [habilidadEditar, tecnologias]);

  const isDirty =
    JSON.stringify(formData) !== JSON.stringify(datosIniciales);

  return {
    formData,
    setFormData,
    isDirty,
  };
};