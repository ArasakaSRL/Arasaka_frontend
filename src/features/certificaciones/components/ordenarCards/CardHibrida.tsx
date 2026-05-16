type Props = {
  titulo: string;
  descripcion: string;
  institucion: string;
  fecha: string;
  categoria: string;
  imagen: string;
  onClick?: () => void;
};

export function CardHibrida({
  titulo,
  descripcion,
  institucion,
  fecha,
  categoria,
  imagen,
  onClick,
}: Props) {
  return (
    <div
      onClick={onClick}
      className="
        group flex gap-4
        rounded-2xl
        border border-[var(--color-light-700)]
        bg-[var(--color-light-500)]
        p-4
        shadow-sm
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-xl
        cursor-pointer
      "
    >
      {/* Imagen */}
      <div
        className="
          h-28 w-28 shrink-0
          overflow-hidden rounded-xl
          bg-[var(--color-light-400)]
        "
      >
        <img
          src={imagen}
          alt={titulo}
          className="
            h-full w-full object-cover
            transition-transform duration-500
            group-hover:scale-105
          "
        />
      </div>

      {/* Contenido */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* Categoría */}
        <div className="mb-2 flex justify-end">
          <span
            className="
              rounded-full
              border border-[var(--color-light-700)]
              bg-[var(--color-light-400)]
              px-2 py-1
              text-xs font-medium
              text-black/70
            "
          >
            {categoria}
          </span>
        </div>

        {/* Contenido alineado */}
        <div className="flex flex-col items-start text-left">

          {/* Título */}
          <h3
            className="
              w-full truncate
              text-lg font-semibold
              text-black
            "
          >
            {titulo}
          </h3>

          {/* Descripción */}
          <p
            className="
              mt-1 w-full line-clamp-2
              text-sm text-black/75
              font-normal-ui
            "
          >
            {descripcion}
          </p>

          {/* Institución */}
          <p
            className="
              mt-3 w-full truncate
              text-sm font-medium
              text-black/85
            "
          >
            {institucion}
          </p>

          {/* Fecha */}
          <p
            className="
              mt-1 text-xs
              text-black/60
            "
          >
            {fecha}
          </p>
        </div>
      </div>
    </div>
  );
}