import { CircleChevronDown } from "lucide-react";
import React from "react";

export interface Option {
  label: string;
  value: string;
}

type BaseProps = {
  options: Option[];
  placeholder?: string;
  searchable?: boolean;
  disabled?: boolean;
  isOpen: boolean;
  onToggle: () => void;
};

type SingleProps = BaseProps & {
  mode: "single";
  value?: string;
  onChange: (value: string) => void;
};

type MultipleProps = BaseProps & {
  mode: "multiple";
  values: string[];
  onChange: (value: string[]) => void;
};

type Props = SingleProps | MultipleProps;

export default function Dropdown(props: Props) {
  const {
    options,
    placeholder = "Selecciona una opción",
    searchable = false,
    disabled = false,
    isOpen,
    onToggle,
  } = props;

  const isMultiple = props.mode === "multiple";

  const [search, setSearch] = React.useState("");

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (val: string) => {
    if (props.mode === "multiple") {
      const exists = props.values.includes(val);

      if (exists) {
        props.onChange(props.values.filter((v) => v !== val));
      } else {
        props.onChange([...props.values, val]);
      }
    } else {
      props.onChange(val);
      onToggle();
    }
  };

  const getDisplayText = () => {
    if (props.mode === "multiple") {
      if (!props.values.length) return placeholder;

      const selectedLabels = options
        .filter((o) => props.values.includes(o.value))
        .map((o) => o.label);

      if (props.values.length === 1) return selectedLabels[0];

      return `${props.values.length} seleccionados`;
    } else {
      const selected = options.find((o) => o.value === props.value);
      return selected?.label || placeholder;
    }
  };

  const hasValue =
    props.mode === "multiple"
      ? props.values.length > 0
      : Boolean(props.value);

  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-3 py-2 text-[14px] 
        rounded-xl border border-gray-300 bg-white 
        focus-within:ring-1 focus-within:ring-blue-600 transition-all
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span className={hasValue ? "text-gray-600" : "text-gray-400"}>
          {getDisplayText()}
        </span>

        <CircleChevronDown
          className={`transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 w-full bg-light-500 border border-gray-300 rounded-xl shadow-lg max-h-48 overflow-y-auto">
          
          {searchable && (
            <div className="p-2 border-b">
              <input
                type="text"
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          )}

          {/* 📋 Opciones */}
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <div
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-black hover:bg-[#D4DBE2] cursor-pointer"
              >
                {isMultiple && props.mode === "multiple" && (
                  <input
                    type="checkbox"
                    checked={props.values.includes(opt.value)}
                    readOnly
                  />
                )}

                {opt.label}
              </div>
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