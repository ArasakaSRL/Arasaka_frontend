import { Boton2 } from "@/components/ui/Boton2";


type Props = {
  onOpenModal: () => void;
};

export const Banner = ({ onOpenModal }: Props) => {
  return (
    <div
      className="
        w-full rounded-xl
        px-6 py-10
        md:px-10 md:py-12
        text-white
        bg-gradient-to-br from-[#0a1a3a] to-[#112e57]
        flex flex-col items-start gap-6
      "
    >
      <h1
        className="
          text-3xl
          md:text-4xl
          font-bold
          leading-tight
          text-left
        "
      >
        Experiencia y <br />
        <span className="relative inline-block">
          hitos importantes
          <span></span>
        </span>
      </h1>

      <Boton2
        onClick={onOpenModal}
        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700"
      >
        Agregar hito
      </Boton2>
    </div>
  );
};