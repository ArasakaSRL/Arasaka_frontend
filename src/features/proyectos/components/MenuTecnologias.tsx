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
    opt.label.toLowerCase().includes(search.toLowerCase())
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
        className="w-full flex items-center justify-between px-3 py-2 text-sm border border-primary-500 rounded-md bg-[#D4DBE2]"
      >
        <span className={values.length ? "text-black" : "text-gray-500"}>
          {getDisplayText()}
        </span>

        <CircleChevronDown />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-light-500 border-primary-500 border rounded-md shadow-lg max-h-60 overflow-y-auto">
          
          <div className="p-2 border-b">
            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-2 py-1 text-sm border rounded-md outline-none"
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