import { useState } from "react";

interface Option {
  label: string;
  value: string;
}

interface Props {
  titulo: string;
  opciones: Option[];
  placeholder?: string;
  tamMax?: number; 
  value?: Option | null;             
  onChange?: (option: Option) => void; 
}

export function DropdownCertificaciones({
  titulo,
  opciones,
  placeholder = "Selecciona una opción",
  tamMax,
  value,      
  onChange,  
}: Props) {

  const [open, setOpen] = useState(false);

  const handleSelect = (option: Option) => {
    if (onChange) onChange(option); // Avisamos al padre
    setOpen(false);
  };

  return (
    <section className="w-60 flex flex-col gap-1 relative">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold text-gray-700">
          {titulo}
        </label>

        {tamMax && (
          <span className="text-xs text-gray-400">
            {value ? value.label.length : 0}/{tamMax}
          </span>
        )}
      </div>

      {/* Input tipo dropdown */}
      <div
        onClick={() => setOpen(!open)}
        className="
          w-full border border-gray-300 rounded-md text-sm
          px-4 py-2 cursor-pointer
          flex justify-between items-center
          bg-white
          focus-within:ring-2 focus-within:ring-blue-500
        "
      >
        <span className={`${value ? "text-gray-800" : "text-gray-400"}`}>
          {value ? value.label : placeholder}
        </span>

        <svg
          className={`w-4 h-4 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Opciones */}
      {open && (
        <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
          {opciones.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option)}
              className="
                px-4 py-2 text-sm cursor-pointer
                hover:bg-blue-50
              "
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}