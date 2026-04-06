// src/features/certificaciones/components/ImageUploader.tsx
import { useState, useEffect } from "react";
import { Toolbar } from "./ImagenUploader/Toolbar";
import { Dropzone } from "./ImagenUploader/Dropzone";
import { EditorInline } from "./ImagenUploader/EditorInline";

// Función auxiliar para convertir el Base64 del lienzo a un archivo físico (File)
const dataURLtoFile = (dataurl: string, filename: string): File => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

interface Props {
  onImageReady: (file: File | null) => void;
  onOrientationDetected: (orientacion: "horizontal" | "vertical") => void;
}

export function ImagenUploader({ onImageReady, onOrientationDetected }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [showCrop, setShowCrop] = useState(false);
  const [saveTrigger, setSaveTrigger] = useState(0);

  const handleSaveCrop = () => {
    setSaveTrigger((prev) => prev + 1);
  };

 useEffect(() => {
  if (!file) {
    setPreview(null);
    onImageReady(null);
    return;
  }

  const url = URL.createObjectURL(file);
  setPreview(url);

  onImageReady(file);

  // detectar orientación también aquí
  const img = new Image();
  img.src = url;
  img.onload = () => {
    const orientacion = img.width > img.height ? "horizontal" : "vertical";
    onOrientationDetected(orientacion);
  };

  return () => URL.revokeObjectURL(url);
}, [file]);

  const handleFinalImageChange = (base64Str: string) => {
    // 1. Detectar orientación de la imagen resultante
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const orientacion = img.width > img.height ? "horizontal" : "vertical";
      onOrientationDetected(orientacion);
    };

    // 2. Convertir a File y enviarlo al formulario
    const newFile = dataURLtoFile(base64Str, "certificado_procesado.jpg");
    onImageReady(newFile);
  };

  if (!preview) {
    return <Dropzone onFileSelect={setFile} />;
  }
//h-full
  return (
    // CAMBIO: flex-col en móvil, flex-row en desktop (md)
    <div className="flex flex-col md:flex-row gap-4 w-full"> 
      <div className="flex-1 w-full overflow-hidden">
        <EditorInline
          image={preview}
          rotation={rotation}
          showCrop={showCrop}
          onCloseCrop={() => setShowCrop(false)}
          saveTrigger={saveTrigger}
          onImageUpdated={handleFinalImageChange}
        />
      </div>

      <Toolbar
        onRotate={() => setRotation((r) => r + 90)}
        onDelete={() => setFile(null)}
        onCrop={() => setShowCrop((c) => !c)}
        onSaveCrop={handleSaveCrop}
        showCrop={showCrop}
      />
    </div>
  );
}