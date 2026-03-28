import React, { useState } from "react";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

type Props = {
  image: string;
  onClose: () => void;
};

export function CropperModal({ image, onClose }: Props) {
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 50,
    height: 50,
    x: 25,
    y: 25,
  });

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg">
        <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
          <img src={image} />
        </ReactCrop>

        <div className="flex gap-2 mt-4">
          <button onClick={onClose}>Cancelar</button>
          <button onClick={onClose}>Guardar</button>
        </div>
      </div>
    </div>
  );
}