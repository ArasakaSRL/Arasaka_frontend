import { useState } from "react";
import { CircleChevronDown } from 'lucide-react';

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

  const toggleOption = (value: string) => {
    if (values.includes(value)) {
      onChange(values.filter((v) => v !== value));
    } else {
      onChange([...values, value]);
    }
  };

  const selectedLabels = options
    .filter((o) => values.includes(o.value))
    .map((o) => o.label);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm border border-primary-500 rounded-md bg-[#D4DBE2]"
      >
        <span className={values.length ? "text-black" : "text-gray-500"}>
          {values.length ? selectedLabels.join(", ") : placeholder}
        </span>

        <CircleChevronDown />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-light-500 border-primary-500 border rounded-md shadow-lg max-h-40 overflow-y-auto">
          {options.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 px-3 py-2 text-sm text-black hover:bg-[#D4DBE2] cursor-pointer "
            >
              <input
                type="checkbox"
                checked={values.includes(opt.value)}
                onChange={() => toggleOption(opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}