import { useState, useEffect } from "react";
import { Dropzone } from "./ImagenUploader/Dropzone";
import { Toolbar } from "./ImagenUploader/Toolbar";
import { ImagenPreview } from "./ImagenUploader/ImagenPreview";
import { CropperModal } from "./ImagenUploader/CropperModal";


export function ImagenUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [showCrop, setShowCrop] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="flex justify-center p-8">
      {!preview ? (
        <Dropzone onFileSelect={setFile} />
      ) : (
        <div className="flex gap-6">
          <div style={{ transform: `rotate(${rotation}deg)` }}>
            <ImagenPreview src={preview} />
          </div>

          <Toolbar
            onDelete={() => setFile(null)}
            onRotate={() => setRotation((r) => r + 90)}
            onCrop={() => setShowCrop(true)}
          />{showCrop && preview && (
            <CropperModal
              image={preview}
              onClose={() => setShowCrop(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}