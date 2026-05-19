import { CircleStar, CircleX } from "lucide-react";
import { toast } from "../../../components/Alerta";
import { useState } from "react";

type Imagen = {
  file?: File;
  preview: string;
  url?: string;
  isNew?: boolean;
};

interface Props {
  imagenes: Imagen[];
  setImagenes: React.Dispatch<React.SetStateAction<Imagen[]>>;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export default function UploaderImagenes({
  imagenes,
  setImagenes,
  errors,
  setErrors,
}: Props) {
  const MAX_IMAGES = 5 * 1024 * 1024;
  const [drag, setDrag] = useState(false);

  const handleAddImages = (files: File[]) => {
    const validas: Imagen[] = [];

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.warning(`"${file.name}" no es una imagen válida`, 3000);
        return;
      }

      if (file.size > MAX_IMAGES) {
        toast.warning(`"${file.name}" supera los 5MB`, 3000);
        return;
      }

      validas.push({
        file,
        preview: URL.createObjectURL(file),
        isNew: true,
      });
    });

    if (validas.length === 0) return;

    setImagenes((prev) => [...prev, ...validas].slice(0, 5));

    setErrors((prev) => ({
      ...prev,
      imagenes: "",
    }));
  };

  const eliminarImagen = (index: number) => {
    setImagenes((prev) => {
      const copia = [...prev];

      const eliminada = copia[index];

      if (eliminada.isNew) {
        URL.revokeObjectURL(eliminada.preview);
      }

      copia.splice(index, 1);

      return copia;
    });
  };

  const hacerPortada = (index: number) => {
    setImagenes((prev) => {
      const copia = [...prev];

      const [img] = copia.splice(index, 1);

      copia.unshift(img);

      return copia;
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDrag(false);
    const files = Array.from(e.dataTransfer.files);
    handleAddImages(files);
  };

  return (
    <div className="flex-1 flex flex-col">
      <div onDragOver={(e) => {e.preventDefault();}} 
      onDragEnter={(e) => {e.preventDefault(); 
        setDrag(true);}} 
        onDragLeave={() => setDrag(false)} 
        onDrop={handleDrop} 
        className={` w-full border-2 border-dashed rounded-xl min-h-80 flex flex-col items-center justify-center text-center p-6 transition-color hover:border-blue-600 cursor-pointer
          ${
            drag
              ? "border-primary-500 bg-primary-50"
              : "border-gray-300"
          }
        `}>
        <p className="text-gray-500 text-sm mb-2">
          Arrastra las imágenes aquí
        </p>

        <p className="text-gray-400 text-xs mb-4">o</p>

        <label className="px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-100 text-sm">
          Seleccionar imágenes

          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const files = e.target.files
                ? Array.from(e.target.files)
                : [];

              handleAddImages(files);
            }}
          />
        </label>

        <p className="text-xs text-gray-400 mt-4">
          Máximo 5 imágenes
        </p>
      </div>

      {imagenes.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          {imagenes.map((img, index) => (
            <div
              key={index}
              className="relative rounded-lg overflow-hidden border"
            >
              <img
                src={img.preview}
                alt="preview"
                className="w-full h-24 object-cover"
              />

              {index === 0 && (
                <span className="absolute top-1 left-1 text-yellow-500">
                  <CircleStar size={20} />
                </span>
              )}

              <button
                type="button"
                onClick={() => eliminarImagen(index)}
                className="absolute top-1 right-1 bg-black/60 text-white text-xs px-1 rounded hover:bg-black/80"
              >
                <CircleX size={16} />
              </button>

              {index !== 0 && (
                <button
                  type="button"
                  onClick={() => hacerPortada(index)}
                  className="absolute bottom-1 left-1 bg-white rounded-full hover:bg-gray-200"
                >
                  <CircleStar
                    size={20}
                    className="text-primary-500"
                  />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {errors.imagenes && (
        <p className="text-red-500 text-xs mt-2">
          {errors.imagenes}
        </p>
      )}
    </div>
  );
}