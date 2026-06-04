import { memo } from "react";
import { CircleUser } from "lucide-react";

interface Props {
  imagenUrl: string;
  ancho: number;
  alto: number;
}

function FotoPerfil({ imagenUrl, ancho, alto }: Props) {
  const dimension = Math.min(ancho, alto);

  return (
    <div
      className="flex items-center justify-center rounded-full bg-white overflow-hidden border-[3px] border-white"
      style={{
        width: dimension,
        height: dimension,
      }}
    >
      {imagenUrl ? (
        <img
          src={imagenUrl}
          alt="Foto de perfil"
          width={dimension}
          height={dimension}
          className="w-full h-full object-cover"
        />
      ) : (
        <CircleUser
          size={dimension * 0.6}
          className="text-gray-400"
        />
      )}
    </div>
  );
}

export default memo(FotoPerfil);