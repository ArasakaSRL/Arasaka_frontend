type Props = {
  titulo: string;
  descripcion: string;
  institucion?: string;
  fecha?: string;
  categoria?: string;
  onClick?: () => void;
  eliminando?: boolean;
  seleccionado?: boolean;
};

export function CardTexto({
  titulo,
  descripcion,
  institucion,
  fecha,
  categoria,
  onClick,
  eliminando,
  seleccionado,
}: Props) {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-xl
        px-5 py-4
        transition-all duration-300
        cursor-pointer
        border

        ${
          eliminando
            ? seleccionado
              ? `
                border-red-500
                bg-red-50
                ring-2 ring-red-500
              `
              : `
                border-[var(--color-primary-100)]
                bg-light-500
                hover:bg-red-50
                hover:ring-2 hover:ring-red-400
              `
            : `
              border-[var(--color-primary-100)]
              bg-light-500
              hover:shadow-lg
              hover:-translate-y-[2px]
            `
        }
      `}
    >

      {/* ───────────────────────────── */}
      {/* MOBILE */}
      {/* ───────────────────────────── */}
      <div className="flex flex-col gap-3 sm:hidden">

        {/* Categoria */}
        {categoria && (
          <div className="flex justify-end">
            <span
              className="
                rounded-full
                bg-emerald-500/15
                px-2 py-1
                text-xs font-medium
                text-emerald-500
              "
            >
              {categoria}
            </span>
          </div>
        )}

        {/* Titulo */}
        <h3
          className="
            text-left text-xl
            font-bold text-black
          "
        >
          {titulo}
        </h3>

        {/* Descripcion */}
        <p
          className="
            line-clamp-2 text-left
            text-sm text-black/70
          "
        >
          {descripcion}
        </p>

        {/* Footer */}
        <div
          className="
            flex items-center
            gap-4 text-xs
            text-black/60
          "
        >
          {institucion && (
            <span className="font-medium">
              {institucion}
            </span>
          )}

          {fecha && (
            <span>
              {fecha}
            </span>
          )}
        </div>
      </div>

      {/* ───────────────────────────── */}
      {/* TABLET */}
      {/* ───────────────────────────── */}
      <div className="hidden sm:flex lg:hidden flex-col gap-3">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">

          {/* Titulo */}
          <h3
            className="
              min-w-0 flex-1 truncate
              text-left text-xl
              font-bold text-black
            "
          >
            {titulo}
          </h3>

          {/* Categoria */}
          {categoria && (
            <span
              className="
                shrink-0 rounded-full
                bg-emerald-500/15
                px-2 py-1
                text-xs font-medium
                text-emerald-500
              "
            >
              {categoria}
            </span>
          )}
        </div>

        {/* Descripcion */}
        <p
          className="
            line-clamp-2 text-left
            text-sm text-black/70
          "
        >
          {descripcion}
        </p>

        {/* Footer */}
        <div
          className="
            flex items-center gap-4
            text-xs text-black/60
          "
        >
          {institucion && (
            <span className="font-medium">
              {institucion}
            </span>
          )}

          {fecha && (
            <span>
              {fecha}
            </span>
          )}
        </div>
      </div>

      {/* ───────────────────────────── */}
      {/* DESKTOP */}
      {/* ───────────────────────────── */}
      <div className="hidden lg:flex flex-col gap-3">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">

          {/* Titulo */}
          <h3
            className="
              min-w-0 flex-1 truncate
              text-left text-xl
              font-bold text-black
            "
          >
            {titulo}
          </h3>

          {/* Categoria */}
          {categoria && (
            <span
              className="
                shrink-0 rounded-full
                bg-emerald-500/15
                px-2 py-1
                text-xs font-medium
                text-emerald-500
              "
            >
              {categoria}
            </span>
          )}
        </div>

        {/* Body Desktop */}
        <div
          className="
            grid grid-cols-[1fr_auto_auto]
            items-center gap-6
          "
        >

          {/* Descripcion */}
          <p
            className="
              line-clamp-2 text-left
              text-sm text-black/70
            "
          >
            {descripcion}
          </p>

          {/* Institucion */}
          {institucion && (
            <span
              className="
                whitespace-nowrap
                text-xs font-medium
                text-black/60
              "
            >
              {institucion}
            </span>
          )}

          {/* Fecha */}
          {fecha && (
            <span
              className="
                whitespace-nowrap
                text-xs text-black/60
              "
            >
              {fecha}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}