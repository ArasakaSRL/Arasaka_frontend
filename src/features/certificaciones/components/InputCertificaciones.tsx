import { useState } from "react";

interface Props {
  titulo: string;
  tamMax: number;
  placeHolder?: string;
  height?: number;
}

export function InputCertificaciones({
  titulo,
  tamMax,
  placeHolder = "",
  height = 30,
}: Props) {
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= tamMax) {
      setValue(e.target.value);
    }
  };

  return (
    <section className="w-60 flex flex-col gap-1">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold text-gray-700">
          {titulo}
        </label>

        <span
          className={`text-xs ${
            value.length > tamMax * 0.8
              ? "text-red-500"
              : "text-gray-400"
          }`}
        >
          {value.length}/{tamMax}
        </span>
      </div>

      {/* Input */}
      <textarea
        value={value}
        onChange={handleChange}
        placeholder={placeHolder}
        style={{ height: `${height}px` }}
        className="
          w-full border border-gray-300 rounded-md text-sm
          px-4 py-2 resize-none overflow-y-auto
          focus:outline-none focus:ring-2 focus:ring-blue-500
        "
      />
    </section>
  );
}