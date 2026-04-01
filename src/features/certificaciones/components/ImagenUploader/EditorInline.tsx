
import { useEffect, useRef, useState } from "react";
import { ReactCrop, type Crop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { getCroppedImage } from "../../utils/cropImage";

type Props = {
  image: string;
  rotation: number;
  showCrop: boolean;
  onCloseCrop: () => void;
  saveTrigger: number;
  onImageUpdated: (base64: string) => void;
};

// Generamos la imagen rotada.
const getRotatedImage = async (imageSrc: string, rotation: number): Promise<string> => {
  const normalizedRotation = ((rotation % 360) + 360) % 360;
  if (normalizedRotation === 0) return imageSrc;

  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => { image.onload = resolve; });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return imageSrc;

  const isRotated90 = normalizedRotation === 90 || normalizedRotation === 270;
  canvas.width = isRotated90 ? image.height : image.width;
  canvas.height = isRotated90 ? image.width : image.height;

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((normalizedRotation * Math.PI) / 180);
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);

  return canvas.toDataURL("image/jpeg", 1);
};

export function EditorInline({ image, rotation, showCrop, onCloseCrop, saveTrigger, onImageUpdated }: Props) {
  // 1. EL LIENZO BASE: Siempre es la foto original completa (girada a los grados actuales)
  const [baseRotatedImage, setBaseRotatedImage] = useState<string>(image);
  
  // 2. EL RESULTADO: Lo que se ve cuando NO estás usando las tijeras
  const [finalDisplayImage, setFinalDisplayImage] = useState<string>(image);

  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [cropSavedAtRotation, setCropSavedAtRotation] = useState(0);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);

  const imgRef = useRef<HTMLImageElement | null>(null);

  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  });

  // Efecto A: Mantener el "Lienzo Base" actualizado con la rotación original
  useEffect(() => {
    let isMounted = true;
    const processBaseRotation = async () => {
      const src = await getRotatedImage(image, rotation);
      if (isMounted) setBaseRotatedImage(src);
    };
    processBaseRotation();
    return () => { isMounted = false; };
  }, [image, rotation]);

  // Efecto B: Mantener el "Resultado Final" actualizado (Aplica rotación al recorte si giras la pantalla)
  useEffect(() => {
    let isMounted = true;
    const processFinalDisplay = async () => {
      let srcToDisplay = baseRotatedImage;

      if (croppedImage) {
        const diff = rotation - cropSavedAtRotation;
        if (diff === 0) {
          srcToDisplay = croppedImage;
        } else {
          srcToDisplay = await getRotatedImage(croppedImage, diff);
        }
      }

      if (isMounted) {
        setFinalDisplayImage(srcToDisplay);
        onImageUpdated(srcToDisplay); // <-- AVISAMOS AL COMPONENTE PADRE
      }
    };
    processFinalDisplay();
    return () => { isMounted = false; };
  }, [baseRotatedImage, croppedImage, rotation, cropSavedAtRotation]);

  // Efecto C: Extraer el recorte SIEMPRE del lienzo base original
  useEffect(() => {
    if (!completedCrop || !imgRef.current || completedCrop.width === 0 || completedCrop.height === 0) return;

    const runCrop = async () => {
      // Como imgRef apunta a baseRotatedImage, siempre sacamos el HD de la original
      const cropped = await getCroppedImage(imgRef.current!, completedCrop, 0);
      setCroppedImage(cropped);
      setCropSavedAtRotation(rotation);
      onCloseCrop();
    };

    if (saveTrigger > 0) runCrop();
  }, [saveTrigger]);

  // Efecto D: Reiniciar el cuadradito SOLO si giras la imagen. 
  // (Si solo entras y sales de recortar, tu cuadrado se queda donde mismo para poder corregirlo)
  useEffect(() => {
    setCompletedCrop(null);
    setCrop({
      unit: "%",
      width: 90,
      height: 90,
      x: 5,
      y: 5,
    });
  }, [rotation]);

  return (
    <div className="w-full h-full min-h-[300px] bg-[#1E1E1E] flex items-center justify-center overflow-hidden rounded-xl p-4">
      {showCrop ? (
        <ReactCrop
          key={`crop-key-${rotation}`}
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          style={{ display: "inline-block", maxWidth: "100%" }}
        >
          {/* MODO EDICIÓN: Te mostramos la foto entera */}
          <img
            ref={imgRef}
            src={baseRotatedImage}
            style={{
              display: "block",
              maxWidth: "100%",
              maxHeight: "50vh",
              width: "auto",
              height: "auto",
            }}
            alt="Crop preview"
          />
        </ReactCrop>
      ) : (
        /* MODO VISTA: Te mostramos el resultado de tu tijera */
        <img
          src={finalDisplayImage}
          style={{
            display: "block",
            maxWidth: "100%",
            maxHeight: "50vh",
            width: "auto",
            height: "auto",
          }}
          alt="Preview"
        />
      )}
    </div>
  );
}