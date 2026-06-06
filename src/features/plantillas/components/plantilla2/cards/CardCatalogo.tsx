import { motion } from "framer-motion";

type Props = {
  titulo: string;
  descripcion: string;
  imagen: string;
  onClick?: () => void;
};

export function CardCatalogo({
  titulo,
  descripcion,
  imagen,
  onClick,
}: Props) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="
        flex items-center
        px-5 py-4
        rounded-2xl
        bg-white/5
        backdrop-blur-2xl
        border border-white/10
        shadow-[0_8px_32px_rgba(0,0,0,0.2)]
      "
    >
      {/* Título */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-black">
          {titulo}
        </h3>
      </div>

      {/* Descripción */}
      <div className="w-32 text-center">
        <span className="text-sm text-black/60">
          {descripcion}
        </span>
      </div>

      {/* Imagen */}
      <div className="w-24 flex justify-center">
        <img
          src={imagen}
          alt={titulo}
          className="w-16 h-16 object-contain"
        />
      </div>

      {/* Acción 
      <button
        onClick={onClick}
        className="
          ml-4
          w-8 h-8
          rounded-full
          flex items-center justify-center
          bg-white/10
          hover:bg-white/20
          transition
        "
      >
        +
      </button>*/}
    </motion.div>
  );
}