import { useRef } from "react";

type Props = {
  onFileSelect: (file: File) => void;
};

export function Dropzone({ onFileSelect }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Solo imágenes");
      return;
    }

    onFileSelect(file);
  };

  return (
    <div
  onDragOver={(e) => e.preventDefault()}
  onDrop={(e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files?.[0]);
  }}
  onClick={() => inputRef.current?.click()}
  className="
    w-full h-full min-h-[300px] 
    border-2 border-dashed border-gray-300 rounded-lg
    rounded-xl
    flex flex-col items-center justify-center h-full 
    text-center cursor-pointer
    hover:border-blue-500 transition
  "
>
  <p className="text-gray-500">Arrastrar la foto aquí</p>
  <p className="text-gray-400">o</p>

  <button className="border px-4 py-2 mt-2 rounded-md hover:bg-gray-100">
    Seleccionar foto
  </button>

  <input
    ref={inputRef}
    type="file"
    className="hidden"
    onChange={(e) => handleFile(e.target.files?.[0])}
  />
</div>
  );
}