import type { Tecnologias } from "@/features/proyectos/lib/ProyectosApi";
import { motion } from "framer-motion";
import { Code2 } from "lucide-react";

interface Props {
  tecnologias: Tecnologias[];
}

export const TecnologiasList = ({
  tecnologias,
}: Props) => {
  if (tecnologias.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        No hay tecnologías registradas
      </div>
    );
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className=" flex flex-wrap gap-5 p-6 rounded-3xl border border-gray-200 bg-linear-to-br from-[#f8f8f8] to-[#efefef] shadow-sm justify-center sm:justify-start items-center
      "
    >
      {tecnologias.map((tech) => (
        <div
          key={tech.id_tecnologia}
          className="relative group"
        >
          {/* ICONO */}
          <motion.div
            whileHover={{
              scale: 1.12,
              rotate: 4,
              y: -4,
            }}
            transition={{
              duration: 0.2,
            }}
            className=" w-20 h-20 rounded-full border border-gray-200 bg-white flex items-center justify-center cursor-pointer shadow-md relative z-10 transition-all duration-300 group-hover:shadow-xl group-hover:border-primary-200
            "
          >
            {tech.logo ? (
              <img
                src={tech.logo}
                alt={tech.nombre}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
                className=" max-w-12 max-h-12 object-contain pointer-events-none select-none
                "
              />
            ) : (
              <Code2 size={26} />
            )}
          </motion.div>

          {/* TOOLTIP */}
          <div
            className=" absolute bottom-24 left-1/2 -translate-x-1/2 rounded-2xl bg-primary-500 px-4 py-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 whitespace-nowrap shadow-xl z-30 group-hover:-translate-y-1
            "
          >
            <p className="text-xs font-extrabold text-white">
              {tech.nombre}
            </p>

            {/* FLECHA */}
            <div
              className=" absolute left-1/2 top-full w-3 h-3 bg-primary-500 rotate-45 -translate-x-1/2 -translate-y-1/2
              "
            />
          </div>
        </div>
      ))}
    </motion.div>
  );
};