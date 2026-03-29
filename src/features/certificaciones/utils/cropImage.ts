import type { PixelCrop } from "react-image-crop";

// utils/cropImage.ts
export async function getCroppedImage(
  image: HTMLImageElement,
  crop: PixelCrop,
  rotation: number = 0  // ← agregar este parámetro
): Promise<string> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No context");

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  const cropWidthReal = crop.width * scaleX;
  const cropHeightReal = crop.height * scaleY;

  // si hay rotación, intercambiar ancho/alto del canvas
  const isRotated90 = rotation % 180 !== 0;
  canvas.width  = isRotated90 ? cropHeightReal : cropWidthReal;
  canvas.height = isRotated90 ? cropWidthReal  : cropHeightReal;

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(-cropWidthReal / 2, -cropHeightReal / 2);

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    cropWidthReal,
    cropHeightReal,
    0,
    0,
    cropWidthReal,
    cropHeightReal
  );

  return canvas.toDataURL("image/jpeg", 1);
}