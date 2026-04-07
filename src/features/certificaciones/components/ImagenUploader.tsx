import { useState, useEffect } from "react";
import { Toolbar } from "./ImagenUploader/Toolbar";
import { Dropzone } from "./ImagenUploader/Dropzone";
import { EditorInline } from "./ImagenUploader/EditorInline";

const dataURLtoFile = (dataurl: string, filename: string): File => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) { u8arr[n] = bstr.charCodeAt(n); }
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

  useEffect(() => {
    if (!file) {
      setPreview(null);
      onImageReady(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    onImageReady(file);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Se recalcula cuando cambia el preview o la rotación
  useEffect(() => {
    if (!preview) return;
    const img = new Image();
    img.src = preview;
    img.onload = () => {
      const isRotated90 = rotation % 180 !== 0;
      const width  = isRotated90 ? img.height : img.width;
      const height = isRotated90 ? img.width  : img.height;
      onOrientationDetected(width > height ? "horizontal" : "vertical");
    };
  }, [rotation, preview]);

  const handleRotate = () => {
    setRotation((r) => (r + 90) % 360);
  };

  // La orientación ya está siendo manejada por el Efecto 2, no necesitamos detectarla aquí
  const handleFinalImageChange = (base64Str: string) => {
    const newFile = dataURLtoFile(base64Str, "certificado_procesado.jpg");
    onImageReady(newFile);
  };

  if (!preview) {
    return <Dropzone onFileSelect={setFile} />;
  }

  return (
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
        onRotate={handleRotate}
        onDelete={() => setFile(null)}
        onCrop={() => setShowCrop((c) => !c)}
        onSaveCrop={() => setSaveTrigger((p) => p + 1)}
        showCrop={showCrop}
      />
    </div>
  );
}