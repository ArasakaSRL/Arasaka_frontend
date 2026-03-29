import ReactCrop, { type Crop } from "react-image-crop";
import { useState, useEffect } from "react";

type Props = {
  image: string;
  rotation: number;
  showCrop: boolean;
};

export function EditorInline({ image, rotation, showCrop }: Props) {
  const [isVertical, setIsVertical] = useState(false);
  const isRotatedVertical = rotation % 180 !== 0;

  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 90,
    height: 70,
    x: 10,
    y: 20,
  });
  

  useEffect(() => {
    const img = new Image();
    img.src = image;

    img.onload = () => {
      setIsVertical(img.height > img.width);
    };
  }, [image]);

  return (
    <div className="w-full h-full max-h-[350px] bg-black flex items-center justify-center overflow-hidden">
      
      <div
        className={`
          flex items-center justify-center
          w-full h-full
          ${isVertical ? "max-h-[280px]" : ""}
        `}
      >
      {showCrop ? (
        <div className="w-full h-[300px] flex items-center justify-center bg-black overflow-hidden">
          
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            className="w-full h-full flex items-center justify-center"
          >
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={image}
                style={{
                  transform: `rotate(${rotation}deg)`,
                  maxHeight: isRotatedVertical ? "100%" : "280px",
                  maxWidth: isRotatedVertical ? "280px" : "100%",
                }}
                className="object-contain"
              />
            </div>
          </ReactCrop>

        </div>
      ) : (
          <div className="w-full h-[300px] flex items-center justify-center bg-black overflow-hidden">
            <img
              src={image}
              style={{
                transform: `rotate(${rotation}deg)`,
                maxHeight: isRotatedVertical ? "100%" : "280px",
                maxWidth: isRotatedVertical ? "280px" : "100%",
              }}
              className="object-contain"
            />
          </div>
        )}
      </div>

    </div>
  );
}