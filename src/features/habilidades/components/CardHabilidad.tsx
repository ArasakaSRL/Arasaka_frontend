import { motion } from "framer-motion";

type Props = {
  nombre: string;
  nivel: string;
  editable?: boolean;
  eliminando?: boolean;
  onSelect?: () => void;
};

const nivelesOrden = [
  "Principiante",
  "Intermedio",
  "Competente",
  "Avanzado",
  "Experto",
];

const getWidth = (nivel: string) => {
  const index = nivelesOrden.indexOf(nivel);
  return index >= 0 ? `${(index + 1) * 20}%` : "10%";
};

export default function HabilidadItem({
  nombre,
  nivel,
  editable,
  eliminando,
  onSelect,
}: Props) {
  return (
    <motion.div
      onClick={onSelect}
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        scale: 1.01,
      }}
      whileTap={{
        scale: 0.98,
      }}
      transition={{
        duration: 0.25,
      }}
      className={`
        w-full
        rounded-lg
        p-3
        flex items-center justify-between
        border-2

        ${
          editable
            ? `
              cursor-pointer
              border-blue-200
              hover:border-blue-500
              hover:bg-blue-50
            `
            : eliminando
            ? `
              cursor-pointer
              border-red-200
              hover:border-red-500
              hover:bg-red-50
            `
            : `
              border-primary-500
              bg-white
            `
        }
      `}
    >
      <div className="flex-1 space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-medium text-sm text-black">
            {nombre}
          </span>
          <span className="text-xs text-gray-500">
            {nivel}
          </span>
        </div>
        {/* Barra */}
        <div className="w-full bg-gray-200 h-2 rounded overflow-hidden">
          <motion.div
            className="bg-green-600 h-2 rounded"
            initial={{ width: 0 }}
            animate={{
              width: getWidth(nivel),
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
          />
        </div>

      </div>
    </motion.div>
  );
}