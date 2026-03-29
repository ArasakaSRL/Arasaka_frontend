import { useState, useEffect } from "react";
import { Dropzone } from "./ImagenUploader/Dropzone";
import { Toolbar } from "./ImagenUploader/Toolbar";
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

  if (!preview) {
    return <Dropzone onFileSelect={setFile} />;
  }

  return (
    <div className="flex gap-4">
      <EditorInline
        image={preview}
        rotation={rotation}
        showCrop={showCrop}
        onCloseCrop={() => setShowCrop(false)}
      />

      <Toolbar
        onRotate={() => setRotation((r) => r + 90)}
        onDelete={() => setFile(null)}
        onCrop={() => setShowCrop((c) => !c)}
      />
    </div>
  );
}