import { DropdownCertificaciones } from "@/features/certificaciones/components/DropdownCertificaciones";
import { useState } from "react";

interface Props {
  titulo: string;
}

interface Option {
  label: string;
  value: string;
}

export function ConfiguracionGeneral({ titulo }: Props) {
  const [selected, setSelected] = useState<Option | null>(null);
  const [error, setError] = useState(false);

  const opciones: Option[] = [
    { label: "Público", value: "publico" },
    { label: "Privado", value: "privado" },
  ];

  const handleChange = (option: Option) => {
    setSelected(option);
    setError(false);
  };

  return (
    <div>
      <h3 className="text-2xl text-dark-500 font-medium-ui text-left flex flex-wrap items-center gap-2 py-1">{titulo}</h3>
      <div className="w-full p-4 border rounded-xl bg-gray-50">
        <DropdownCertificaciones
          titulo="Visibilidad portafolio" // ya usamos el título arriba
          opciones={opciones}
          placeholder="Seleccionar modo de visibilidad"
          value={selected}
          onChange={handleChange}
          error={error}
        />
      </div>
    </div>
  );
}