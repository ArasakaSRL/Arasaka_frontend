import { useEffect, useRef, useState } from "react";
import { ReactCrop, type Crop, type PixelCrop } from "react-image-crop";
import { getCroppedImage } from "../../utils/cropImage";

type Props = {
  image: string;
  rotation: number;
  showCrop: boolean;
  onCloseCrop: () => void;
  saveTrigger: number;
};

export function EditorInline({ image, rotation, showCrop, onCloseCrop, saveTrigger }: Props) {
  const [isVertical, setIsVertical] = useState(false);
  const isRotatedVertical = rotation % 180 !== 0;
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 90,
    height: 70,
    x: 5,
    y: 15,
  });

  // FIX: detectar si la imagen es vertical al cargar
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setIsVertical(img.naturalHeight > img.naturalWidth);
  };

  useEffect(() => {
    if (
      !completedCrop ||
      !imgRef.current ||
      completedCrop.width === 0 ||
      completedCrop.height === 0
    ) return;

    const runCrop = async () => {
      const cropped = await getCroppedImage(imgRef.current!, completedCrop, rotation);
      setCroppedImage(cropped);
      onCloseCrop();
    };

    runCrop();
  }, [saveTrigger]);

  //estilos centralizados según orientación real + rotación
  const imgStyle: React.CSSProperties = {
    transform: `rotate(${rotation}deg)`,
    maxHeight: isRotatedVertical
      ? (isVertical ? "260px" : "100%")
      : (isVertical ? "280px" : "280px"),
    maxWidth: isRotatedVertical
      ? (isVertical ? "100%" : "260px")
      : (isVertical ? "120px" : "100%"),  // ← clave para verticales
    width: isVertical && !isRotatedVertical ? "auto" : undefined,
    height: isVertical && !isRotatedVertical ? "100%" : undefined,
  };

  return (
    <div className="w-full h-full max-h-[350px] bg-dark-500 flex items-center justify-center overflow-hidden">
      <div className="flex items-center justify-center w-full h-full">

        {showCrop ? (
        <div className="h-[300px] flex items-center justify-center bg-[#1E1E1E] overflow-hidden"
          style={{ width: isVertical ? "auto" : "100%" }}
        >
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <img
              ref={imgRef}
              src={image}
              onLoad={handleImageLoad}
              style={{
                maxHeight: isVertical ? "280px" : "280px",
                maxWidth:  isVertical ? "120px" : "100%",
                width:  isVertical ? "auto" : undefined,
                height: isVertical ? "100%" : undefined,
              }}
              className="object-contain"
            />
          </ReactCrop>
        </div>
      ) : (
        <div className="w-full h-[300px] flex items-center justify-center bg-black overflow-hidden">
          <img
            src={croppedImage || image}
            onLoad={handleImageLoad}
            style={{
              transform: `rotate(${rotation}deg)`,
              maxHeight: isRotatedVertical ? "100%" : "280px",
              maxWidth:  isRotatedVertical ? "280px" : "100%",
            }}
            className="object-contain"
          />
        </div>
      )}

      </div>
    </div>
  );
}