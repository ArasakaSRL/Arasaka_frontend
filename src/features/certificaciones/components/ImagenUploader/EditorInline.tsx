import ReactCrop, { type Crop , type PixelCrop } from "react-image-crop";
import { useState, useEffect, useRef } from "react";
import { getCroppedImage } from "../../utils/cropImage";

type Props = {
  image: string;
  rotation: number;
  showCrop: boolean;
  onCloseCrop: () => void;
  saveTrigger: number;
};

export function EditorInline({ image, rotation, showCrop, onCloseCrop, saveTrigger }: Props){
  const [isVertical, setIsVertical] = useState(false);
  const isRotatedVertical = rotation % 180 !== 0;
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);

  const imgRef = useRef<HTMLImageElement | null>(null);
  
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 90,
    height: 70,
    x: 10,
    y: 20,
  });
  

  useEffect(() => {
    if (
      !completedCrop ||
      !imgRef.current ||
      completedCrop.width === 0 ||
      completedCrop.height === 0
    ) return;

    const runCrop = async () => {
      const cropped = await getCroppedImage(imgRef.current!, completedCrop);
      setCroppedImage(cropped);
      onCloseCrop();
    };

    runCrop();
  }, [saveTrigger]);


  return (
    <div className="w-full h-full max-h-[350px] bg-dark-500 flex items-center justify-center overflow-hidden">
      
      <div
        className={`
          flex items-center justify-center
          w-full h-full
          ${isVertical ? "max-h-[280px]" : ""}
        `}
      >
      {showCrop ? (
        <div className="w-full h-[300px] flex items-center justify-center bg-[#1E1E1E] overflow-hidden">
          
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            className="w-full h-full flex items-center justify-center"
          >
            <div className="w-full h-full flex items-center justify-center">
              <img
                ref={imgRef}
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
              ref={imgRef}
              src={croppedImage || image}
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