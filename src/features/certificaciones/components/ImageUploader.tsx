import { useState, useRef, useEffect } from "react";

export function ImageUploader() {
  const [imagen, setImagen] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!imagen) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(imagen);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [imagen]);

  const manejarArchivo = (archivo?: File) => {
    if (archivo && archivo.type.startsWith("image/")) {
      setImagen(archivo);
    }
  };

  const manejarSeleccion = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    manejarArchivo(archivo);
  };

  const manejarDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const archivo = e.dataTransfer.files?.[0];
    manejarArchivo(archivo);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={manejarSeleccion}
        className="hidden"
      />

      {!previewUrl ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={manejarDrop}
          className="border-2 border-dashed border-gray-400 rounded-lg p-10 text-center hover:border-blue-500 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <p className="text-gray-600">Arrastrar la foto aquí</p>
          <p className="my-2">o</p>
          <button
            type="button"
            className="bg-white border border-gray-300 px-4 py-2 mt-2 rounded shadow-sm hover:bg-gray-50"
          >
            Seleccionar foto
          </button>
        </div>
      ) : (
        <div className="relative group">
          <img
            src={previewUrl}
            alt="Vista previa"
            className="max-w-xs h-auto rounded-lg shadow-md"
          />
          <button
            onClick={() => setImagen(null)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}