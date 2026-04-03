//onOpenModal={() => setOpenModal(true)} 
//<Banner titulo="Experiencias e hitos importantes" descripcion="En trayectoria profesional" />
import { Boton2 } from "@/components/ui/Boton2";

type Props = {
  onOpenModal?: () => void;
  titulo: string;
  descripcion: string;
};

export const Banner = ({
  onOpenModal,
  titulo = "",
  descripcion = "",
}: Props) => {
  
  const formatTitulo = (titulo: string) => {
    if (titulo.length <= 14) return titulo;

    const palabras = titulo.split(" ");
    let linea1 = "";
    let linea2 = "";

    for (let i = 0; i < palabras.length; i++) {
      if ((linea1 + palabras[i]).length <= 14) {
        linea1 += (linea1 ? " " : "") + palabras[i];
      } else {
        linea2 += (linea2 ? " " : "") + palabras[i];
      }
    }

    return (
      <>
        {linea1}
        <br />
        {linea2}
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
      bg-gradient-to-br from-[#0a1a3a] to-[#112e57]
      flex flex-col items-start gap-1
    "
  >
    <h1
      className="
        text-2xl
        md:text-4xl
        font-bold
        leading-tight
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
        leading-tight
      "
    >
      {descripcion}
    </p>

    {onOpenModal && (
      <Boton2
        onClick={onOpenModal}
        className="
          mt-1
          px-4 py-1.5
          bg-blue-600 hover:bg-blue-700
          text-sm
        "
      >
        Agregar hito
      </Boton2>
    )}
  </div>
  );
};