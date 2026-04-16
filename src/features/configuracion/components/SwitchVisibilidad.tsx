interface Props {
  nombre: string;
  value?: boolean;
  onChange?: (value: boolean) => void;
}

export function SwitchVisibilidad({ nombre, value = false, onChange }: Props) {
  const toggle = () => {
    if (onChange) onChange(!value);
  };

  return (
    <div className="w-full flex items-center justify-between border rounded-xl px-4 py-3 bg-gray-50">
      <span className="text-gray-600 text-[14px] font-medium">{nombre}</span>
      <button
        onClick={toggle}
        className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${value ? "bg-green-500" : "bg-gray-300"}`}
      >
        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-all duration-300 ${value ? "translate-x-6" : "translate-x-0"}`} />
      </button>
    </div>
  );
}