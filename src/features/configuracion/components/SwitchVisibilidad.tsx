import { useState } from "react";

interface Props {
  nombre: string;
  value?: boolean;
  onChange?: (value: boolean) => void;
}

export function SwitchVisibilidad({ nombre, value = true, onChange }: Props) {
  const [activo, setActivo] = useState(value);

  const toggle = () => {
    const nuevoValor = !activo;
    setActivo(nuevoValor);
    if (onChange) onChange(nuevoValor);
  };

  return (
    <div className="w-full flex items-center justify-between border rounded-xl px-4 py-3 bg-gray-50">
      
      {/* TEXTO */}
      <span className="text-gray-600 text-[14px] font-medium">
        {nombre}
      </span>

      {/* SWITCH */}
      <button
        onClick={toggle}
        className={`
          w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300
          ${activo ? "bg-green-500" : "bg-gray-300"}
        `}
      >
        <div
          className={`
            w-4 h-4 bg-white rounded-full shadow-md transform transition-all duration-300
            ${activo ? "translate-x-6" : "translate-x-0"}
          `}
        />
      </button>
    </div>
  );
}