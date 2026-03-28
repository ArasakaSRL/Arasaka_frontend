import { useState, useEffect } from "react";
import { Dropzone } from "./ImagenUploader/Dropzone";
import { Toolbar } from "./ImagenUploader/Toolbar";
import { ImagenPreview } from "./ImagenUploader/ImagenPreview";
import { EditorInline } from "./ImagenUploader/EditorInline";


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
      <EditorInline
        image={preview}
        rotation={rotation}
        onRotate={() => setRotation((r) => r + 90)}
        onDelete={() => setFile(null)}
      />
    )}
    </div>
  );
}