import { DropdownCertificaciones } from "@/features/certificaciones/components/DropdownCertificaciones";
import { useState } from "react";

interface Props {
  titulo: string;
}

interface Option {
  label: string;
  value: string;
}

export function VisibilidadPortafolio({ titulo }: Props) {
  const [selected, setSelected] = useState<Option | null>(null);
  const [error, setError] = useState(false);

  const opciones: Option[] = [
    { label: "Público", value: "publico" },
    { label: "Privado", value: "privado" },
    { label: "Solo contactos", value: "contactos" },
  ];

  const handleChange = (option: Option) => {
    setSelected(option);
    setError(false);
  };

  return (
    <div className="w-full p-4 border rounded-xl bg-gray-50">

      <DropdownCertificaciones
        titulo={titulo} // ya usamos el título arriba
        opciones={opciones}
        placeholder="Seleccionar modo de visibilidad"
        value={selected}
        onChange={handleChange}
        error={error}
      />
    </div>
  );
}