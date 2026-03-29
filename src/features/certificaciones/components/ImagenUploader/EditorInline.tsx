import ReactCrop, { type Crop } from "react-image-crop";
import { useState } from "react";

type Props = {
  image: string;
  rotation: number;
  showCrop: boolean;
};

export function EditorInline({ image, rotation, showCrop }: Props) {
  const isVertical = rotation % 180 !== 0;

  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 90,
    height: 70,
    x: 10,
    y: 20,
  });

  return (
    <div className="w-[500px] h-[300px] bg-black flex items-center justify-center">
      {showCrop ? (
        <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
          <img
            src={image}
            style={{
              transform: `rotate(${rotation}deg) scale(${isVertical ? 0.6 : 1})`,
            }}
            className="max-w-full max-h-full object-contain"
          />
        </ReactCrop>
      ) : (
        <img
          src={image}
          style={{
            transform: `rotate(${rotation}deg) scale(${isVertical ? 0.6 : 1})`,
          }}
          className="max-w-full max-h-full object-contain"
        />
      )}
    </div>
  );
}