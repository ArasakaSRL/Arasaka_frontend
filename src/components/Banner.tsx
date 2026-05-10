import { Boton2 } from "@/components/ui/Boton2";
import { Trash2, SquarePen, CirclePlus, BookmarkX } from 'lucide-react';
type Props = {
  titulo: string;
  descripcion: string;
  totalItems?: number;
  editando?: boolean;
  eliminando?: boolean;
  onAgregar?: () => void;
  onEditar?: () => void;
  onCancelar?: () => void;
  onEliminar?: () => void;
};

export const Banner = ({
  titulo,
  descripcion,
  totalItems = 0,
  onAgregar,
  onEditar,
  onCancelar,
  onEliminar,
  eliminando,
  editando
}: Props) => {

  const formatTitulo = (titulo: string) => {
    const palabras = titulo.split(" ");

    if (palabras.length <= 1) return titulo;

    const mitad = Math.ceil(palabras.length / 2);

    const linea1 = palabras.slice(0, mitad).join(" ");
    const linea2 = palabras.slice(mitad).join(" ");

    return (
      <>
        <span className="block">{linea1}</span>
        <span className="block">{linea2}</span>
      </>
    );
  };

  return (
    <div
      className="
      w-full rounded-xl
      px-6 py-6
      md:px-8 md:py-8
      text-white
      bg-linear-to-br from-[#0a1a3a] to-[#112e57]
      flex flex-col items-start gap-1
      "
    >
      <div>
        <h1
          className="
            text-2xl
            md:text-4xl
            font-bold
            text-left
          "
        >
          {formatTitulo(titulo)}
        </h1>

        <p
          className="
            text-sm
            md:text-base
            text-gray-200
          "
        >
          {descripcion}
        </p>
      </div>

      <div className="flex gap-3">

        {onAgregar && (
          <Boton2
            onClick={onAgregar}
            className="
              mt-1
              px-4 py-1.5
              bg-blue-600 hover:bg-blue-700
              text-sm
              flex items-center gap-2
            "
          >
            <CirclePlus size={16} />
            Agregar
          </Boton2>
        )}

        {totalItems > 0 && (
          <>
            {!editando ? (
              <Boton2
                onClick={onEditar}
                className="
                  mt-1
                  px-4 py-1.5
                  bg-blue-600 hover:bg-blue-700
                  text-sm
                  flex items-center gap-2
                  "
              >
                <SquarePen size={16} />
                Editar
              </Boton2>
            ) : (
              <Boton2
                onClick={onCancelar}
                className="
                  mt-1
                  px-4 py-1.5
                  bg-gray-500 hover:bg-gray-600
                  text-sm
                  flex items-center gap-2
                "
              >
                <BookmarkX size={16} />
                Cancelar
              </Boton2>
            )}
            {!eliminando ? (
              <Boton2
                onClick={onEliminar}
                className="
                  mt-1
                  px-4 py-1.5
                  bg-red-600 hover:bg-red-700
                  text-sm
                  flex items-center gap-2
                "
              >
                <Trash2 size={16} />
                Eliminar
              </Boton2>
            ) : (
              <Boton2
                onClick={onCancelar}
                className="
                  mt-1
                  px-4 py-1.5
                  bg-gray-500 hover:bg-gray-600
                  text-sm
                  flex items-center gap-2
                "
              >
                <BookmarkX size={16} />
                Cancelar
              </Boton2>
            )}
          </>
        )}
      </div>
    </div>
  );
};