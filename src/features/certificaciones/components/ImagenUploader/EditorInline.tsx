import ReactCrop, { type Crop , type PixelCrop } from "react-image-crop";
import { useState, useEffect, useRef } from "react";
import { getCroppedImage } from "../../utils/cropImage";

type Props = {
  image: string;
  rotation: number;
  showCrop: boolean;
  onCloseCrop: () => void;
};

export function EditorInline({ image, rotation, showCrop, onCloseCrop }: Props){
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
    const img = new Image();
    img.src = image;

    img.onload = () => {
      setIsVertical(img.height > img.width);
    };
  }, [image]);

  const handleCropSave = async () => {
    if (!completedCrop || !imgRef.current) return;

    const cropped = await getCroppedImage(imgRef.current, completedCrop);
    setCroppedImage(cropped);

    onCloseCrop(); // 👈 🔥 SALE DEL MODO CROP
  };

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
                src={croppedImage || image}
                style={{
                  transform: `rotate(${rotation}deg)`,
                  maxHeight: isRotatedVertical ? "100%" : "280px",
                  maxWidth: isRotatedVertical ? "280px" : "100%",
                }}
                className="object-contain"
              />
            </div>
          </ReactCrop>
          <button
            onClick={handleCropSave}
            className="absolute bottom-2 right-2 bg-blue-500 text-white px-3 py-1 rounded"
          >
            Guardar
          </button>

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