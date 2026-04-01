import { Boton2 } from "@/components/ui/Boton2";


type Props = {
  onOpenModal: () => void;
};

export const Banner = ({ onOpenModal }: Props) => {
  return (
    <div className="
      w-full rounded-xl
      px-4 py-6
      sm:px-6 sm:py-8
      md:px-10 md:py-10
      lg:px-14 lg:py-12
      text-left text-white
      bg-gradient-to-br from-blue-400 to-blue-900
      flex flex-col gap-4
    ">
      <h1 className="
        text-sm
        sm:text-lg
        md:text-2xl
        lg:text-3xl
        font-semibold leading-tight
      ">
        Certificaciones y <br /> Logros
      </h1>

      <div className="w-full sm:w-auto">
        <Boton2 onClick={onOpenModal}>
          Subir Certificación
        </Boton2>
      </div>
    </div>
  )
}