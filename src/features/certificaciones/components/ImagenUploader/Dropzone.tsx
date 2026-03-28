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
      className="border-2 border-dashed border-gray-400 p-10 text-center cursor-pointer"
    >
      <p>Arrastrar la foto aquí</p>
      <p>o</p>
      <button className="border px-4 py-2 mt-2">
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