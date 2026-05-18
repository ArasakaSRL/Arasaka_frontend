import type { Tecnologia } from "../types/tecnologia.types";
import { Cpu } from "lucide-react";

type Props = {
  tecnologia: Tecnologia;
};

export const TecnologiaCard = ({
  tecnologia,
}: Props) => {
  return (
    <div
      className="
      bg-white
      rounded-3xl
      shadow-sm
      border
      p-5
      hover:shadow-lg
      transition
    "
    >
      <div
        className="
        flex items-center gap-4
      "
      >
        {tecnologia.logo ? (
          <img
            src={tecnologia.logo}
            alt={tecnologia.nombre}
            className="
            w-16
            h-16
            object-contain
          "
          />
        ) : (
          <div
            className="
            w-16 h-16
            rounded-2xl
            bg-gray-100
            flex items-center justify-center
          "
          >
            <Cpu />
          </div>
        )}

        <div>
          <h3
            className="
            font-bold
            text-lg
          "
          >
            {tecnologia.nombre}
          </h3>

          <p
            className="
            text-sm
            text-gray-500
            line-clamp-2
          "
          >
            {tecnologia.descripcion}
          </p>
        </div>
      </div>
    </div>
  );
};