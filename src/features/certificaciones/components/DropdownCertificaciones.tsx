import { useEffect, useRef, useState } from "react";
import { CircleChevronDown } from "lucide-react";

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
  error?: boolean;
}

export function DropdownCertificaciones({
  titulo,
  opciones,
  placeholder = "Selecciona una opción",
  tamMax,
  value,      
  onChange,  
  error,
}: Props) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const handleSelect = (option: Option) => {
    if (onChange) onChange(option);
    setOpen(false);
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  return (
    <section className="flex flex-col gap-1.5 w-full relative">

      {/* LABEL */}
      <div className="flex justify-between items-center">
        <label className="flex items-center gap-1.5 text-black font-semibold text-[14px] w-full text-left">
          {titulo}
          <span className="text-red-500">*</span>
        </label>

        {tamMax && (
          <span className="text-[11px] text-gray-400 mr-1">
            {value ? value.label.length : 0}/{tamMax}
          </span>
        )}
      </div>

      {/* INPUT STYLE */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className={`
          w-full flex items-center justify-between px-3 py-2 text-[14px]
          rounded-xl border transition-all
          ${error 
            ? "border-red-500 focus-within:ring-1 focus-within:ring-red-500" 
            : "border-gray-300 focus-within:ring-1 focus-within:ring-blue-600"
          }
          bg-white cursor-pointer
        `}
      >
        <span className={value ? "text-gray-600" : "text-gray-400"}>
          {value ? value.label : placeholder}
        </span>

        <CircleChevronDown
          size={18}
          className={`text-gray-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* ERROR MESSAGE (Actualizado) */}
      {error && (
        <p className="text-red-600 text-[12px] text-left w-full animate-in fade-in slide-in-from-top-1">
          Este campo es obligatorio
        </p>
      )}

      {/* OPTIONS */}
      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute z-50 top-[calc(100%+4px)] w-full bg-white border border-gray-300 rounded-xl shadow-lg max-h-36 overflow-y-auto scrollbar-hide"
        >
          {opciones.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option)}
              className={`
                w-full text-left px-3 py-2 text-sm text-black
                hover:bg-[#D4DBE2] cursor-pointer
                ${value?.value === option.value ? "bg-blue-100 text-black" : ""}
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}