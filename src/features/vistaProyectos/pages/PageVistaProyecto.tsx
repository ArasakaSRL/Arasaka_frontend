import { ArrowLeft, Info, Code } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useVistaProyecto } from "../hooks/useVistaProyecto";
import { TecnologiasList } from "../components/TecnologiasLista";
import { CardFechas } from "../components/CardFechas";
import { ImagenProyecto } from "../components/ImagenProyectos";
import { ProyectoLinks } from "../components/LinksProyecto";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export default function PageVistaProyecto() {
  const navigate = useNavigate();

  const { slug, id } = useParams<{
    slug: string;
    id: string;
  }>();

  const { proyecto } = useVistaProyecto(id ?? "");

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="px-6 lg:px-10 py-10"
      >
        {/* VOLVER */}
        <motion.button
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate(`/portafolio/${slug}`)}
          className="flex items-center text-primary-500 gap-2 text-sm font-medium hover:opacity-70 transition"
        >
          <ArrowLeft size={22} />
          Volver
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-14 mt-10">
          {/* IZQUIERDA */}
          <motion.section
            initial="hidden"
            animate="visible"
            transition={{
              staggerChildren: 0.15,
            }}
            className="space-y-8"
          >
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5 }}
            >
              <p className="uppercase text-sm tracking-widest text-black pb-4 text-left">
                <Info size={18} className="inline mr-2" />
                Detalles del proyecto
              </p>

              <motion.h1
                variants={fadeUp}
                transition={{ duration: 0.6 }}
                className="uppercase text-4xl lg:text-5xl font-black text-black text-left leading-tight"
              >
                {proyecto?.nombre}
              </motion.h1>

              <motion.h2
                variants={fadeUp}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-2xl lg:text-3xl font-semibold text-left text-black mt-6"
              >
                Sobre el proyecto
              </motion.h2>

              <motion.p
                variants={fadeUp}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-black/80 leading-relaxed text-base lg:text-lg text-left mt-4"
              >
                {proyecto?.descripcion}
              </motion.p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.6 }}
            >
              <p className="uppercase text-sm tracking-widest text-black pb-4 text-left">
                <Code size={18} className="inline mr-2" />
                Tecnologías
              </p>

              <motion.div
                whileHover={{
                  y: -2,
                }}
                transition={{
                  duration: 0.2,
                }}
              >
                <TecnologiasList
                  tecnologias={proyecto?.tecnologias || []}
                />
              </motion.div>
            </motion.div>
          </motion.section>

          {/* DERECHA */}
          <motion.section
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.2,
            }}
            className="space-y-6"
          >
            <motion.div
              whileHover={{
                y: -3,
              }}
              transition={{ duration: 0.2 }}
            >
              <CardFechas
                inicio={proyecto?.fecha_inicio ?? ""}
                fin={proyecto?.fecha_fin ?? ""}
              />
            </motion.div>

            <motion.div
              whileHover={{
                y: -3,
              }}
              transition={{ duration: 0.2 }}
            >
              <ImagenProyecto
                imagenes={proyecto?.url_imagen || []}
              />
            </motion.div>

            <motion.div
              whileHover={{
                y: -3,
              }}
              transition={{ duration: 0.2 }}
            >
              <ProyectoLinks
                githubUrl={proyecto?.url_github ?? null}
                demoUrl={proyecto?.url_demo ?? null}
              />
            </motion.div>
          </motion.section>
        </div>
      </motion.div>
    </main>
  );
}