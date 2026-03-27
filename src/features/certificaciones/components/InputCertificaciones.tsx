import { useState } from "react";

interface Props {
  tamMax: number;
  placeHolder: string;
  width?: number;
  height?: number;
}

export function InputCertificaciones({
  tamMax,
  placeHolder,
  width = 300,
  height = 30,
}: Props) {
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= tamMax) {
      setValue(e.target.value);
    }
  };

  return (
    <section style={{ width: `${width}px` }}>
      <textarea
        value={value}
        onChange={handleChange}
        placeholder={placeHolder}
        style={{ height: `${height}px` }}
        className="w-full border border-gray-300 rounded-md text-sm px-4 py-2 resize-none overflow-y-auto focus:outline-none focus:ring-2 focus:ring-blue-500 custom-scroll"
      />

      <div className="flex justify-end mt-1">
        <span
          className={`text-sm ${
            value.length > tamMax * 0.8
              ? "text-red-500"
              : "text-gray-500"
          }`}
        >
          {value.length}/{tamMax}
        </span>
      </div>
    </section>
  );
}