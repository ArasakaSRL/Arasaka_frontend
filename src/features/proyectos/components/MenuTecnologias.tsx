import { useEffect, useMemo, useRef, useState } from "react";
import { CircleChevronDown } from "lucide-react";

type Option = {
  label: string;
  value: string;
};

type TecnologiaCreada = {
  id_tecnologia: string;
  nombre: string;
  descripcion: string | null;
  logo: string | null;
};

type Props = {
  mode: "single" | "multiple";
  value?: string;
  values?: string[];
  onChange: (value: string | string[]) => void;
  options: Option[];
  agregarTecnologia: (
    nombre: string
  ) => Promise<TecnologiaCreada | null>;
  disabled?: boolean;
};

export default function TecnologiasSelector({
  mode,
  value,
  values = [],
  onChange,
  options,
  agregarTecnologia,
  disabled = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  
  const [error, setError] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const isMultiple = mode === "multiple";

  const selectedValues = isMultiple
    ? values
    : value
    ? [value]
    : [];

  const filteredOptions = useMemo(() => {
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  const existeTecnologia = options.some(
    (opt) => opt.label.toLowerCase() === search.trim().toLowerCase()
  );

  const handleSelect = (selectedValue: string) => {
    if (!isMultiple) {
      onChange(selectedValue);
      setIsOpen(false);
      setSearch("");
      return;
    }

    const exists = values.includes(selectedValue);

    if (exists) {
      onChange(
        values.filter((v) => v !== selectedValue)
      );
    } else {
      onChange([
        ...values,
        selectedValue,
      ]);
    }
  };

  const handleCreate = async () => {
    const nombre = search.trim();

    if (!nombre) return;
    if (nombre.length > 50) {
      setError(
        "La tecnología no puede superar los 50 caracteres"
      );
      return;
    }
    
    try {
      setCreating(true);

      const nuevaTecnologia = await agregarTecnologia(nombre);

      if (!nuevaTecnologia) return;

      if (isMultiple) {
        onChange([
          ...values,
          nuevaTecnologia.id_tecnologia,
        ]);
      } else {
        onChange(
          nuevaTecnologia.id_tecnologia
        );

        setIsOpen(false);
      }
      setSearch("");
    } finally {
      setCreating(false);
    }
  };

  const textoSeleccionado = () => {
    if (!isMultiple) {
      const seleccionada = options.find(
        (o) => o.value === value
      );

      return (
        seleccionada?.label ??
        "Selecciona una opción"
      );
    }

    if (values.length === 0) {
      return "Selecciona una opción";
    }

    if (values.length === 1) {
      const seleccionada = options.find(
        (o) => values.includes(o.value)
      );

      return seleccionada?.label ?? "";
    }

    return `${values.length} seleccionados`;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node
        )
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <>
    <div className="relative" ref={containerRef}>
      <div
        className={`
          w-full flex items-center justify-between
          px-3 py-2 rounded-xl border
          bg-white border-gray-300 focus:ring-1 hover:border-blue-600 cursor-pointer
          ${disabled ? "opacity-50" : ""}
        `}
      >
        <input
          type="text"
          disabled={disabled}
          value={search}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            const value = e.target.value;

              setSearch(value);

              if (value.length > 50) {
                setError(
                  "La tecnología no puede superar los 50 caracteres"
                );
              } else {
                setError("");
              }

              if (!isOpen) {
                setIsOpen(true);
            }
          }}
          placeholder={textoSeleccionado()}
          className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-gray-400"
        />

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="ml-2"
        >
          <CircleChevronDown
            className={`transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg max-h-39 overflow-y-auto">

          {search.trim() && !existeTecnologia && search.trim().length <= 50 && (
            <div
              onClick={handleCreate}
              className=" flex items-center gap-2 px-3 py-3 text-blue-600 text-[14px] cursor-pointer hover:bg-[#D4DBE2] border-b"
            >
              {creating ? (
                  <div className="w-4 h-4 border-2 border-blue-200 border-t-primary-500 rounded-full animate-spin" />
              ) : (
                <>
                  <span className="text-sm">+</span>
                  <span>Agregar "{search}" como nueva tecnología</span>
                </>
              )}
            </div>
          )}

          {filteredOptions.map((opt) => (
            <div
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className="
                flex items-center gap-2
                px-3 py-2
                text-sm
                hover:bg-[#D4DBE2]
                cursor-pointer
              "
            >
            {isMultiple && (
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(
                      opt.value
                    )}
                    readOnly
                  />
                )}
              {opt.label}
            </div>
          ))}

          {filteredOptions.length === 0 &&
            (existeTecnologia || !search.trim()) && (
              <div className="px-3 py-2 text-sm text-gray-500">
                No se encontraron resultados
              </div>
            )}
        </div>
      )}
    </div>
    {error && (
      <p className="text-red-500 text-xs mt-1 ml-1">
        {error}
      </p>
    )}
    </>
  );
}