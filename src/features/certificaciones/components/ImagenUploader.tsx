// src/features/certificaciones/components/ImageUploader.tsx
import { useState, useEffect } from "react";
import { Toolbar } from "./ImagenUploader/Toolbar";
import { Dropzone } from "./ImagenUploader/Dropzone";
import { EditorInline } from "./ImagenUploader/EditorInline";

export function ImagenUploader() {
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
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!preview) {
    return <Dropzone onFileSelect={setFile} />;
  }

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