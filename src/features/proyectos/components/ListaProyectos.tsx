import type { Proyecto } from "../lib/ProyectosApi";
import CardProyectos from "./CardProyectos";
import { motion } from "framer-motion";

interface Props {
  proyectos: Proyecto[];
  loading: boolean;
  modoAccion: "editar" | "eliminar" | null;
  onEditar: (proyecto: Proyecto) => void;
  onEliminar: (
    proyecto: Proyecto
  ) => void;
}

export default function ListaProyectos({
  proyectos,
  loading,
  modoAccion,
  onEditar,
  onEliminar,
}: Props) {

  if (loading) {
    return (
      <div className="w-full py-10 text-center">
        <p className="text-gray-500">
          Cargando Proyectos.
        </p>
      </div>
    );
  }

  if (proyectos.length === 0) {
    return (
      <div className="w-full py-10 text-center">
        <p className="text-gray-500">
          Aún no hay proyectos registrados.
        </p>
      </div>
    )
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {proyectos.map((proyecto) => (
        <motion.div
          key={proyecto.id_proyecto}
          variants={cardVariants}
          transition={{ duration: 0.3 }}
        >
          <CardProyectos
            proyecto={proyecto}
            editable={modoAccion === "editar"}
            eliminando={modoAccion === "eliminar"}
            onSelect={() => {
              if (modoAccion === "editar") {
                onEditar(proyecto);
                return;
              }

              if (modoAccion === "eliminar") {
                onEliminar(proyecto);
              }
            }}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}