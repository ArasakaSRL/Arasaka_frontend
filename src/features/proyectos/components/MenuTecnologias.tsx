import { useState } from "react";
import { CircleChevronDown } from "lucide-react";

export interface Option {
  label: string;
  value: string;
}

interface Props {
  values: string[];
  onChange: (values: string[]) => void;
  options: Option[];
  placeholder?: string;
  loading?: boolean;
}

export default function DropdownCheckbox({
  values,
  onChange,
  options,
  placeholder = "Selecciona tecnologías",
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const toggleOption = (value: string) => {
    if (values.includes(value)) {
      onChange(values.filter((v) => v !== value));
    } else {
      onChange([...values, value]);
    }
  };

  const filteredOptions = options.filter((opt) =>
    opt.label?.toLowerCase().includes(search.toLowerCase())
  );

  const selectedLabels = options
    .filter((o) => values.includes(o.value))
    .map((o) => o.label);

  const getDisplayText = () => {
    if (values.length === 0) return placeholder;
    if (values.length === 1) return selectedLabels[0];
    return `${values.length} seleccionados`;
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 text-[14px] 
        rounded-xl border border-gray-300 bg-white 
        focus-within:ring-1 focus-within:ring-blue-600 transition-all"
      >
        <span className={values.length ? "text-gray-600" : "text-gray-400"}>
          {getDisplayText()}
        </span>

        <CircleChevronDown />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-light-500 border border-gray-300 rounded-xl shadow-lg max-h-48 overflow-y-auto">
          
          <div className="p-2 border-b">
            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 px-3 py-2 text-sm text-black hover:bg-[#D4DBE2] cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={values.includes(opt.value)}
                  onChange={() => toggleOption(opt.value)}
                />
                {opt.label}
              </label>
            ))
          ) : (
            <p className="text-sm text-gray-500 px-3 py-2">
              No se encontraron resultados
            </p>
          )}
        </div>
      )}
    </div>
  );
}