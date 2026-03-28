import { useState } from "react";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

type Props = {
  image: string;
  rotation: number;
  onRotate: () => void;
  onDelete: () => void;
};

export function EditorInline({
  image,
  rotation,
  onRotate,
  onDelete,
}: Props) {

  const isVertical = rotation % 180 !== 0; 

  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 90,
    height: 70,
    x: 10,
    y: 20,
  });

  return (
    <div className="flex gap-4 border-2 border-dashed border-gray-400 p-4">

      {/* 🖼️ DROPZONE / ÁREA DE EDICIÓN */}
      <div className="w-[500px] h-[300px] bg-gray-100 overflow-hidden flex items-center justify-center">

        {/* 🔥 SOLO ESTA PARTE NEGRA */}
        <div className="relative w-full h-full bg-black flex items-center justify-center">
          <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
            <img
              src={image}
              style={{
                transform: `rotate(${rotation}deg) scale(${isVertical ? 0.6 : 1})`,
              }}
              className="max-w-full max-h-full object-contain"
            />
          </ReactCrop>
        </div>
      </div>

      {/* 🔧 TOOLBAR VERTICAL */}
      <div className="flex flex-col justify-between">

        <div className="flex flex-col gap-2">
          <button
            onClick={onRotate}
            className="px-3 py-2 bg-gray-200 rounded"
          >
            🔄
          </button>

          <button
            onClick={onDelete}
            className="px-3 py-2 bg-red-500 text-white rounded"
          >
            🗑
          </button>
        </div>

        <button className="px-3 py-2 bg-blue-500 text-white rounded">
          💾
        </button>
      </div>
    </div>
  );
}