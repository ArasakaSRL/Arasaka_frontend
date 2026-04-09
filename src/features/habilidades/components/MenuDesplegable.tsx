import { CircleChevronDown } from "lucide-react";

export interface MenuDesplegable {
  label: string;
  value: string;
}

interface Props {
  value?: string;
  onChange: (value: string) => void;
  options: MenuDesplegable[];
  placeholder?: string;
  disabled?: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

export default function MenuDesplegable({
  value,
  onChange,
  options,
  placeholder = "Selecciona una opción",
  disabled = false,
  isOpen,
  onToggle,
}: Props) {

  const selected = options.find((o) => o.value === value);

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
        <span className={selected ? "text-gray-600" : "text-gray-400"}>
          {selected ? selected.label : placeholder}
        </span>

        <CircleChevronDown className="text-gray-400"/>
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 w-full bg-light-500 border border-gray-300 rounded-xl shadow-lg max-h-36 overflow-y-auto">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                onToggle();
              }}
              className="w-full text-left px-3 py-2 text-sm text-black hover:bg-[#D4DBE2] cursor-pointer"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}