import { CircleChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

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

  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  // calcular posición del botón
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();

      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen]);

  return (
    <div className="relative">
      {/* BOTÓN */}
      <button
        ref={buttonRef}
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

        <CircleChevronDown className="text-gray-400" />
      </button>

      {/* DROPDOWN EN PORTAL */}
      {isOpen &&
        !disabled &&
        createPortal(
          <div
            style={{
              position: "absolute",
              top: position.top,
              left: position.left,
              width: position.width,
            }}
            className="z-[9999] bg-white border border-gray-300 rounded-xl shadow-lg max-h-40 overflow-y-auto"
          >
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
          </div>,
          document.body
        )}
    </div>
  );
}